import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InserirManualmentePageRoutingModule } from './inserir-manualmente-routing.module';

import { InserirManualmentePage } from './inserir-manualmente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InserirManualmentePageRoutingModule
  ],
  declarations: [InserirManualmentePage]
})
export class InserirManualmentePageModule {}
