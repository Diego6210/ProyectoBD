import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController, LoadingController } from '@ionic/angular';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { DataStorageService } from 'src/app/service/data-storage.service';
import { DatabaseService } from 'src/app/service/database.service';
import { DatabaseServerService } from 'src/app/service/database-server.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
 
  constructor(
    public menuCtrl: MenuController,
    private router: Router,
    private loadingCtrl: LoadingController,
    public alertController: AlertController,
    private Storage: DataStorageService,
    private DBLocal:DatabaseService,
    private networkInterface: NetworkInterface,
    private DBServer: DatabaseServerService
  ) { }

  user: string;
  pass: string;

  loading: any;

  ngOnInit() {
    this.statusRed();
  }

  login(){
    this.statusRed();
    this.DBLocal.getUsuarioLogin(this.user, this.pass).then((data) => {
        
      this.Storage.setStorange('Usuario',data.Usuario);
      this.Storage.setStorange('Nombre', data.Nombre);
      this.Storage.setStorange('Apellido',data.Apellido);
      this.Storage.setStorange('TipoUsuario',data.TipoUsuario);

      this.router.navigateByUrl('welcome');
                
      console.log(data);
    },(error) => {
      this.presentAlert('Datos Incorrectos');
    });  
  }


  statusRed(){

    this.networkInterface.getWiFiIPAddress()
      .then((address) => {

        this.sincronizar();

        console.log(`IP: ${address.ip}, Subnet: ${address.subnet}`);

    }).catch((error) =>{
      this.presentAlert('No esta conectado a una red para actualizar los datos');
      console.error(`Unable to get IP: ${error}`)
    });
  }

  async presentAlert(messange:string) {
    const alert = await this.alertController.create({
      header: messange,
      buttons: ['OK']
    });

    await alert.present();
  }

  async sincronizar(){
    
    this.loading = await this.loadingCtrl.create({ message: 'Sincronizando...'});
    await this.loading.present();
    
    console.log('sincronizando');

      // Obtener los datos al servidor 

    this.DBLocal.getUsuariosServer().then((data) => {
      console.log('agregar usuarios local a server');

      for(var i = 0; i < data.length; i++){
        this.DBServer.setUsuario( data[i].Nombre,data[i].Apellido,data[i].Usuario,data[i].Password, data[i].TipoUsuario).subscribe((data) => {});
        //if(mensaje == 'OK')
          this.DBLocal.setUsuarioModificarStatus(data[i].Usuario);
      }
    }).catch((error) => {
      console.log(error);
    });
    

    this.DBLocal.getPaquetesServer().then((data) => {     
      console.log('agregar paquetes local a server');

      for(var i = 0; i < data.length; i++){
        this.DBServer.setPaquete( data[i].Descripcion,data[i].Dirreccion,data[i].Latitud,data[i].Longitud, data[i].StatusPaquete, data[i].EmpleadoEntrega).subscribe((data) => {});
        //if(mensaje == 'OK')
          this.DBLocal.setPaqueteModificarStatus(data[i].Usuario);
      }
    }).catch((error) => {
      console.log(error);
    });

    /*this.DBLocal.getPaquetesModificarServer().then((data) => {
      console.log('modificar paquete local a server');

      var mensaje;
     
      for(var i = 0; i < data.length; i++){
        
        this.DBServer.setPaqueteModificar( data[i].Descripcion, data[i].Dirreccion, data[i].Latitud, data[i].Longitud, data[i].StatusPaquete, data[i].EmpleadoEntrega).subscribe((data) => {
          
          console.log(data);
          mensaje = data;
        });
        //if(mensaje == 'OK')
          //this.DBLocal.setUsuarioStatusModificado(data[i].Descripcion, data[i].Dirreccion);
      }
    }).catch((error) => {
      console.log(error);
    });
    */

    this.DBLocal.getUsuariosModificarServer().then((data) => {
      console.log('modificar usuarios local a server');
      for(var i = 0; i < data.length; i++){
        
        this.DBServer.setUsuarioModificar( data[i].Nombre,data[i].Apellido,data[i].Usuario,data[i].Password, data[i].TipoUsuario).subscribe((data) => {});
        //if(mensaje == 'OK')
          this.DBLocal.setUsuarioStatusModificado(data[i].Usuario);
      }
    }).catch((error) => {
      console.log(error);
    });

    //Eliminar usuario

    this.DBLocal.getDeleteUsuarios().then((data) => {
      console.log('eliminar usuarios local a server');

      for(var i = 0; i < data.length; i++){
        this.DBServer.setUsuarioEliminar(data[i].Usuario).subscribe((data) => {});
        //if(mensaje == 'OK')
          this.DBLocal.setDeleteUsuarioModificarStatus(data[i].Usuario);
      }
    }).catch((error) => {
      console.log(error);
    });
    
    // Obtener los datos del servidor 

    this.DBServer.getUsuario().subscribe((data) => {

      console.log('obtener usuarios server a local');

      for(var i = 0; i < Object.keys(data).length; i++){
        this.DBLocal.setUsuarioServer(data[i].Usuario,data[i].Contrasena,data[i].Nombre,data[i].Apellido,data[i].TipoUsuario).then(() => {console.log('Usuario agregado ')});
      }
    });

    
    this.DBServer.getPaquetes().subscribe((data) => {

      console.log('obtener paquetes server a local');

      for(var i = 0; i < Object.keys(data).length; i++){
        this.DBLocal.setPaqueteServer(data[i].Descripcion, data[i].Dirreccion, data[i].Latitud, data[i].Longitud, data[i].EmpleadoEntrega).then(() => {console.log('Paquete agregado')});
      }
    });
    this.loading.dismiss();
  }
}
