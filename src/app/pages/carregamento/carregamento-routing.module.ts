import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CarregamentoPage } from './carregamento.page';

const routes: Routes = [
  {
    path: '',
    component: CarregamentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CarregamentoPageRoutingModule {}
