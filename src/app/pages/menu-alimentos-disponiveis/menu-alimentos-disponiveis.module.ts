import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { MenuAlimentosDisponiveisPageRoutingModule } from './menu-alimentos-disponiveis-routing.module';
import { MenuAlimentosDisponiveisPage } from './menu-alimentos-disponiveis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    MenuAlimentosDisponiveisPageRoutingModule
  ],
  declarations: [MenuAlimentosDisponiveisPage]
})
export class MenuAlimentosDisponiveisPageModule {}
