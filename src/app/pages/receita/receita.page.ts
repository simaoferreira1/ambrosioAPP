import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonicModule,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
} from '@ionic/angular';

@Component({
  selector: 'app-receita',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonicModule // Aqui está o módulo que resolve todos os <ion-*>
  ],
  templateUrl: './receita.page.html',
  styleUrls: ['./receita.page.scss'],
})
export class ReceitaPage {}
