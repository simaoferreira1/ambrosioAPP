import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FazerScanPageRoutingModule } from './fazer-scan-routing.module';

import { FazerScanPage } from './fazer-scan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    FazerScanPageRoutingModule
  ],
  declarations: [FazerScanPage]
})
export class FazerScanPageModule {}
