import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-listade-compras',
  templateUrl: './listade-compras.page.html',
  styleUrls: ['./listade-compras.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
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

  constructor() { }

  ngOnInit() {}
}
