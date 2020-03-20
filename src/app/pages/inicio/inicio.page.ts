import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { DataStorageService } from 'src/app/service/data-storage.service';
import { DatabaseServerService } from 'src/app/service/database-server.service';
import { DatabaseService } from 'src/app/service/database.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  
  public selectedIndex = 0;

  public appPages = [    
    {
      title: 'Mapa',
      url: 'mapa',
      icon: 'map',
      permiso: '1'
    },
    {
      title: 'Agregar Paquete',
      url: 'paquete-agregar',
      icon: 'pin',
      permiso: '1'
    },
    {
      title: 'Usuarios',
      url: 'usuarios',
      icon: 'people',
      permiso: '2'
    },
    {
      title: 'Paquetes',
      url: 'paquete',
      icon: 'briefcase',
      permiso: '1'
    }
  ];

  selectedPath = '';
  
  Nombre: any;
  Apellido:any;
  PermisosUsuarios: any;
  Usuarios: any; 
  loading: any;
  data: any = null;
  Paquete: any = null;

  constructor(
    private loadingCtrl: LoadingController,
    private router: Router,    
    private Storage: DataStorageService,
    private DBLocal: DatabaseService,
    private DBServer: DatabaseServerService
  ) 
  {
    const path = window.location.pathname.split('inicio/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    });
  }

  ngOnInit() {
    this.cabiar()
  }

  cabiar(){
    this.Storage.getStorange('Apellido').then((val) => { this.Apellido = val.property });    
    this.Storage.getStorange('Nombre').then((val) => { this.Nombre = val.property });
    this.Storage.getStorange('TipoUsuario').then((val) => { this.PermisosUsuarios = val.property });
  }

  Router(rout: any){
    this.router.navigateByUrl('inicio/'+rout);
  }
  
  async sincronizar(){
    
    this.loading = await this.loadingCtrl.create({ message: 'Sincronizando...'});
    await this.loading.present();
    
    console.log('sincronizando');

      // obtener los datos locales 

    this.DBLocal.getUsuariosServer().then((data) => {
      console.log('agregar usuarios local a server');

      for(var i = 0; i < data.length; i++){
        this.DBServer.setUsuario( data[i].Nombre,data[i].Apellido,data[i].Usuario,data[i].Password, data[i].TipoUsuario).subscribe((data) => {});
          this.DBLocal.setUsuarioModificarStatus(data[i].Usuario);
      }
    }).catch((error) => {
      console.log(error);
    });
    

    this.DBLocal.getPaquetesServer().then((data) => {     
      console.log('agregar paquetes local a server');

      for(var i = 0; i < data.length; i++){
        this.DBServer.setPaquete( data[i].Descripcion,data[i].Dirreccion,data[i].Latitud,data[i].Longitud, data[i].StatusPaquete, data[i].EmpleadoEntrega).subscribe((data) => {});
          this.DBLocal.setPaqueteModificarStatus(data[i].Usuario);
      }
    }).catch((error) => {
      console.log(error);
    });

    this.DBLocal.getPaquetesModificarServer().then((data) => {
      console.log('modificar paquete local a server');

      for(var i = 0; i < data.length; i++){
        
        this.DBServer.setPaqueteModificar( data[i].Descripcion, data[i].Dirreccion, data[i].Latitud, data[i].Longitud, data[i].StatusPaquete, data[i].EmpleadoEntrega).subscribe((data) => {});
          this.DBLocal.setPaqueteModificarStatus(data[i].IdPaquete);
      }
    }).catch((error) => {
      console.log(error);
    });
    

    this.DBLocal.getUsuariosModificarServer().then((data) => {
      console.log('modificar usuarios local a server');
      for(var i = 0; i < data.length; i++){
        
        this.DBServer.setUsuarioModificar( data[i].Nombre,data[i].Apellido,data[i].Usuario,data[i].Password, data[i].TipoUsuario).subscribe((data) => {});
          this.DBLocal.setUsuarioStatusModificado(data[i].Usuario);
      }
    }).catch((error) => {
      console.log(error);
    });


    this.DBLocal.getDeleteUsuarios().then((data) => {
      console.log('eliminar usuarios local a server');

      for(var i = 0; i < data.length; i++){
        this.DBServer.setUsuarioEliminar(data[i].Usuario).subscribe((data) => {});
          this.DBLocal.setDeleteUsuarioModificarStatus(data[i].Usuario);
      }
    }).catch((error) => {
      console.log(error);
    });

    this.DBLocal.getDeletePaquete().then((data) => {
      console.log('eliminar paquete local a server');

      for(var i = 0; i < data.length; i++){
        this.DBServer.setPaqueteEliminar(data[i].Descripcion, data[i].Dirreccion).subscribe((data) => {});
          this.DBLocal.setDeletePaqueteModificarStatus(data[i].Descripcion, data[i].Dirreccion);
      }
    }).catch((error) => {
      console.log(error);
    });
    
    // Obtener los datos del servidor 

    this.DBServer.getUsuarioEliminar().subscribe((data) => {

      console.log('obtener usuarios a eliminar server a local');

      for(var i = 0; i < Object.keys(data).length; i++){
        this.DBLocal.deleteUsuario(data[i].Usuario).then(() => {console.log('Usuario eliminar')});
      }
    });

    this.DBServer.getPaquetesEliminar().subscribe((data) => {

      console.log('obtener paquetes eliminar server a local');

      for(var i = 0; i < Object.keys(data).length; i++){ 
        this.DBLocal.deletePaqueteServer(data[i].Descripcion, data[i].Dirreccion).then(() => {console.log('Paquete eliminado')});
      }
    });

    this.DBServer.getUsuarioModificar().subscribe((data) => {

      console.log('obtener usuariosa modificar server a local');

      for(var i = 0; i < Object.keys(data).length; i++){
        this.DBLocal.setUsuarioModificarServer(data[i].Usuario,data[i].Contrasena,data[i].Nombre,data[i].Apellido,data[i].TipoUsuario).then(() => {console.log('Usuario modificado ')});
      }
    });

    this.DBServer.getPaquetesModificar().subscribe((data) => {

      console.log('obtener paquetes modificar server a local');

      for(var i = 0; i < Object.keys(data).length; i++){ 
        this.DBLocal.setPaqueteModificarServer(data[i].Descripcion, data[i].Dirreccion, data[i].EmpleadoEntrega,data[i].StatusPaquete).then(() => {console.log('Paquete agregado')});
      }
    });

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

  Logout(){    
    this.Storage.clearStorange();
    this.router.navigateByUrl('login');
  }
}
