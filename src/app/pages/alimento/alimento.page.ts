// src/app/pages/alimento/alimento.page.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { FoodService } from 'src/app/services/food.service';

@Component({
  selector: 'app-alimento',
  templateUrl: './alimento.page.html',
  styleUrls: ['./alimento.page.scss'],
  standalone: false
})
export class AlimentoPage implements OnInit {
  alimento: {
    id: number;
    nome: string;
    imagem: string;
    quantidade: string;
    unidade: string;
    dataCompra: string;
    dataValidade: string;
  } = {
    id: 0,
    nome: '',
    imagem: '',
    quantidade: '',
    unidade: '',
    dataCompra: '',
    dataValidade: ''
  };

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private toastController: ToastController,
    private foodService: FoodService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.alimento = {
        id: Number(params['id'] || 0),
        nome: params['nome'] || '',
        imagem: params['imagem'] || '',
        quantidade: params['quantidade'] || '',
        unidade: params['unidade'] || '',
        dataCompra: params['dataCompra'] || '',
        dataValidade: params['dataValidade'] || ''
      };
    });
  }

  async confirmarRemocao() {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to delete the food item?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'btn-nao'
        },
        {
          text: 'Yes',
          handler: () => this.removerAlimento(),
          cssClass: 'btn-sim'
        }
      ],
      cssClass: 'alert-personalizado'
    });

    await alert.present();
  }

  async removerAlimento() {
    if (!this.alimento.id) {
      console.error('Invalid ID when trying to remove.');
      const toast = await this.toastController.create({
        message: 'Invalid ID. Removal failed.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    this.foodService.deleteFood(this.alimento.id).subscribe({
      next: async () => {
        console.log('✅ Food item removed on the server, ID:', this.alimento.id);
        const toast = await this.toastController.create({
          message: 'Food item removed with success!',
          duration: 2000,
          color: 'warning'
        });
        await toast.present();
        this.router.navigateByUrl('/tabs/tab2');
      },
      error: async err => {
        console.error('❌ Error removing food item:', err);
        const toast = await this.toastController.create({
          message: 'Failed to remove product. Please try again',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }
}
