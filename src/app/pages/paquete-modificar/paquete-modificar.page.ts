import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/service/database.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-paquete-modificar',
  templateUrl: './paquete-modificar.page.html',
  styleUrls: ['./paquete-modificar.page.scss'],
})
export class PaqueteModificarPage implements OnInit {

  constructor(
    public modalController: ModalController,
    private DBlocal: DatabaseService
  ) { }

  id:string;
  name:string = '';
  address:string = '';
  EmpleadoEntrega:string = '';
  StatusPaquete:number = 0;
  
  Usuarios:any;

  ngOnInit() {

    this.DBlocal.getTodosUsuarios().then((data) => {
      this.Usuarios = data;
    });

    this.DBlocal.getPaqueteModificar(this.id).then((data) => {
      this.name = data.name;
      this.address = data.address;
      this.StatusPaquete = data.StatusPaquete;
      this.EmpleadoEntrega = data.EmpleadoEntrega;
    }).catch((error) => {
      console.log('error')
    });
  }

  setUsuarioModificar(){
    this.DBlocal.setPaqueteModificar(this.name, this.address, this.EmpleadoEntrega, this.StatusPaquete, this.id).then((data) => {
      
      this.DBlocal.getPaqueteStatusModificar(this.id).then((data) => {
        if(data.length > 0)
          this.DBlocal.setPaqueteModificarStatusModificado(this.id);
      });

      this.dismiss();
    }).catch((error) => {
      console.log('no modificardo');
    });

  }
  
  dismiss() {
    this.modalController.dismiss({
    'dismissed': true
    });
  }
}
