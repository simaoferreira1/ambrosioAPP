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

  // Texto digitado no searchbar
  searchText: string = '';

  // Lista que será mostrada (filtrada)
  filteredList: string[] = [];

  constructor(private toastController: ToastController) {}

  ngOnInit() {
    // Inicialmente, exibe toda a lista
    this.filteredList = [...this.listaCompras];
  }

  /**
   * Atualiza `filteredList` conforme `searchText`.
   */
  onSearchInput(event: any) {
    this.searchText = event.target.value?.toLowerCase() || '';
    if (!this.searchText) {
      this.filteredList = [...this.listaCompras];
    } else {
      this.filteredList = this.listaCompras.filter(item =>
        item.toLowerCase().includes(this.searchText)
      );
    }
  }

  /**
   * Ao clicar em “Add”, usa o texto atual de `searchText` para adicionar um item.
   */
  async addNewItemFromSearch() {
  const novo = this.searchText.trim();
  if (!novo) {
    const toast = await this.toastController.create({
      message: 'Please enter something in the search field to add.',
      duration: 2000,
      color: 'warning'
    });
    await toast.present();
    return;
  }

  if (this.listaCompras.some(item => item.toLowerCase() === novo.toLowerCase())) {
    const toast = await this.toastController.create({
      message: `The product "${novo}" is already in the list.`,
      duration: 2000,
      color: 'warning'
    });
    await toast.present();
    return;
  }

  this.listaCompras.unshift(novo);
  this.searchText = '';
  this.filteredList = [...this.listaCompras];

  const toast = await this.toastController.create({
    message: `Product "${novo}" added.`,
    duration: 2000,
    color: 'success'
  });
  await toast.present();
}

async compartilharLista() {
  if (!this.listaCompras.length) {
    const toast = await this.toastController.create({
      message: 'The shopping list is empty.',
      duration: 2000,
      color: 'warning',
    });
    await toast.present();
    return;
  }

  const header = 'Shopping List:\n\n';
  const bullets = this.listaCompras.map(item => `• ${item}`).join('\n');
  const fullText = header + bullets;

  try {
    await Share.share({
      title: 'My Shopping List',
      text: fullText,
      dialogTitle: 'Share Shopping List',
    });
  } catch (err) {
    console.error('Share error:', err);
    const toast = await this.toastController.create({
      message: 'Unable to open sharing.',
      duration: 2000,
      color: 'danger',
    });
    await toast.present();
  }
  }
}
