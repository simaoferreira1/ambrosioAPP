import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelecionaralimentosPage } from './selecionaralimentos.page';

const routes: Routes = [
  {
    path: '',
    component: SelecionaralimentosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelecionaralimentosPageRoutingModule {}
