import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, Marker, MarkerCluster } from '@ionic-native/google-maps';
import { LoadingController, ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/app/service/database.service';
import { DataStorageService } from 'src/app/service/data-storage.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  constructor(
    private loadingCtrl: LoadingController,
    public modalController: ModalController,
    public geolocation:Geolocation,
    private Storage: DataStorageService,
    private DBlocal: DatabaseService
  ) { }
  
  lat:number = 0;
  lon:number = 0;
  map: GoogleMap;
  loading: any;

  async ngOnInit() {
    this.loadMap();
  }
  
  async loadMap() {
    
    // Obtiene la ubicacion
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude
      this.lon = resp.coords.longitude
      console.log('lat:' + this.lat + ' , long:' + this.lon);        
    }).catch((error) => {
       console.log('Error al obtener la localizacion', error);
    }); 
    
    // Carga google map
    this.loading = await this.loadingCtrl.create({ message: 'Cargando...'});
    await this.loading.present();
    
    
    //Configuracion del mapap
    let mapOptions: GoogleMapOptions = {
      camera: {
         target: {
           lat: this.lat,
           lng: this.lon
         },
         zoom: 18,
         tilt: 30
       }
    };

    //this.map.clear();
    this.map = GoogleMaps.create('map_canvas' , mapOptions);
    this.loading.dismiss();


    //Marcar tu ubicacion
    let marker: Marker = this.map.addMarkerSync({
      title: 'Tu ubicacion',
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat: this.lat,
        lng: this.lon
      }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      confirm('Usted esta aqui');
    });
    
    this.Storage.getStorange('Usuario').then((val) => {
      this.DBlocal.getPaquetesEntrega(val.property).then((data) => {
      this.addCluster(data);
      console.log(data);

      }).catch((error) => {
        console.log(error);
      });
    });
  }

  addCluster(data) {
    let markerCluster: MarkerCluster = this.map.addMarkerClusterSync({
      markers: data,
      icons: [
        {
          url: "./assets/markercluster/large.png",
          label: {
            color: "white"
          }
        }
      ]
    });

    markerCluster.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {
      let marker: Marker = params[1];
      marker.setTitle(marker.get("name"));
      
      if(marker.get("StatusPaquete") == 0){
        if(confirm('Paquete entregado?')){
          console.log("click OK");
          this.DBlocal.setPaqueteEstatusEntrega(marker.get("IdPaquete"));
          this.DBlocal.getPaqueteStatusModificar(marker.get("IdPaquete")).then((data) => {
            if(data.length > 0)
            {
              this.DBlocal.setPaqueteModificarStatusModificado(marker.get("IdPaquete"));
              //this.loadMap();
            }
          });
        }
      }

      marker.setSnippet(marker.get("address"));
      marker.showInfoWindow();

    });
  }

}
