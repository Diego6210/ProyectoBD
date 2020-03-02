import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment,
  MarkerCluster
} from '@ionic-native/google-maps';
import { LoadingController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {

  constructor(
    private loadingCtrl: LoadingController,
    public modalController: ModalController,
    public geolocation:Geolocation
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
      alert('Usted esta aqui');
    });

    this.addCluster(this.dummyData());
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
      marker.setSnippet(marker.get("address"));
      marker.showInfoWindow();
    });
  }


  dummyData() {
    return [
      {
        "position": {
          "lat": 21.382314,
          "lng": -157.933097
        },
        "name": "Starbucks - HI - Aiea  03641",
        "address": "Aiea Shopping Center_99-115\nAiea Heights Drive #125_Aiea, Hawaii 96701",
        "icon": "./../../assets/paquete.png"
      },
      {
        "position": {
          "lat": 21.3871,
          "lng": -157.9482
        },
        "name": "Starbucks - HI - Aiea  03642",
        "address": "Pearlridge Center_98-125\nKaonohi Street_Aiea, Hawaii 96701",
        "icon": "./../../assets/paquete.png"
      }
    ];
  }


}
