// src/app/pages/tab2/tab2.page.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FoodService, Food } from '../services/food.service';
import { AuthService, User } from '../services/auth.service';
import { ViewWillEnter, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: false
})
export class Tab2Page implements ViewWillEnter {
  alimentos: Array<{
    id: number;
    nome: string;
    imagem: string;
    quantidade: string;
    unidade: string;
    dataCompra: string;
    dataValidade: string;
  }> = [];

  constructor(
    private authService: AuthService,
    private foodService: FoodService,
    private router: Router,
    private toastController: ToastController
  ) {}

  private fmt(iso: string): string {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
  }

  /** Only load from local storage on view enter */
  async ionViewWillEnter(): Promise<void> {
    const user: User | null = await this.authService.getCurrentUser();
    if (!user?.id) {
      this.router.navigateByUrl('/login');
      return;
    }

    try {
      const list: Food[] = await this.foodService.getLocalFoods(user.id);
      const mapped = list.map(f => ({
        id: f.id,
        nome: f.name,
        imagem: f.image?.url ?? 'assets/placeholder.png',
        quantidade: (f.quantity ?? 0).toString(),
        unidade: (f.unit ?? 'un'),
        dataCompra: f.buyDate ? this.fmt(f.buyDate) : 'Unknown',
        dataValidade: f.expirationDate ? this.fmt(f.expirationDate) : 'Unknown'
      }));
      this.alimentos = this.merge(mapped);
    } catch (err: any) {
      console.error('Error loading local foods:', err);
      const toast = await this.toastController.create({
        message: 'Failed to load foods locally.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }

  /** Merge duplicates by name+unit */
  private merge(arr: typeof this.alimentos): typeof this.alimentos {
    const map = new Map<string, typeof this.alimentos[0]>();
    for (const it of arr) {
      const key = `${it.nome.toLowerCase()}|${it.unidade}`;
      if (map.has(key)) {
        const ex = map.get(key)!;
        ex.quantidade = (
          parseFloat(ex.quantidade) +
          parseFloat(it.quantidade)
        ).toString();
      } else {
        map.set(key, { ...it });
      }
    }
    return Array.from(map.values());
  }
}
