import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistoPageRoutingModule } from './registo-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistoPage } from './registo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistoPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegistoPage]
})
export class RegistoPageModule {}
