import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioPage } from './inicio.page';

const routes: Routes = [
  {
    path: '',
    component: InicioPage,
    children:
    [
      { path: 'mapa', 
      loadChildren: () => import('../mapa/mapa.module').then( m => m.MapaPageModule)
      },
      { path: 'dashboard', 
        loadChildren: () => import('../dashboard/dashboard.module').then( m => m.DashboardPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioPageRoutingModule {}
