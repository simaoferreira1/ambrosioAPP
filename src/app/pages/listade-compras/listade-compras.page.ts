import { Component, OnInit } from '@angular/core';


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

  constructor() { }

  ngOnInit() {}
}
