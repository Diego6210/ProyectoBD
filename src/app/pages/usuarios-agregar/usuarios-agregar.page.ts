import { Component, OnInit } from '@angular/core';
import { DatabaseServerService } from 'src/app/service/database-server.service';
import { DatabaseService } from 'src/app/service/database.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-usuarios-agregar',
  templateUrl: './usuarios-agregar.page.html',
  styleUrls: ['./usuarios-agregar.page.scss'],
})
export class UsuariosAgregarPage implements OnInit {

  constructor(
    public modalController: ModalController,
    private DBlocal: DatabaseService
  ) { }

  Usuario:string;
  Contrasena:string;
  Nombre:string;
  Apellido:string;
  TipoUsuario:number;

  ngOnInit() {
  } 

  agregar(){
    this.DBlocal.createUser(this.Usuario,this.Contrasena,this.Nombre,this.Apellido,this.TipoUsuario);
    this.dismiss();
  }

  dismiss() {
    this.modalController.dismiss({
    'dismissed': true
    });
  }
}
