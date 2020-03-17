import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaqueteModificarPage } from './paquete-modificar.page';

const routes: Routes = [
  {
    path: '',
    component: PaqueteModificarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaqueteModificarPageRoutingModule {}
