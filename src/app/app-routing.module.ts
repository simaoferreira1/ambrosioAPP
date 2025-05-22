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
    loadComponent: () => import('./pages/listade-compras/listade-compras.page').then( m => m.ListadeComprasPage)
  },
  {
    path: 'adicionar-alimento',
    loadComponent: () => import('./pages/adicionar-alimento/adicionar-alimento.page').then( m => m.AdicionarAlimentoPage)
  },
  {
    path: 'menu-alimentos-disponiveis',
    loadComponent: () => import('./pages/menu-alimentos-disponiveis/menu-alimentos-disponiveis.page').then( m => m.MenuAlimentosDisponiveisPage)
  },
  {
    path: 'inserir-manualmente',
    loadComponent: () => import('./pages/inserir-manualmente/inserir-manualmente.page').then( m => m.InserirManualmentePage)
  },
  {
    path: 'fazer-scan',
    loadComponent: () => import('./pages/fazer-scan/fazer-scan.page').then( m => m.FazerScanPage)
  }





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
