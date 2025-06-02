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
  dataCompra: string = '';
  dataValidade: string = '';
  imagemProduto: string = 'assets/placeholder.png';

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

  ngOnInit() {
    // Nothing needed here for now
  }

  async iniciarScan() {
    try {
      // 1) Escanear código
      const scanResult: BarcodeScanResult = await this.barcodeScanner.scan();

      if (!scanResult.text || scanResult.cancelled) {
        return;
      }

      // 2) Extrair o valor puro do código de barras (retira “format:…” se houver)
      const raw = scanResult.text;
      const parts = raw.split(':');
      const barcode = parts.length > 1 ? parts[1] : parts[0];

      // 3) Buscar no endpoint /api/v1/products?barcode=<valor>
      const url = `${this.apiBase}/products?barcode=${encodeURIComponent(barcode)}`;
      this.http.get<{ name: string; imageUrl: string }>(url).subscribe({
        next: data => {
          // 4) Preencher campos com nome e imagem
          this.produto = data.name;
          this.imagemProduto = data.imageUrl || 'assets/placeholder.png';
          // Campos manuais ficam em branco para o usuário preencher
          this.quantidade = '';
          this.dataCompra = '';
          this.dataValidade = '';
        },
        error: async err => {
          console.error('Erro ao buscar produto:', err);
          this.produto = 'Produto não encontrado';
          this.imagemProduto = 'assets/placeholder.png';
          const toast = await this.toastController.create({
            message: 'Produto não encontrado.',
            duration: 2000,
            color: 'warning'
          });
          await toast.present();
        }
      });
    } catch (err) {
      console.error('Erro no scan:', err);
      const toast = await this.toastController.create({
        message: 'Falha ao escanear código.',
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

  /**
   * Ao tocar em "Adicionar", salva no backend atrelado ao usuário atual,
   * e depois (internamente) em LocalStorage via FoodService.addFood().
   */
  async adicionarProduto() {
    // 1) Obter usuário logado
    const user: User | null = await this.authService.getCurrentUser();
    if (!user) {
      console.error('Nenhum usuário autenticado.');
      const toast = await this.toastController.create({
        message: 'Usuário não autenticado.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    // 2) Validar campos obrigatórios
    if (
      !this.produto ||
      !this.quantidade ||
      !this.dataCompra ||
      !this.dataValidade
    ) {
      const toast = await this.toastController.create({
        message: 'Por favor, preencha todos os campos antes de adicionar.',
        duration: 2000,
        color: 'warning'
      });
      await toast.present();
      return;
    }

    // 3) Montar payload para a API
    // Supondo que dataCompra / dataValidade já estejam no formato ISO (YYYY-MM-DD).
    const payload = {
      name: this.produto,
      quantity: parseFloat(
        this.quantidade.replace(/[^\d.,]/g, '').replace(',', '.')
      ) || 1,
      buyDate: this.dataCompra,
      expirationDate: this.dataValidade,
      userId: user.id
    };

    console.log('📤 Payload para addFood:', payload);

    // 4) Mostrar loading enquanto a requisição via FoodService ocorre
    await this.presentLoading('Adicionando produto...');

    this.foodService.addFood(payload).subscribe(
      async (created: Food) => {
        console.log('Food criado no servidor:', created);

        // 5) Dismiss loading e exibir toast de sucesso
        await this.dismissLoading();
        const toast = await this.toastController.create({
          message: 'Produto adicionado com sucesso!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();

        // 6) Navegar de volta para a lista (Tab 2)
        this.router.navigateByUrl('/tabs/tab2');
      },
      async err => {
        console.error('Erro ao criar food no servidor:', err);

        // 7) Dismiss loading e exibir toast de erro
        await this.dismissLoading();
        const msg =
          err.error && err.error.error
            ? `Falha: ${err.error.error}`
            : 'Falha ao adicionar produto. Veja o console para detalhes.';
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
