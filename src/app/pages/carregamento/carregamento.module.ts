import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CarregamentoPageRoutingModule } from './carregamento-routing.module';

import { CarregamentoPage } from './carregamento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CarregamentoPageRoutingModule
  ],
  declarations: [CarregamentoPage]
})
export class CarregamentoPageModule {}
