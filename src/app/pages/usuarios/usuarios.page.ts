import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/service/database.service';
import { ModalController, AlertController } from '@ionic/angular';
import { UsuariosAgregarPage } from '../usuarios-agregar/usuarios-agregar.page';
import { UsuariosModificarPage } from '../usuarios-modificar/usuarios-modificar.page';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  constructor(
    public alertController: AlertController,
    public modalController: ModalController,
    private DBlocal: DatabaseService
  ) { }

  Usuarios:any;

  ngOnInit() {
    this.getUsuarios();
  }

  getUsuarios() {
    this.DBlocal.getUsuarios().then((data) => {
      this.Usuarios = data;
    }).catch((error) => {

    });
  }

  doRefresh(event) {
    this.getUsuarios();

    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  Eliminar(idUsuarios: string){
    this.presentAlertConfirm(idUsuarios);
  }

  Modificar(idUsuario: string){
    this.presentModalModificar(idUsuario);
  }
  
  async presentAlertConfirm(idUsuarios: string) {

    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '<strong>Eliminar usuario</strong>!!!',
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
            this.DBlocal.deleteUsuario(idUsuarios).then((data) =>  {
              this.getUsuarios();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: UsuariosAgregarPage
    });
    return await modal.present();
  }

  async presentModalModificar(idUsuario: string) {
    const modal = await this.modalController.create({
      component: UsuariosModificarPage,
      componentProps: { 
        id: idUsuario
      }
    });
    return await modal.present();
  }


}
