import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FazerScanPage } from './fazer-scan.page';

const routes: Routes = [
  {
    path: '',
    component: FazerScanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FazerScanPageRoutingModule {}
