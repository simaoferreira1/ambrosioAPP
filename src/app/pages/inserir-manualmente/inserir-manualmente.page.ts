import { Component, OnInit } from '@angular/core';
import { FoodService, Food } from '../../services/food.service';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  LoadingController,
  ToastController
} from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-inserir-manualmente',
  templateUrl: './inserir-manualmente.page.html',
  styleUrls: ['./inserir-manualmente.page.scss'],
  standalone: false
})
export class InserirManualmentePage implements OnInit {
  produto: string = '';
  quantidade: number | null = null;
  dataCompra: string = '';
  dataValidade: string = '';
  unidade: string = 'un';

  mostrarCalendarioCompra = false;
  mostrarCalendarioValidade = false;

  private currentUserId: number = 0;
  private loadingEl: HTMLIonLoadingElement | null = null;

  constructor(
    private authService: AuthService,
    private foodService: FoodService,
    private storage: Storage,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    // Init storage
    await this.storage.create();

    // Load current user
    const user: User | null = await this.authService.getCurrentUser();
    if (user?.id) {
      this.currentUserId = user.id;
    } else {
      const toast = await this.toastController.create({
        message: 'Not authenticated – please log in.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      this.router.navigateByUrl('/login');
    }
  }

  abrirCalendarioCompra() {
    this.mostrarCalendarioCompra = true;
  }

  abrirCalendarioValidade() {
    this.mostrarCalendarioValidade = true;
  }

  private async presentLoading() {
    this.loadingEl = await this.loadingCtrl.create({
      message: 'Submitting...',
      spinner: 'crescent',
      backdropDismiss: false
    });
    await this.loadingEl.present();
  }

  private async dismissLoading() {
    if (this.loadingEl) {
      await this.loadingEl.dismiss();
      this.loadingEl = null;
    }
  }

  async guardarAlimento() {
    // Validation
    if (
      !this.produto ||
      this.quantidade === null ||
      !this.dataCompra ||
      !this.dataValidade ||
      this.currentUserId === 0
    ) {
      const toast = await this.toastController.create({
        message: 'Please fill in all fields correctly.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }
    if (this.quantidade <= 0) {
      const toast = await this.toastController.create({
        message: 'Quantity must be greater than zero.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }
    if (new Date(this.dataValidade) < new Date(this.dataCompra)) {
      const toast = await this.toastController.create({
        message: 'Expiration date cannot be before purchase date.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    const payload = {
      name: this.produto,
      quantity: this.quantidade,
      buyDate: this.dataCompra,
      expirationDate: this.dataValidade,
      userId: this.currentUserId
    };

    console.log('Payload →', payload);

    await this.presentLoading();

    this.foodService.addFood(payload).subscribe(
      async (created: Food) => {
        await this.dismissLoading();

        // Build full product with unit + image URL
        const fullProduct = {
          id: created.id,
          name: created.name,
          quantity: created.quantity,
          unit: this.unidade,
          buyDate: created.buyDate,
          expirationDate: created.expirationDate,
          imageUrl: created.image?.url || 'assets/placeholder.png'
        };

        // Save in Ionic Storage
        const key = `localFoods_user_${this.currentUserId}`;
        const existing = (await this.storage.get(key)) || [];
        existing.unshift(fullProduct);
        await this.storage.set(key, existing);

        // Success toast
        const toast = await this.toastController.create({
          message: 'Product added and saved locally!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();

        // Reset form
        this.produto = '';
        this.quantidade = null;
        this.dataCompra = '';
        this.dataValidade = '';

        // Navigate to Tab 2
        this.router.navigateByUrl('/tabs/tab2');
      },
      async err => {
        console.error('Save error →', err);
        await this.dismissLoading();
        const toast = await this.toastController.create({
          message: err.error?.error
            ? `Failed: ${err.error.error}`
            : 'Failed to save product.',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    );
  }
}
