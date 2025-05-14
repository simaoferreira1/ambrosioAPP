import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoasvindasPageRoutingModule } from './boasvindas-routing.module';

import { BoasvindasPage } from './boasvindas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoasvindasPageRoutingModule
  ],
  declarations: [BoasvindasPage]
})
export class BoasvindasPageModule {}
