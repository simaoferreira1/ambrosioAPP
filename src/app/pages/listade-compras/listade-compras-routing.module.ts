import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadeComprasPage } from './listade-compras.page';

const routes: Routes = [
  {
    path: '',
    component: ListadeComprasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadeComprasPageRoutingModule {}
