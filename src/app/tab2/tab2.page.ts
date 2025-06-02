// src/app/pages/tab2/tab2.page.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FoodService, Food } from '../services/food.service';
import { AuthService, User } from '../services/auth.service';
import { ViewWillEnter, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false
})
export class Tab2Page implements ViewWillEnter {
  alimentos: Array<{
    id: number;
    nome: string;
    imagem: string;
    quantidade: string;
    dataCompra: string;
    dataValidade: string;
  }> = [];

  constructor(
    private authService: AuthService,
    private foodService: FoodService,
    private router: Router,
    private toastController: ToastController
  ) {}

  private formatDate(iso: string): string {
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  async ionViewWillEnter(): Promise<void> {
    // 1) Recarrega a lista local imediatamente:
    await this.loadLocalFoods();

    // 2) Então, chama o backend para atualizar (se possível):
    await this.loadFoodsFromApi();
  }

  private async loadLocalFoods(): Promise<void> {
    const user: User | null = await this.authService.getCurrentUser();
    if (!user) {
      this.router.navigateByUrl('/login');
      return;
    }
    const localFoods: Food[] = await this.foodService.getLocalFoods(user.id);
    this.alimentos = localFoods.map(f => ({
      id: f.id,
      nome: f.name,
      imagem: f.image?.url || 'assets/placeholder.png',
      quantidade: f.quantity.toString(),
      dataCompra: this.formatDate(f.buyDate),
      dataValidade: this.formatDate(f.expirationDate)
    }));
  }

  private async loadFoodsFromApi(): Promise<void> {
    const user: User | null = await this.authService.getCurrentUser();
    if (!user) {
      return;
    }
    this.foodService.getFoods(user.id).subscribe(
      (foods: Food[]) => {
        this.alimentos = foods.map(f => ({
          id: f.id,
          nome: f.name,
          imagem: f.image?.url || 'assets/placeholder.png',
          quantidade: f.quantity.toString(),
          dataCompra: this.formatDate(f.buyDate),
          dataValidade: this.formatDate(f.expirationDate)
        }));
        // Se quiser manter o local igual ao API, re‐salvar tudo:
        this.overwriteLocalFoods(user.id, foods);
      },
      async err => {
        console.error('Erro ao obter alimentos do servidor:', err);
        const toast = await this.toastController.create({
          message: 'Falha ao carregar do servidor; usando dados locais.',
          duration: 3000,
          color: 'warning',
          position: 'bottom'
        });
        await toast.present();
      }
    );
  }

  private async overwriteLocalFoods(userId: number, foods: Food[]) {
    // Substitui a lista inteira em storage local pelo resultado do backend
    // (para manter sincronizado)
    if (foods && foods.length >= 0) {
      for (const f of foods) {
        // Já está tratado em replaceLocalFood()
        await this.foodService['replaceLocalFood'](userId, f);
      }
    }
  }
}
