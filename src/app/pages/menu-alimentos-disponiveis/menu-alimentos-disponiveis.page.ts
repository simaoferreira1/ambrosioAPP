import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-menu-alimentos-disponiveis',
  templateUrl: './menu-alimentos-disponiveis.page.html',
  styleUrls: ['./menu-alimentos-disponiveis.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule] 
})
export class MenuAlimentosDisponiveisPage implements OnInit {

  listaAlimentos = [
    { nome: 'Maçãs', imagem: 'assets/macas.jpg' },
    { nome: 'Carne de vaca moída', imagem: 'assets/carne.jpg' },
    { nome: 'Alface', imagem: 'assets/alface.jpg' },
    { nome: 'Arroz', imagem: 'assets/arroz.jpg' },
    { nome: 'Feijão verde', imagem: 'assets/feijao.jpg' },
    { nome: 'Massa esparguete', imagem: 'assets/massa.jpg' },
    { nome: 'Laranjas', imagem: 'assets/laranja.jpg' },
    { nome: 'Bife frango', imagem: 'assets/frango.jpg' },
    { nome: 'Queijo flamengo fatiado', imagem: 'assets/queijo.jpg' },
    { nome: 'Bróculos', imagem: 'assets/brocolos.jpg' },
    { nome: 'Costeletas do cachaço', imagem: 'assets/costeletas.jpg' }
  ];

  constructor() { }

  ngOnInit() {}
}
