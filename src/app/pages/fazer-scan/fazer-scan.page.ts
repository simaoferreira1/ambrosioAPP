// src/app/pages/fazer-scan/fazer-scan.page.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BarcodeScanner, BarcodeScanResult } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { AuthService, User } from '../../services/auth.service';
import { FoodService, Food } from '../../services/food.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-fazer-scan',
  templateUrl: './fazer-scan.page.html',
  styleUrls: ['./fazer-scan.page.scss'],
  standalone: false,
})
export class FazerScanPage implements OnInit {
  produto = '…';
  quantidade = '';
  unidade = 'un';
  dataCompra = '';
  dataValidade = '';
  imagemProduto = 'assets/placeholder.png';

  mostrarCalendarioCompra = false;
  mostrarCalendarioValidade = false;

  private apiBase = 'https://prisma-api-three.vercel.app/api/v1';
  private loadingEl: HTMLIonLoadingElement | null = null;
  private currentUserId = 0;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private http: HttpClient,
    private authService: AuthService,
    private foodService: FoodService,
    private storage: Storage,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.storage.create();
    const user: User | null = await this.authService.getCurrentUser();
    if (user?.id) {
      this.currentUserId = user.id;
    } else {
      const toast = await this.toastController.create({
        message: 'User not authenticated.',
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

  private async presentLoading(message: string) {
    this.loadingEl = await this.loadingCtrl.create({
      message,
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

  async iniciarScan() {
    try {
      const scanResult: BarcodeScanResult = await this.barcodeScanner.scan();
      if (scanResult.cancelled || !scanResult.text) return;

      const barcode = scanResult.text.split(':').pop()!;
      const url = `${this.apiBase}/products?barcode=${encodeURIComponent(barcode)}`;

      this.http.get<{ name: string; imageUrl: string }>(url).subscribe({
        next: data => {
          this.produto = data.name;
          this.imagemProduto = data.imageUrl || 'assets/placeholder.png';
          this.quantidade = '';
          this.dataCompra = '';
          this.dataValidade = '';
        },
        error: async () => {
          this.produto = 'Product not found';
          this.imagemProduto = 'assets/placeholder.png';
          const toast = await this.toastController.create({
            message: 'Product not found.',
            duration: 2000,
            color: 'warning'
          });
          await toast.present();
        }
      });
    } catch {
      const toast = await this.toastController.create({
        message: 'Failed to scan barcode.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  async adicionarProduto() {
    const user: User | null = await this.authService.getCurrentUser();
    if (!user) {
      const toast = await this.toastController.create({
        message: 'User not authenticated.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    if (!this.produto || !this.quantidade || !this.dataCompra || !this.dataValidade) {
      const toast = await this.toastController.create({
        message: 'Please fill in all fields before adding.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const qty = parseFloat(this.quantidade.replace(',', '.'));
    if (isNaN(qty) || qty <= 0) {
      const toast = await this.toastController.create({
        message: 'Invalid quantity.',
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
      quantity: qty,
      buyDate: this.dataCompra,
      expirationDate: this.dataValidade,
      userId: user.id
    };

    await this.presentLoading('Adding product...');

    this.foodService.addFood(payload).subscribe(
      async createdFood => {
        await this.dismissLoading();

        // Full product object with image from API
        const fullProduct = {
          id: createdFood.id,
          name: createdFood.name,
          quantity: createdFood.quantity,
          unit: this.unidade,
          buyDate: createdFood.buyDate,
          expirationDate: createdFood.expirationDate,
          imageUrl: createdFood.image?.url || this.imagemProduto
        };

        // Save locally
        const key = `localFoods_user_${user.id}`;
        const existing = (await this.storage.get(key)) || [];
        existing.unshift(fullProduct);
        await this.storage.set(key, existing);

        const toast = await this.toastController.create({
          message: 'Product added successfully!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();

        this.router.navigateByUrl('/tabs/tab2');
      },
      async err => {
        await this.dismissLoading();
        const toast = await this.toastController.create({
          message: err.error?.error || 'Failed to add product.',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    );
  }
}
