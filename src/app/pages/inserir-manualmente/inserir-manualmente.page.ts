// src/app/pages/inserir-manualmente/inserir-manualmente.page.ts

import { Component, OnInit } from '@angular/core';
import { FoodService, Food } from '../../services/food.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
@Component({
  selector: 'app-inserir-manualmente',
  templateUrl: './inserir-manualmente.page.html',
  styleUrls: ['./inserir-manualmente.page.scss'],
  standalone: false
})
export class InserirManualmentePage implements OnInit {
  produto: string = '';
  quantidade: number | null = null;
  dataCompra: string = '';
  dataValidade: string = '';

  mostrarCalendarioCompra = false;
  mostrarCalendarioValidade = false;

  private currentUserId: number = 0;

  constructor(
    private authService: AuthService,
    private foodService: FoodService,
    private router: Router
  ) {}

  async ngOnInit() {
    // 1) Get current user from AuthService
    const user: User | null = await this.authService.getCurrentUser();
    if (user && user.id) {
      this.currentUserId = user.id;
      console.log('ℹ️ Current user ID:', this.currentUserId);
    } else {
      // Not logged in → redirect to login
      console.warn('⚠️ Usuário não autenticado. Redirecionando para login...');
      this.router.navigateByUrl('/login');
    }
  }

  abrirCalendarioCompra() {
    this.mostrarCalendarioCompra = true;
  }

  abrirCalendarioValidade() {
    this.mostrarCalendarioValidade = true;
  }

  async guardarAlimento() {
    // 1) Validate the form fields
    if (
      !this.produto ||
      this.quantidade === null ||
      !this.dataCompra ||
      !this.dataValidade ||
      this.currentUserId === 0
    ) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    // 2) Build the payload for the API (omit barcode)
    const payload: {
      name: string;
      quantity: number;
      buyDate: string;
      expirationDate: string;
      userId: number;
    } = {
      name: this.produto,
      quantity: this.quantidade,
      buyDate: this.dataCompra,
      expirationDate: this.dataValidade,
      userId: this.currentUserId
    };

    console.log('🔧 Payload para criar Food:', payload);

    // 3) Call the API
    this.foodService.addFood(payload as any).subscribe(
      async (createdFood: Food) => {
        console.log('✅ Food criado no servidor:', createdFood);

        // 4) Save it locally under "localFoods_user_<userId>"
        try {
          await this.foodService.addLocalFood(this.currentUserId, createdFood);
          console.log('✅ Food salvo localmente:', createdFood);
        } catch (storageErr) {
          console.error('❌ Erro ao salvar localmente:', storageErr);
        }

        // 5) Clear form
        this.produto = '';
        this.quantidade = null;
        this.dataCompra = '';
        this.dataValidade = '';

        alert('Alimento guardado com sucesso!');
      },
      (err) => {
        console.error('❌ Erro ao criar food no servidor:', err);
        // If backend returned {error:"…"}, show it
        if (err.error && err.error.error) {
          alert(`Falha: ${err.error.error}`);
        } else {
          alert('Falha ao guardar alimento. Veja o console para detalhes.');
        }
      }
    );
  }
}