// src/app/pages/alimento/alimento.page.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService, User } from '../../services/auth.service';
import { FoodService } from '../../services/food.service';
import { Storage } from '@ionic/storage-angular';

interface LocalFood {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  buyDate: string;
  expirationDate: string;
  imageUrl: string;
}

@Component({
  selector: 'app-alimento',
  templateUrl: './alimento.page.html',
  styleUrls: ['./alimento.page.scss'],
  standalone: false
})
export class AlimentoPage implements OnInit {
  rawFoods: LocalFood[] = [];
  alimento = {
    nome: '',
    imagem: '',
    quantidade: 0,
    unidade: '',
    dataCompra: '',
    dataValidade: ''
  };

  constructor(
    private route: ActivatedRoute,
    private auth: AuthService,
    private storage: Storage,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private foodService: FoodService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
  const nome = this.route.snapshot.queryParamMap.get('nome') || '';
  const unidade = this.route.snapshot.queryParamMap.get('unidade') || '';
  const imagemFallback = this.route.snapshot.queryParamMap.get('imagem') || 'assets/placeholder.png';

  const user: User | null = await this.auth.getCurrentUser();
  if (!user?.id) {
    await this.presentToast('User not authenticated.', 'danger');
    return void this.router.navigateByUrl('/login');
  }

  await this.storage.create();
  const key = `localFoods_user_${user.id}`;
  const all: LocalFood[] = (await this.storage.get(key)) || [];

  this.rawFoods = all.filter(f => f.name === nome);
  if (!this.rawFoods.length) {
    // Use fallback from queryParams if storage has no entry
    this.alimento = {
      nome,
      imagem: imagemFallback,
      quantidade: 0,
      unidade,
      dataCompra: '-',
      dataValidade: '-'
    };
    return;
  }

  const totalQty = this.rawFoods.reduce((s, f) => s + f.quantity, 0);
  const minBuy = this.rawFoods
    .map(f => new Date(f.buyDate))
    .reduce((a, b) => (a < b ? a : b))
    .toISOString();
  const maxExp = this.rawFoods
    .map(f => new Date(f.expirationDate))
    .reduce((a, b) => (a > b ? a : b))
    .toISOString();
  const imageUrl = this.rawFoods[0].imageUrl || imagemFallback;

  this.alimento = {
    nome,
    imagem: imageUrl,
    quantidade: totalQty,
    unidade,
    dataCompra: this.formatDate(minBuy),
    dataValidade: this.formatDate(maxExp)
  };
}


  private formatDate(iso: string) {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  async confirmarRemocao() {
    const inputs = this.rawFoods.map(f => ({
      name: this.formatDate(f.expirationDate),
      type: 'radio' as const,
      label: `${this.formatDate(f.buyDate)} → ${this.formatDate(f.expirationDate)} (${f.quantity}${this.alimento.unidade})`,
      value: f.id
    }));

    const alert = await this.alertCtrl.create({
      header: 'Which entry do you want to remove?',
      inputs,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Remove', handler: id => this.removerEntrada(id) }
      ]
    });
    await alert.present();
  }

  private async removerEntrada(id: number) {
    // 1) Delete on server
    this.foodService.deleteFood(id).subscribe({
      next: async () => {
        // 2) Remove from local storage
        const user: User | null = await this.auth.getCurrentUser();
        const key = `localFoods_user_${user!.id}`;
        const list: LocalFood[] = (await this.storage.get(key)) || [];
        const filtered = list.filter(f => f.id !== id);
        await this.storage.set(key, filtered);

        // 3) Update rawFoods & merged display
        this.rawFoods = this.rawFoods.filter(f => f.id !== id);
        if (!this.rawFoods.length) {
          await this.presentToast('All entries removed.', 'warning');
          return void this.router.navigateByUrl('/tabs/tab2');
        }
        this.updateMerged();
        await this.presentToast('Entry removed.', 'success');
      },
      error: async () => {
        await this.presentToast('Failed to remove entry.', 'danger');
      }
    });
  }

  private updateMerged() {
    const totalQty = this.rawFoods.reduce((s, f) => s + f.quantity, 0);
    const minBuy = this.rawFoods
      .map(f => new Date(f.buyDate))
      .reduce((a, b) => (a < b ? a : b))
      .toISOString();
    const maxExp = this.rawFoods
      .map(f => new Date(f.expirationDate))
      .reduce((a, b) => (a > b ? a : b))
      .toISOString();
    this.alimento.quantidade = totalQty;
    this.alimento.dataCompra = this.formatDate(minBuy);
    this.alimento.dataValidade = this.formatDate(maxExp);
  }

  private async presentToast(message: string, color: 'success'|'warning'|'danger') {
    const t = await this.toastCtrl.create({ message, duration: 2000, color });
    await t.present();
  }
}
