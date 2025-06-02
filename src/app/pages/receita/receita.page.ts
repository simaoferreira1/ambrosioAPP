// src/app/pages/receita/receita.page.ts

import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-receita',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './receita.page.html',
  styleUrls: ['./receita.page.scss'],
})
export class ReceitaPage implements OnInit {
  // Properties to hold the recipe data
  name: string = '';
  photo: string = '';
  ingredients: string[] = [];
  instructions: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
    // Retrieve navigation state
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as {
      recipe?: {
        name: string;
        photo: string;
        ingredients: string[];
        instructions: string;
      };
    };

    if (state?.recipe) {
      this.name = state.recipe.name;
      this.photo = state.recipe.photo;
      this.ingredients = state.recipe.ingredients;
      this.instructions = state.recipe.instructions;
    } else {
      // No recipe passed—navigate back or set defaults
      this.name = 'Receita não encontrada';
      this.photo = '';
      this.ingredients = [];
      this.instructions = '';
    }
  }
}
