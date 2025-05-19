import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelecionaralimentosPageRoutingModule } from './selecionaralimentos-routing.module';

import { SelecionaralimentosPage } from './selecionaralimentos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelecionaralimentosPageRoutingModule
  ],
  declarations: [SelecionaralimentosPage]
})
export class SelecionaralimentosPageModule {}
