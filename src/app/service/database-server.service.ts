import { Injectable} from '@angular/core';

import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatabaseServerService {

  constructor( private http: HttpClient ) { }

  private url: string = environment.server;

  getUsuarioLogin(usuario:string, contrasena: string) {

    let postData = {
      "usuario": usuario,
      "contrasena": contrasena
    }

    return this.http.post(`${this.url}getUsuarioLogin.php`, JSON.stringify(postData));
  }

  getUsuario() {
    return this.http.get(`${this.url}getUsuarios.php`);
  }

  setUsuario(Nombre:string, Apellido: string, Usuario: string, Password: string, TipoUsuario: number) {

    let postData = {
      "Nombre": Nombre,
      "Apellido": Apellido,
      "Usuario": Usuario,
      "Password": Password,
      "TipoUsuario": TipoUsuario
    }

    return this.http.post(`${this.url}setUsuario.php`, JSON.stringify(postData));
  }
}
