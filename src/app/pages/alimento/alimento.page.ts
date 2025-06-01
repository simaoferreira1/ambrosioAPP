import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
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
    private foodService: FoodService,
    private router: Router
  ) {}

  ngOnInit() {
    // Subscribe to queryParams and assign id + fields
    this.route.queryParams.subscribe(params => {
      this.alimento = {
        id: Number(params['id']),           // Must match "id" from Tab2 queryParams
        nome: params['nome'],
        imagem: params['imagem'],
        quantidade: params['quantidade'],
        dataCompra: params['dataCompra'],
        dataValidade: params['dataValidade']
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

  removerAlimento() {
    if (!this.alimento.id) {
      console.error('ID inválido ao tentar remover.');
      return;
    }

    this.foodService.deleteFood(this.alimento.id).subscribe({
      next: () => {
        console.log('✅ Alimento removido no servidor, ID:', this.alimento.id);
        // After deletion, navigate back to Tab 2
        this.router.navigateByUrl('/tabs/tab2');
      },
      error: async err => {
        console.error('❌ Erro ao remover alimento:', err);
        const errorAlert = await this.alertController.create({
          header: 'Erro',
          message: 'Falha ao remover o alimento. Por favor tente novamente.',
          buttons: ['OK']
        });
        await errorAlert.present();
      }
    });
  }
}
