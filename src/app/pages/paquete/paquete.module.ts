import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaquetePageRoutingModule } from './paquete-routing.module';

import { PaquetePage } from './paquete.page';
import { PaqueteModificarPageModule } from '../paquete-modificar/paquete-modificar.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaquetePageRoutingModule,
    PaqueteModificarPageModule
  ],
  declarations: [PaquetePage]
})
export class PaquetePageModule {}
