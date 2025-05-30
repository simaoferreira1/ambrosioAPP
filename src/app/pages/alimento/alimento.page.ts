import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-alimento',
  templateUrl: './alimento.page.html',
  styleUrls: ['./alimento.page.scss'],
  standalone: false
})
export class AlimentoPage implements OnInit {
  alimento: any = {
    nome: '',
    imagem: '',
    quantidade: '',
    dataCompra: '',
    dataValidade: ''
  };

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.alimento = {
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
    console.log('Alimento removido:', this.alimento.nome);
    // Lógica da API futura
  }
}
