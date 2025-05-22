import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-adicionar-alimento',
  templateUrl: './adicionar-alimento.page.html',
  styleUrls: ['./adicionar-alimento.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
})
export class AdicionarAlimentoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
