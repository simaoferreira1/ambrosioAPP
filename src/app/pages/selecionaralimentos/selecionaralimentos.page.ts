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
    expirationDate?: string;  
  }> = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private foodService: FoodService
  ) {}

  async ionViewWillEnter() {
    const user: User | null = await this.authService.getCurrentUser();
    if (!user) {
      this.alimentos = [];
      return;
    }

    this.foodService.getFoods(user.id).subscribe(
      (foods: Food[]) => {
        this.alimentos = foods.map(f => ({
          nome: f.name,
          imagem: f.image?.url || 'assets/placeholder.png',
          selecionado: false,
          expirationDate: f.expirationDate  // guardar para usar na função
        }));
      },
      err => {
        console.error('Erro ao obter alimentos:', err);
        this.alimentos = [];
      }
    );
  }

  irParaCarregamento() {
    const selecionados = this.alimentos
      .filter(a => a.selecionado)
      .map(a => a.nome);

    this.router.navigate(['/carregamento'], {
      queryParams: { foods: selecionados.join(',') }
    });
  }

  estaPertoDeExpirar(dataValidade?: string): boolean {
    if (!dataValidade) return false;
    const hoje = new Date();
    const validade = new Date(dataValidade);
    const diffMs = validade.getTime() - hoje.getTime();
    const diffDias = diffMs / (1000 * 60 * 60 * 24);
    return diffDias > 0 && diffDias <= 3; // 3 dias ou menos para expirar
  }
}
