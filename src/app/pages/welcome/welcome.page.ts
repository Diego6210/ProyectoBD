import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { DataStorageService } from 'src/app/service/data-storage.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(
    public menuCtrl: MenuController,
    private Storage: DataStorageService,
    private router: Router
  ) { }

  
  Nombre: any;
  Apellido:any;


  ngOnInit() {
    this.Apellido = this.Storage.getStorange('Apellido').then((val) => { this.Apellido = val.property  });    
    this.Nombre = this.Storage.getStorange('Nombre').then((val) => { this.Nombre = val.property });

    setTimeout(() => {
      this.router.navigateByUrl('inicio/dashboard'),6000;
    })
  }

}
