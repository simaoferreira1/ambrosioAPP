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
    dataCompra: string;
    dataValidade: string;
  } = {
    id: 0,
    nome: '',
    imagem: '',
    quantidade: '',
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
    // 1) Subscribe a queryParams para popular 'alimento'
    this.route.queryParams.subscribe(params => {
      this.alimento = {
        id: Number(params['id'] || 0),  // Deve vir de Tab2
        nome: params['nome'] || '',
        imagem: params['imagem'] || '',
        quantidade: params['quantidade'] || '',
        dataCompra: params['dataCompra'] || '',
        dataValidade: params['dataValidade'] || ''
      };
    });
  }

  async confirmarRemocao() {
    const alert = await this.alertController.create({
      header: 'Tem a certeza que quer remover este produto?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'btn-nao'
        },
        {
          text: 'Sim',
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
      console.error('ID inválido ao tentar remover.');
      const toast = await this.toastController.create({
        message: 'ID inválido. Não foi possível remover.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    this.foodService.deleteFood(this.alimento.id).subscribe({
      next: async () => {
        console.log('✅ Alimento removido no servidor, ID:', this.alimento.id);
        const toast = await this.toastController.create({
          message: 'Alimento removido com sucesso!',
          duration: 2000,
          color: 'success'
        });
        await toast.present();

        // 3) Navegar de volta para Tab 2 depois de exibir o toast
        this.router.navigateByUrl('/tabs/tab2');
      },
      error: async err => {
        console.error('❌ Erro ao remover alimento:', err);
        const toast = await this.toastController.create({
          message: 'Falha ao remover produto. Tente novamente.',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }
}