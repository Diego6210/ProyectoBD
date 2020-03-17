import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaqueteModificarPageRoutingModule } from './paquete-modificar-routing.module';

import { PaqueteModificarPage } from './paquete-modificar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaqueteModificarPageRoutingModule
  ],
  declarations: [PaqueteModificarPage]
})
export class PaqueteModificarPageModule {}
