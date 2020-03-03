import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosPageRoutingModule } from './usuarios-routing.module';

import { UsuariosPage } from './usuarios.page';
import { UsuariosModificarPageModule } from '../usuarios-modificar/usuarios-modificar.module';
import { UsuariosAgregarPageModule } from '../usuarios-agregar/usuarios-agregar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuariosPageRoutingModule,
    UsuariosAgregarPageModule,
    UsuariosModificarPageModule
  ],
  declarations: [UsuariosPage]
})
export class UsuariosPageModule {}
