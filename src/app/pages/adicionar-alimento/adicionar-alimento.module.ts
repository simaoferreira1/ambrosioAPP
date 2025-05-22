import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdicionarAlimentoPageRoutingModule } from './adicionar-alimento-routing.module';

import { AdicionarAlimentoPage } from './adicionar-alimento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdicionarAlimentoPageRoutingModule
  ],
  declarations: [AdicionarAlimentoPage]
})
export class AdicionarAlimentoPageModule {}
