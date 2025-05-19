import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then(m => m.InicioPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'registo',
    loadChildren: () => import('./pages/registo/registo.module').then(m => m.RegistoPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'boasvindas',
    loadChildren: () => import('./pages/boasvindas/boasvindas.module').then(m => m.BoasvindasPageModule)
  },
  {
    path: 'selecionaralimentos',
    loadChildren: () => import('./pages/selecionaralimentos/selecionaralimentos.module')
      .then(m => m.SelecionaralimentosPageModule)
  },
  {
  path: 'carregamento',
  loadComponent: () => import('./pages/carregamento/carregamento.page').then(m => m.CarregamentoPage)
  },
  {
    path: 'receita',
    loadComponent: () => import('./pages/receita/receita.page').then(m => m.ReceitaPage)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
