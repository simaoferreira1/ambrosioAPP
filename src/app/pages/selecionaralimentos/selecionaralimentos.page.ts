import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { FoodService, Food } from '../../services/food.service';

@Component({
  selector: 'app-selecionaralimentos',
  templateUrl: './selecionaralimentos.page.html',
  styleUrls: ['./selecionaralimentos.page.scss'],
  standalone: false,
})
export class SelecionaralimentosPage {
  alimentos: Array<{
    nome: string;
    imagem: string;
    selecionado: boolean;
  }> = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private foodService: FoodService
  ) {}

  /**
   * Every time this page becomes active, load the user's foods.
   */
  async ionViewWillEnter() {
    // 1) Get current user
    const user: User | null = await this.authService.getCurrentUser();
    if (!user) {
      // If no user is logged in, leave alimentos empty
      this.alimentos = [];
      return;
    }

    // 2) Fetch foods for this user
    this.foodService.getFoods(user.id).subscribe(
      (foods: Food[]) => {
        // 3) Map each Food into { nome, imagem, selecionado }
        this.alimentos = foods.map(f => ({
          nome: f.name,
          imagem: f.image?.url || 'assets/placeholder.png',
          selecionado: false  // default to unchecked
        }));
      },
      err => {
        console.error('Erro ao obter alimentos:', err);
        // On error, keep alimentos empty or show a message
        this.alimentos = [];
      }
    );
  }

  /**
   * Navigate to the loading page, passing selected food names as queryParams.
   */
  irParaCarregamento() {
    const selecionados = this.alimentos
      .filter(a => a.selecionado)
      .map(a => a.nome);

    // Pass the selected names as a comma-separated string
    this.router.navigate(['/carregamento'], {
      queryParams: { foods: selecionados.join(',') }
    });
  }
}
