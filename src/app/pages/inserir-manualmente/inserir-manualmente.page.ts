import { Component, OnInit } from '@angular/core';
import { FoodService, Food } from '../../services/food.service';
import { AuthService, User } from '../../services/auth.service';
import { Router } from '@angular/router';
import {
  LoadingController,
  ToastController
} from '@ionic/angular';

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
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    const user: User | null = await this.authService.getCurrentUser();
    if (user && user.id) {
      this.currentUserId = user.id;
      console.log('Current user ID:', this.currentUserId);
    } else {
      console.warn('User not authenticated. Redirecting to login...');
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

    // ❌ Quantidade negativa ou zero
    if (this.quantidade <= 0) {
      const toast = await this.toastController.create({
        message: 'It is not possible to add products with negative or zero quantity.',
        duration: 2500,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    // ❌ Data de validade anterior à compra
    const compra = new Date(this.dataCompra);
    const validade = new Date(this.dataValidade);
    if (validade < compra) {
      const toast = await this.toastController.create({
        message: 'Expiration date cannot be before purchase date.',
        duration: 2500,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    const payload: {
      name: string;
      quantity: number;
      buyDate: string;
      expirationDate: string;
      userId: number;
    } = {
      name: this.produto,
      quantity: this.quantidade,
      buyDate: this.dataCompra,
      expirationDate: this.dataValidade,
      userId: this.currentUserId
    };

    console.log('🔧 Payload to create Food:', payload);

    await this.presentLoading();

    this.foodService.addFood(payload).subscribe(
      async (createdFood: Food) => {
        console.log('Food created on the server:', createdFood);
        await this.dismissLoading();
        this.router.navigateByUrl('/tabs/tab2');
      },
      async (err) => {
        console.error('Error creating food on the server:', err);
        await this.dismissLoading();
        const msg =
          err.error && err.error.error
            ? `Failed: ${err.error.error}`
            : 'Failed to save food. See console for details.';
        const toast = await this.toastController.create({
          message: msg,
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
        this.router.navigateByUrl('/tabs/tab2');
      }
    );
  }
}
