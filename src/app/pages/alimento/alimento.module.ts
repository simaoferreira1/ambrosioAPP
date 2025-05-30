import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlimentoPageRoutingModule } from './alimento-routing.module';

import { AlimentoPage } from './alimento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlimentoPageRoutingModule
  ],
  declarations: [AlimentoPage]
})
export class AlimentoPageModule {}
