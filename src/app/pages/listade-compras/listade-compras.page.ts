import { Component, OnInit } from '@angular/core';
import { Share } from '@capacitor/share';

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

  constructor() {}

  ngOnInit() {}

  async partilharLista() {
    const texto = this.listaCompras.join(', ');

    await Share.share({
      title: 'Lista de Compras',
      text: `Aqui está a minha lista de compras:\n${texto}`,
      dialogTitle: 'Partilhar Lista'
    });
  }
}
