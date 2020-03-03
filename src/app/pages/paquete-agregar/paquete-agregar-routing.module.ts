import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaqueteAgregarPage } from './paquete-agregar.page';

const routes: Routes = [
  {
    path: '',
    component: PaqueteAgregarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaqueteAgregarPageRoutingModule {}
