import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FoodService, Food } from '../services/food.service';
import { AuthService, User } from '../services/auth.service';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false
})
export class Tab2Page implements ViewWillEnter {
  alimentos: Array<{
    id: number;
    nome: string;
    imagem: string;
    quantidade: string;
    dataCompra: string;
    dataValidade: string;
  }> = [];

  constructor(
    private authService: AuthService,
    private foodService: FoodService,
    private router: Router
  ) {}

  /**
   * Helper: format ISO date → "DD-MM-YYYY"
   */
  private formatDate(iso: string): string {
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  /**
   * Called each time this page is about to become active.
   * We reload the foods here so that any additions or deletions
   * made elsewhere are reflected immediately.
   */
  async ionViewWillEnter(): Promise<void> {
    await this.loadFoods();
  }

  /**
   * Fetches the current user's foods from the API
   * and maps them into the `alimentos` array.
   */
  private async loadFoods(): Promise<void> {
    // 1) Get the logged-in user
    const user: User | null = await this.authService.getCurrentUser();
    if (!user) {
      // If no user is stored, redirect to login
      this.router.navigateByUrl('/login');
      return;
    }

    // 2) Fetch foods for this user
    this.foodService.getFoods(user.id).subscribe(
      (foods: Food[]) => {
        // 3) Map each Food to the local structure
        this.alimentos = foods.map(f => ({
          id: f.id,
          nome: f.name,
          imagem: f.image?.url || 'assets/placeholder.png',
          quantidade: f.quantity.toString(),
          dataCompra: this.formatDate(f.buyDate),
          dataValidade: this.formatDate(f.expirationDate)
        }));
      },
      err => {
        console.error('Erro ao obter alimentos do servidor:', err);
        // Optionally show an alert here
      }
    );
  }
}
