// src/app/pages/carregamento/carregamento.page.ts

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-carregamento',
  templateUrl: './carregamento.page.html',
  styleUrls: ['./carregamento.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, HttpClientModule, RouterModule]
})
export class CarregamentoPage implements OnInit {
  // Will hold the single recipe fetched
  recipe: {
    name: string;
    photo: string;
    ingredients: string[];
    instructions: string;
  } | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    // 1) Read selected foods from queryParams (comma-separated string)
    this.route.queryParams.subscribe(async params => {
      const foodsCsv: string = params['foods'] || '';
      if (!foodsCsv) {
        // No foods passed—navigate immediately without recipe data
        this.router.navigate(['/receita']);
        return;
      }

      // 2) Call our backend’s recipe endpoint with ingredients=foodsCsv
      const url = `https://prisma-api-three.vercel.app/api/v1/recipes?ingredients=${encodeURIComponent(
        foodsCsv
      )}`;

      try {
        // Use firstValueFrom to convert Observable to Promise
        const data = await firstValueFrom(
          this.http.get<{
            name: string;
            photo: string;
            ingredients: string[];
            instructions: string;
          }>(url)
        );

        // 3) Store response and navigate to /receita, passing the recipe in state
        this.recipe = data;
        this.router.navigate(['/receita'], { state: { recipe: this.recipe } });
      } catch (error) {
        console.error('Erro ao buscar receita:', error);
        // Even on error, navigate to /receita so the page can handle absence of data
        this.router.navigate(['/receita']);
      }
    });
  }
}
