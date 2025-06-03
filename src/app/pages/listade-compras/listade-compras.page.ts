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
  shoppingList: string[] = [
    'Tomatoes',
    'Lettuce',
    'Turkey steak',
    'Maria biscuits',
    'Beetroot',
    'Chicken legs',
    'Spaghetti pasta',
    'Clementines',
    'Chocolate',
    'Yogurts',
    'Tomato purée',
    'Potatoes',
    'Onions',
    'Sausages',
    'Cooking chocolate',
  ];

  searchText: string = '';
  filteredList: string[] = [];

  constructor(private toastController: ToastController) {}

  ngOnInit(): void {
    this.filteredList = [...this.shoppingList];
  }

  onSearchInput(event: any): void {
    const value = event.target.value.toLowerCase();
    this.searchText = value;
    this.filteredList = this.shoppingList.filter(item =>
      item.toLowerCase().includes(value)
    );
  }

  addNewItemFromSearch(): void {
    const trimmed = this.searchText.trim();
    if (trimmed && !this.shoppingList.includes(trimmed)) {
      this.shoppingList.push(trimmed);
      this.filteredList = [...this.shoppingList];
      this.searchText = '';
    }
  }

  async shareList(): Promise<void> {
    if (!this.shoppingList.length) {
      const toast = await this.toastController.create({
        message: 'The shopping list is empty.',
        duration: 2000,
        color: 'warning',
      });
      await toast.present();
      return;
    }

    const header = 'Shopping list:\n\n';
    const bullets = this.shoppingList.map(item => `• ${item}`).join('\n');
    const fullText = header + bullets;

    try {
      await Share.share({
        title: 'My Shopping List',
        text: fullText,
        dialogTitle: 'Share your shopping list',
      });
    } catch (err) {
      console.error('Error sharing:', err);
      const toast = await this.toastController.create({
        message: 'Could not open the sharing interface.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
