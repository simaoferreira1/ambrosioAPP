import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlimentoPage } from './alimento.page';

const routes: Routes = [
  {
    path: '',  
    component: AlimentoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlimentoPageRoutingModule {}

