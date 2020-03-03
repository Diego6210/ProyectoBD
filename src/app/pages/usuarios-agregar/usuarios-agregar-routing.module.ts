import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosAgregarPage } from './usuarios-agregar.page';

const routes: Routes = [
  {
    path: '',
    component: UsuariosAgregarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosAgregarPageRoutingModule {}
