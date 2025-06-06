import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BarcodeScanner, BarcodeScanResult } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { AuthService, User } from '../../services/auth.service';
import { FoodService, Food } from '../../services/food.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fazer-scan',
  templateUrl: './fazer-scan.page.html',
  styleUrls: ['./fazer-scan.page.scss'],
  standalone: false,
})
export class FazerScanPage implements OnInit {
  produto: string = '…';
  quantidade: string = '';
  unidade: string = 'un'; 
  dataCompra: string = '';
  dataValidade: string = '';
  imagemProduto: string = 'assets/placeholder.png';
 
  mostrarCalendarioCompra: boolean = false;
  mostrarCalendarioValidade: boolean = false;

  private apiBase = 'https://prisma-api-three.vercel.app/api/v1';
  private loadingEl: HTMLIonLoadingElement | null = null;

  constructor(
    private barcodeScanner: BarcodeScanner,
    private http: HttpClient,
    private authService: AuthService,
    private foodService: FoodService,
    private toastController: ToastController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}

  ngOnInit() {}

  async iniciarScan() {
    try {
      const scanResult: BarcodeScanResult = await this.barcodeScanner.scan();

      if (!scanResult.text || scanResult.cancelled) {
        return;
      }

      const raw = scanResult.text;
      const parts = raw.split(':');
      const barcode = parts.length > 1 ? parts[1] : parts[0];

      const url = `${this.apiBase}/products?barcode=${encodeURIComponent(barcode)}`;
      this.http.get<{ name: string; imageUrl: string }>(url).subscribe({
        next: data => {
          this.produto = data.name;
          this.imagemProduto = data.imageUrl || 'assets/placeholder.png';
          this.quantidade = '';
          this.dataCompra = '';
          this.dataValidade = '';
        },
        error: async err => {
          console.error('Error fetching product:', err);
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
    } catch (err) {
      console.error('Scan error:', err);
      const toast = await this.toastController.create({
        message: 'Failed to scan barcode.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
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

        const quantidadeNum = parseFloat(this.quantidade.replace(',', '.'));

        if (isNaN(quantidadeNum)) {
      const toast = await this.toastController.create({
        message: 'Quantity is invalid.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    if (quantidadeNum <= 0) {
      const toast = await this.toastController.create({
        message: 'It is not possible to add products with negative or zero quantity.',
        duration: 2500,
        color: 'danger'
      });
      await toast.present();
      return;
    }


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

    const payload = {
      name: this.produto,
      quantity: quantidadeNum,
      buyDate: this.dataCompra,
      expirationDate: this.dataValidade,
      userId: user.id
    };

    await this.presentLoading('Adding product...');

    this.foodService.addFood(payload).subscribe(
      async (created: Food) => {
        await this.dismissLoading();
        const toast = await this.toastController.create({
          message: 'Product successfully added!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
        this.router.navigateByUrl('/tabs/tab2');
      },
      async err => {
        await this.dismissLoading();
        const msg =
          err.error && err.error.error
            ? `Error: ${err.error.error}`
            : 'Failed to add product. Check console for details.';
        const toast = await this.toastController.create({
          message: msg,
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    );
  }
}
