import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-inserir-manualmente',
  templateUrl: './inserir-manualmente.page.html',
  styleUrls: ['./inserir-manualmente.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class InserirManualmentePage implements OnInit {

  // Propriedades do formulário
  produto: string = '';
  quantidade: number | null = null;
  dataCompra: string = '';
  dataValidade: string = '';

  mostrarCalendarioCompra = false;
  mostrarCalendarioValidade = false;

  abrirCalendarioCompra() {
   this.mostrarCalendarioCompra = true;
  }

  abrirCalendarioValidade() {
    this.mostrarCalendarioValidade = true;
  }


  constructor() { }

  ngOnInit() {}

  guardarAlimento() {
    console.log('Produto:', this.produto);
    console.log('Quantidade:', this.quantidade);
    console.log('Data de compra:', this.dataCompra);
    console.log('Data de validade:', this.dataValidade);
    
    // Depois formatar para guardar em LocalStorage
  }
}
