import { Injectable} from '@angular/core';

import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseServerService {

  constructor(
    private http: HttpClient
  ) { }

  private url: string = environment.server;

  getUsuario() {
    return this.http.get(`${this.url}getUsuarios.php`);
  }

  getPaquetes() {
    return this.http.get(`${this.url}getPaquetes.php`);
  }

  setUsuario(Nombre:string, Apellido:string, Usuario:string, Password:string, TipoUsuario:string) {
    
    let postData = {
      "Usuario": Usuario,
      "Password": Password,
      "Nombre": Nombre,
      "Apellido": Apellido,
      "TipoUsuario": TipoUsuario
    }
    
    //this.http.post(`${this.url}setUsuario.php`, JSON.stringify(postData)).subscribe((data) => {console.log(data)});

    return this.http.post(`${this.url}setUsuario.php`, JSON.stringify(postData));
  }

  setUsuarioModificar(Nombre:string, Apellido:string, Usuario:string, Password:string, TipoUsuario:string) {
    
    let postData = {
      "Usuario": Usuario,
      "Password": Password,
      "Nombre": Nombre,
      "Apellido": Apellido,
      "TipoUsuario": TipoUsuario
    }

    return this.http.post(`${this.url}setUsuarioModificar.php`, JSON.stringify(postData));
  }

  setUsuarioEliminar(Usuario:string) {
    
    let postData = {
      "Usuario": Usuario
    }

    return this.http.post(`${this.url}setUsuarioEliminar.php`, JSON.stringify(postData));
  }

  setPaquete(Descripcion, Dirreccion, Latitud, Longitud, StatusPaquete, EmpleadoEntrega) {
    
    let postData = {
      "Descripcion": Descripcion,
      "Dirreccion": Dirreccion,
      "Latitud": Latitud,
      "Longitud": Longitud,
      "StatusPaquete": StatusPaquete,
      "EmpleadoEntrega": EmpleadoEntrega
    }

//    this.http.post(`${this.url}setPaquete.php`, JSON.stringify(postData)).subscribe((data) => {console.log(data)});
    return this.http.post(`${this.url}setPaquete.php`, JSON.stringify(postData));
  }

  setPaqueteModificar(Descripcion, Dirreccion, Latitud, Longitud, StatusPaquete, EmpleadoEntrega) {
      
    let postData = {
      "Descripcion": Descripcion,
      "Dirreccion": Dirreccion,
      "Latitud": Latitud,
      "Longitud": Longitud,
      "StatusPaquete": StatusPaquete,
      "EmpleadoEntrega": EmpleadoEntrega
    }
    
    return this.http.post(`${this.url}setPaquete.php`, JSON.stringify(postData));
  }

}