import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: '', redirectTo: 'login', pathMatch: 'full' 
  },
  { path: 'login', 
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'mapa',
    loadChildren: () => import('./pages/mapa/mapa.module').then( m => m.MapaPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'usuarios-modificar',
    loadChildren: () => import('./pages/usuarios-modificar/usuarios-modificar.module').then( m => m.UsuariosModificarPageModule)
  },
  {
    path: 'usuarios-agregar',
    loadChildren: () => import('./pages/usuarios-agregar/usuarios-agregar.module').then( m => m.UsuariosAgregarPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./pages/usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },
  {
    path: 'paquete',
    loadChildren: () => import('./pages/paquete/paquete.module').then( m => m.PaquetePageModule)
  },
  {
    path: 'paquete-agregar',
    loadChildren: () => import('./pages/paquete-agregar/paquete-agregar.module').then( m => m.PaqueteAgregarPageModule)
  },
  {
    path: 'paquete-modificar',
    loadChildren: () => import('./pages/paquete-modificar/paquete-modificar.module').then( m => m.PaqueteModificarPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
