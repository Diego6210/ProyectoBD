import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/app/service/database.service';

@Component({
  selector: 'app-usuarios-modificar',
  templateUrl: './usuarios-modificar.page.html',
  styleUrls: ['./usuarios-modificar.page.scss'],
})
export class UsuariosModificarPage implements OnInit {

 
  constructor(
    public modalController: ModalController,
    private DBlocal: DatabaseService
  ) { }

  id:string;
  Usuario:string;
  Contrasena:string;
  Nombre:string;
  Apellido:string;
  TipoUsuario:number;


  ngOnInit() {
    this.DBlocal.getUsuarioModificar(this.id).then((data) => {
      this.Usuario = data.Usuario;
      this.TipoUsuario = data.TipoUsuario;
      this.Nombre = data.Nombre;
      this.Apellido = data.Apellido;
    }).catch((error) => {
      console.log('error')
    });
  }

  setUsuarioModificar(){
    this.DBlocal.setUsuarioModificar(this.id,this.Contrasena,this.Nombre,this.Apellido,this.TipoUsuario).then((data) => {
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
