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
  },
  {
    path: 'listade-compras',
    loadChildren: () => import('./pages/listade-compras/listade-compras.module').then( m => m.ListadeComprasPageModule)
  },
  {
    path: 'adicionar-alimento',
    loadChildren: () => import('./pages/adicionar-alimento/adicionar-alimento.module').then( m => m.AdicionarAlimentoPageModule)
  },
  {
    path: 'inserir-manualmente',
    loadChildren: () => import('./pages/inserir-manualmente/inserir-manualmente.module').then( m => m.InserirManualmentePageModule)
  },
  {
    path: 'fazer-scan',
    loadChildren: () => import('./pages/fazer-scan/fazer-scan.module').then( m => m.FazerScanPageModule)
  },
  {
    path: 'alimento',
    loadChildren: () => import('./pages/alimento/alimento.module').then( m => m.AlimentoPageModule)
  }






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
