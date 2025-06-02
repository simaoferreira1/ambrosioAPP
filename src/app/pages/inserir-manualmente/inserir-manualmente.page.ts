// src/app/pages/inserir-manualmente/inserir-manualmente.page.ts

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
    // 1) Get current user from AuthService
    const user: User | null = await this.authService.getCurrentUser();
    if (user && user.id) {
      this.currentUserId = user.id;
      console.log('Current user ID:', this.currentUserId);
    } else {
      // Not logged in → redirect to login
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
    // 1) Validate form fields
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

    // 2) Build payload for API
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

    // 3) Show loading spinner
    await this.presentLoading();

    // 4) Call the API (new FoodService already saves locally)
    this.foodService.addFood(payload).subscribe(
      async (createdFood: Food) => {
        console.log('Food created on the server:', createdFood);

        // 5) Dismiss loading spinner
        await this.dismissLoading();

        // 6) Navigate directly to Tab 2
        this.router.navigateByUrl('/tabs/tab2');
      },
      async (err) => {
        console.error('Error creating food on the server:', err);

        // 7) Dismiss loading spinner
        await this.dismissLoading();

        // 8) Show error toast
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

        // 9) Navigate to Tab 2 anyway so user sees the (local) list
        this.router.navigateByUrl('/tabs/tab2');
      }
    );
  }
}
