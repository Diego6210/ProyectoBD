import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { DataStorageService } from 'src/app/service/data-storage.service';

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

  constructor(
    private router: Router,    
    private Storage: DataStorageService
  ) 
  {
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

  Logout(){    
    this.Storage.clearStorange();
    this.router.navigateByUrl('login');
  }
}
