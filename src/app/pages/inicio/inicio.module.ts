import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioPageRoutingModule } from './inicio-routing.module';

import { InicioPage } from './inicio.page';
import { MapaPageModule } from '../mapa/mapa.module';
import { DashboardPageModule } from '../dashboard/dashboard.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioPageRoutingModule,
    MapaPageModule,
    DashboardPageModule
  ],
  declarations: [InicioPage]
})
export class InicioPageModule {}
