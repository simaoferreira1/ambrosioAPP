import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListadeComprasPageRoutingModule } from './listade-compras-routing.module';

import { ListadeComprasPage } from './listade-compras.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    ListadeComprasPageRoutingModule
  ],
  declarations: [ListadeComprasPage]
})
export class ListadeComprasPageModule {}
