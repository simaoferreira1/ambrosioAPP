// src/app/pages/fazer-scan/fazer-scan.page.ts

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BarcodeScanner, BarcodeScanResult } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { AuthService, User } from '../../services/auth.service';
import { FoodService, Food } from '../../services/food.service';

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

  constructor(
    private barcodeScanner: BarcodeScanner,
    private http: HttpClient,
    private authService: AuthService,
    private foodService: FoodService
  ) {}

  ngOnInit() {
    // nothing here yet
  }

  /**
   * Inicia o scanner de código de barras e depois
   * busca os dados do produto pelo endpoint /products
   */
  async iniciarScan() {
    try {
      // 1) Escanear código
      const scanResult: BarcodeScanResult = await this.barcodeScanner.scan();

      if (!scanResult.text || scanResult.cancelled) {
        return;
      }

      // 2) Extrair o valor puro do código de barras
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
        error: err => {
          console.error('Erro ao buscar produto:', err);
          this.produto = 'Produto não encontrado';
          this.imagemProduto = 'assets/placeholder.png';
        }
      });
    } catch (err) {
      console.error('Erro no scan:', err);
    }
  }

  /**
   * Ao tocar em "Adicionar", salva no backend atrelado ao usuário atual,
   * e depois em LocalStorage.
   */
  async adicionarProduto() {
    // 1) Obter usuário logado
    const user: User | null = await this.authService.getCurrentUser();
    if (!user) {
      console.error('Nenhum usuário autenticado.');
      return;
    }

    // 2) Validar campos obrigatórios
    if (!this.produto || !this.quantidade || !this.dataCompra || !this.dataValidade) {
      alert('Por favor, preencha todos os campos antes de adicionar.');
      return;
    }

    // 3) Montar payload para a API
    const payload = {
      name: this.produto,
      quantity: parseFloat(this.quantidade.replace(/[^\d.,]/g, '').replace(',', '.')) || 1,
      buyDate: this.dataCompra,        // espera "DD-MM-AAAA" ou ISO?
      expirationDate: this.dataValidade, // espera "DD-MM-AAAA" ou ISO?
      userId: user.id
    };

    // 4) Chamar FoodService para criar no backend
    this.foodService.addFood(payload).subscribe({
      next: async (created: Food) => {
        console.log('Food criado no servidor:', created);

        // 5) Salvar localmente em storage
        try {
          await this.foodService.addLocalFood(user.id, created);
          console.log('Food salvo localmente:', created);
        } catch (storageErr) {
          console.error('Erro ao salvar localmente:', storageErr);
        }

        alert('Produto adicionado com sucesso!');
        // Opcional: navegar de volta para a lista
      },
      error: err => {
        console.error('Erro ao criar food no servidor:', err);
        alert('Falha ao adicionar produto. Veja o console para detalhes.');
      }
    });
  }
}
