import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosAgregarPageRoutingModule } from './usuarios-agregar-routing.module';

import { UsuariosAgregarPage } from './usuarios-agregar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosAgregarPageRoutingModule
  ],
  declarations: [UsuariosAgregarPage]
})
export class UsuariosAgregarPageModule {}
