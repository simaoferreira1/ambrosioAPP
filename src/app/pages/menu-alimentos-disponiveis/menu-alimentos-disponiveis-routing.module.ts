import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuAlimentosDisponiveisPage } from './menu-alimentos-disponiveis.page';

const routes: Routes = [
  {
    path: '',
    component: MenuAlimentosDisponiveisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuAlimentosDisponiveisPageRoutingModule {}
