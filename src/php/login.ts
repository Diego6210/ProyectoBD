import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { DataStorageService } from 'src/app/service/data-storage.service';
import { DatabaseServerService } from 'src/app/service/database-server.service';
import { DatabaseService } from 'src/app/service/database.service';

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
  
  sincronizar(){
    console.log('sincronizando');
    this.DBLocal.getUsuariosServer().then((data) => {
      this.Usuarios = data;

      for(var i = 0; i < data.length; i++){
        
        this.DBServer.setUsuario( data[i].Nombre,data[i].Apellido,data[i].Usuario,data[i].Password, data[i].TipoUsuario);
        this.DBLocal.setUsuarioModificarStatus(data[i].Usuario);
      }
    }).catch((error) => {
      console.log(error);
    });

    this.DBLocal.getPaquetesServer().then((data) => {
      this.Paquete = data;

      for(var i = 0; i < data.length; i++){
        console.log('paquetes: ' + data[i].Descripcion);
        this.DBServer.setPaquete( data[i].Descripcion,data[i].Dirreccion,data[i].Latitud,data[i].Longitud, data[i].StatusPaquete, data[i].EmpleadoEntrega);
        this.DBLocal.setPaqueteModificarStatus(data[i].Usuario);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  Logout(){    
    this.Storage.clearStorange();
    this.router.navigateByUrl('login');
  }
}
