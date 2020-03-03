import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsuariosModificarPage } from './usuarios-modificar.page';

const routes: Routes = [
  {
    path: '',
    component: UsuariosModificarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosModificarPageRoutingModule {}
