import { Component, OnInit } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  Marker,
  Geocoder,
  GeocoderResult,
  MarkerCluster
} from '@ionic-native/google-maps';
import { LoadingController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DatabaseService } from 'src/app/service/database.service';

@Component({
  selector: 'app-paquete-agregar',
  templateUrl: './paquete-agregar.page.html',
  styleUrls: ['./paquete-agregar.page.scss'],
})
export class PaqueteAgregarPage implements OnInit {

  constructor(
    public geolocation:Geolocation,
    private loadingCtrl: LoadingController,
    private DBlocal: DatabaseService
  ) { }

  
  lat:number = 0;
  lon:number = 0;
  map: GoogleMap;
  loading: any;
  search_address: any = '';
  usuarioEntregar: string = '';
  newLat: number;
  newLon: number;
  Usuarios:any;
  Descripcion: string = '';
  
  async ngOnInit() {    
    this.DBlocal.getTodosUsuarios().then((data) => {
      this.Usuarios = data;
    });
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
    
    
    //Configuracion del mapa
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
  
    this.DBlocal.getPaquetes().then((data) => {
      this.addCluster(data);
      console.log(data);

    }).catch((error) => {
      console.log(error);
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
      marker.setSnippet(marker.get("address"));
      marker.showInfoWindow();
    });
  }

  async Buscar(event) {

    await this.loading.present();
    //this.map.clear();


    // Address -> latitude,longitude
    Geocoder.geocode({
      "address": this.search_address
    }).then((results: GeocoderResult[]) => {
      console.log(results);
  
      this.loading.dismiss();
        
      // Add a marker
      
      if (results.length > 0) {
        let marker: Marker = this.map.addMarkerSync({
          'position': results[0].position,
          'title':  this.search_address
        });
        this.map.animateCamera({
          'target': marker.getPosition(),
          'zoom': 17
        });
        this.newLat =  marker.getPosition().lat;
        
        this.newLon =  marker.getPosition().lng;

      marker.showInfoWindow();
      } else {
        alert("No encontrado");
      }
    });
  }

  guardar(){
    this.DBlocal.setPaquete(this.Descripcion,this.search_address,this.newLat,this.newLon,this.usuarioEntregar).then((data) => {
      console.log('Agregado');
      alert('Agregado Correctamente');
      this.Descripcion ='';
      this.search_address = ''; 
    }).catch((error)=> {
      console.log(error);
    });
  }

}
