import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-fazer-scan',
  templateUrl: './fazer-scan.page.html',
  styleUrls: ['./fazer-scan.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule]
})
export class FazerScanPage implements OnInit {

  produto: string = 'Coca-Cola';
  quantidade: string = '0,33L';
  dataCompra: string = '21-03-2025';
  dataValidade: string = '28-09-2027';
  imagemProduto: string = 'assets/imgs/coca-cola.jpg';

  constructor() { }

  ngOnInit() { }

  adicionarProduto() {
    console.log('Produto adicionado:', {
      produto: this.produto,
      quantidade: this.quantidade,
      dataCompra: this.dataCompra,
      dataValidade: this.dataValidade
    });
    // depois codigo para guardar em LocalStorage
  }
}
