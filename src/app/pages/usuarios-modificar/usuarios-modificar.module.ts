import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosModificarPageRoutingModule } from './usuarios-modificar-routing.module';

import { UsuariosModificarPage } from './usuarios-modificar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosModificarPageRoutingModule
  ],
  declarations: [UsuariosModificarPage]
})
export class UsuariosModificarPageModule {}
