import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaqueteAgregarPageRoutingModule } from './paquete-agregar-routing.module';

import { PaqueteAgregarPage } from './paquete-agregar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaqueteAgregarPageRoutingModule
  ],
  declarations: [PaqueteAgregarPage]
})
export class PaqueteAgregarPageModule {}
