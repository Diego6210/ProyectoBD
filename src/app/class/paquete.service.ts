import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaqueteService {
  
  Descripción: string;
  Dirrección: string; 
  Latitud: string;  
  Longitud: string;
  StatusPaquete: string; 
  EmpleadoEntrega: string; 
}
