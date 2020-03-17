import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/app/service/database.service';
import { PaqueteModificarPage } from '../paquete-modificar/paquete-modificar.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paquete',
  templateUrl: './paquete.page.html',
  styleUrls: ['./paquete.page.scss'],
})
export class PaquetePage implements OnInit {

  constructor(
    public alertController: AlertController,
    public modalController: ModalController,
    private router: Router,
    private DBlocal: DatabaseService
  ) { }

  Paquetes:any;
  
  ngOnInit() {
  }

  getPaquetes() {
    this.DBlocal.getPaquetes().then((data) => {
      this.Paquetes = data;
    }).catch((error) => {

    });
  }

  doRefresh(event) {
    this.getPaquetes();

    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  Eliminar(IdPaquete: string,Descripcion:string,Dirreccion:string){
    this.presentAlertConfirm(IdPaquete,Descripcion,Dirreccion);
  }

  Modificar(IdPaquete: string){
    this.presentModalModificar(IdPaquete);
  }
  
  async presentAlertConfirm(IdPaquete: string,Descripcion:string,Dirreccion:string) {

    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '<strong>Eliminar paquete</strong>!!!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancelar',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirmacion de Cancelar ');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.DBlocal.setDeletePaquete(Descripcion,Dirreccion).then((data) => {console.log('Agregado a delet')});
            this.DBlocal.deletePaquete(IdPaquete).then((data) =>  {
              this.getPaquetes();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async presentModalModificar(IdPaquete: string) {
    const modal = await this.modalController.create({
      component: PaqueteModificarPage,
      componentProps: { 
        id: IdPaquete
      }
    });
    return await modal.present();
  }

  present(){
    this.router.navigateByUrl('inicio/paquete-agregar');
  }

}
