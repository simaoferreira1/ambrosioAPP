import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InserirManualmentePage } from './inserir-manualmente.page';

const routes: Routes = [
  {
    path: '',
    component: InserirManualmentePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InserirManualmentePageRoutingModule {}
