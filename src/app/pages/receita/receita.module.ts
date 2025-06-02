import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReceitaPageRoutingModule } from './receita-routing.module';

import { ReceitaPage } from './receita.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReceitaPageRoutingModule,
    RouterModule
  ],
  declarations: [ReceitaPage]
})
export class ReceitaPageModule {}
