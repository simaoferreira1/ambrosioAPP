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
    await this.loadLocalFoods();
    await this.loadFoodsFromApi();
  }

  private async loadLocalFoods(): Promise<void> {
  const user: User | null = await this.authService.getCurrentUser();
  if (!user) {
    this.router.navigateByUrl('/login');
    return;
  }
  const localFoods: Food[] = await this.foodService.getLocalFoods(user.id);
  const mapped = localFoods.map(f => ({
    id: f.id,
    nome: f.name,
    imagem: f.image?.url || 'assets/placeholder.png',
    quantidade: f.quantity !== undefined && f.quantity !== null ? f.quantity.toString() : '0',
    dataCompra: f.buyDate ? this.formatDate(f.buyDate) : 'Unknown',
    dataValidade: f.expirationDate ? this.formatDate(f.expirationDate) : 'Unknown'
  }));
  this.alimentos = this.mergeAlimentos(mapped);
}

private async loadFoodsFromApi(): Promise<void> {
  const user: User | null = await this.authService.getCurrentUser();
  if (!user) return;

  this.foodService.getFoods(user.id).subscribe(
    (foods: Food[]) => {
      const mapped = foods.map(f => ({
        id: f.id,
        nome: f.name,
        imagem: f.image?.url || 'assets/placeholder.png',
        quantidade: f.quantity !== undefined && f.quantity !== null ? f.quantity.toString() : '0',
        dataCompra: f.buyDate ? this.formatDate(f.buyDate) : 'Unknown',
        dataValidade: f.expirationDate ? this.formatDate(f.expirationDate) : 'Unknown'
      }));
      this.alimentos = this.mergeAlimentos(mapped);
      this.overwriteLocalFoods(user.id, foods);
    },
    async err => {
      console.error('Erro ao obter alimentos do servidor:', err);
      const toast = await this.toastController.create({
        message: 'Failed to load from server; using local data.',
        duration: 3000,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
    }
  );
}


  /**
   * Merges array entries with the same `nome` by summing their `quantidade`.
   */
  private mergeAlimentos(list: typeof this.alimentos): typeof this.alimentos {
  const map = new Map<string, typeof this.alimentos[0]>();

  for (const item of list) {
    if (!item.nome) {
      console.warn('Skipping item with missing nome:', item);
      continue;
    }

    const key = item.nome.toLowerCase();

    if (map.has(key)) {
      const existing = map.get(key)!;
      const sum = parseFloat(existing.quantidade) + parseFloat(item.quantidade);
      existing.quantidade = sum.toString();
    } else {
      map.set(key, { ...item });
    }
  }

  return Array.from(map.values());
}


  private async overwriteLocalFoods(userId: number, foods: Food[]) {
    // ensure storage sync; implementation as before
    for (const f of foods) {
      await this.foodService['replaceLocalFood'](userId, f);
    }
  }
}
