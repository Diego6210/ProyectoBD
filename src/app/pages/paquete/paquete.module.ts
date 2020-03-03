import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaquetePageRoutingModule } from './paquete-routing.module';

import { PaquetePage } from './paquete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PaquetePageRoutingModule
  ],
  declarations: [PaquetePage]
})
export class PaquetePageModule {}
