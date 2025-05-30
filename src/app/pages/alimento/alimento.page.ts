import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-alimento',
  templateUrl: './alimento.page.html',
  styleUrls: ['./alimento.page.scss'],
})
export class AlimentoPage {
  alimento = {
    nome: 'Maçã',
    imagem: 'assets/macas.jpg',
    quantidade: '5 maçãs',
    dataCompra: '19-03-2025',
    dataValidade: '26-03-2025'
  };

  constructor(private alertController: AlertController) {}

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
    // fazer a lógica quando a api estiver on
  }
}
