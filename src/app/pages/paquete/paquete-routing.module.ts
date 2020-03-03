import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaquetePage } from './paquete.page';

const routes: Routes = [
  {
    path: '',
    component: PaquetePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaquetePageRoutingModule {}
