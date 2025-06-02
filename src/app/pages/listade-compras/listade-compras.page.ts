import { Component, OnInit } from '@angular/core';
import { Share } from '@capacitor/share';
import { ToastController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-listade-compras',
  templateUrl: './listade-compras.page.html',
  styleUrls: ['./listade-compras.page.scss'],
})
export class ListadeComprasPage implements OnInit {
  listaCompras: string[] = [
    'Arroz',
    'Tomates',
    'Alface',
    'Bife perú',
    'Bolacha maria',
    'Beterraba',
    'Coxas de frango',
    'Massa esparguete',
    'Clementinas',
    'Chocolate',
    'Iogurtes',
    'Polpa de Tomate',
    'Batatas',
    'Cebolas',
    'Salsichas',
    'Chocolate de cozinha',
  ];

  constructor(private toastController: ToastController) {}

  ngOnInit() {}

  /**
   * Constrói um texto com a lista e abre o share sheet nativo.
   */
  async compartilharLista() {
    if (!this.listaCompras.length) {
      const toast = await this.toastController.create({
        message: 'A lista de compras está vazia.',
        duration: 2000,
        color: 'warning',
      });
      await toast.present();
      return;
    }

    // 1) Construir o texto com cada item em nova linha
    const header = 'Lista de compras:\n\n';
    const bullets = this.listaCompras.map(item => `• ${item}`).join('\n');
    const fullText = header + bullets;

    try {
      // 2) Chamar o Share plugin do Capacitor
      await Share.share({
        title: 'Minha Lista de Compras',
        text: fullText,
        dialogTitle: 'Partilhar lista de compras',
      });
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
      const toast = await this.toastController.create({
        message: 'Não foi possível abrir o compartilhamento.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
