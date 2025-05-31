import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-inserir-manualmente',
  templateUrl: './inserir-manualmente.page.html',
  styleUrls: ['./inserir-manualmente.page.scss'],
})
export class InserirManualmentePage implements OnInit {

  // Propriedades do formulário
  produto: string = '';
  quantidade: number | null = null;
  dataCompra: string = '';
  dataValidade: string = '';

  mostrarCalendarioCompra = false;
  mostrarCalendarioValidade = false;

  constructor(private toastController: ToastController) {}

  ngOnInit() {}

  abrirCalendarioCompra() {
    this.mostrarCalendarioCompra = true;
  }

  abrirCalendarioValidade() {
    this.mostrarCalendarioValidade = true;
  }

  async guardarAlimento() {
    if (this.produto && this.quantidade && this.dataCompra && this.dataValidade) {
      console.log('Produto:', this.produto);
      console.log('Quantidade:', this.quantidade);
      console.log('Data de compra:', this.dataCompra);
      console.log('Data de validade:', this.dataValidade);

      // Mensagem de sucesso
      const toast = await this.toastController.create({
        message: 'Alimento inserido com sucesso!',
        duration: 2000,
        color: 'success'
      });
      await toast.present();

      // (Opcional) Guardar no localStorage futuramente
      // const alimento = {
      //   produto: this.produto,
      //   quantidade: this.quantidade,
      //   dataCompra: this.dataCompra,
      //   dataValidade: this.dataValidade
      // };
      // localStorage.setItem('alimento', JSON.stringify(alimento));

      // (Opcional) Limpar o formulário
      // this.produto = '';
      // this.quantidade = null;
      // this.dataCompra = '';
      // this.dataValidade = '';
      
    } else {
      const toast = await this.toastController.create({
        message: 'Por favor preencha todos os campos.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
    }
  }
}
