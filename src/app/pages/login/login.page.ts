import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, AlertController } from '@ionic/angular';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { DataStorageService } from 'src/app/service/data-storage.service';
import { DatabaseService } from 'src/app/service/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
 
  constructor(
    public menuCtrl: MenuController,
    private router: Router,
    public alertController: AlertController,
    private Storage: DataStorageService,
    private DBLocal:DatabaseService,
    private networkInterface: NetworkInterface
  ) { }

  user: string;
  pass: string;

  ngOnInit() {
    this.statusRed();
  }

  login(){
    this.statusRed();
    this.DBLocal.getUsuarioLogin(this.user, this.pass).then((data) => {
        
      this.Storage.setStorange('Usuario',data.Usuario);
      this.Storage.setStorange('IdUsuario',data.IdUsuario);
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
}
