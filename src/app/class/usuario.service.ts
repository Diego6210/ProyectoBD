import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  IdUsuario: number;
  Usuario: string;
  Nombre: string;
  Apellido: string
  TipoUsuario: number;

}
