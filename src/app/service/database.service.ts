import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { UsuarioService } from '../class/usuario.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private sqlite: SQLite
  ) { 
    this.createDataBase(); 
  }

  private db: SQLiteObject;
  private isOpen: boolean;
  statusWifi: Boolean;
  UsuariosList = new BehaviorSubject([]);

  fetchUsuarios(): Observable<any[]> {
    this.getUsuarios();
    return this.UsuariosList.asObservable();
  }

  createDataBase(){
  
    if(!this.isOpen){
      this.sqlite = new SQLite();
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      }).then((db: SQLiteObject) => {

        this.db = db;
        
        // Ejecuta los comandos de creacion de tablas 
        db.executeSql('create table usuario (Usuario varchar(20) PRIMARY KEY, Password varchar(20), Nombre varchar(50), Apellido varchar(50),TipoUsuario integer, sincronizado integer);', []).then(() => console.log('Executed SQL')).catch(e => console.log(e));
        db.executeSql('create table paquete (IdPaquete INTEGER PRIMARY KEY AUTOINCREMENT,Descripcion varchar(50), Dirreccion varchar(50), Latitud integer, Longitud integer, StatusPaquete integer, EmpleadoEntrega varchar(20),sincronizado integer);', []).then(() => console.log('Executed SQL')).catch(e => console.log(e));
        db.executeSql('insert or ignore into usuario(Nombre, Usuario, Password, TipoUsuario, sincronizado) values("Administrador", "Administrador", "admin", 2, 1)', []).then(() => console.log('Executed SQL')).catch(e => console.log(e));
                
        this.isOpen = true;

        console.log(this.isOpen);      
      }).catch(e => console.log(e));
    }
  }


  getUsuarioLogin(Usuario:string,Password:string): Promise<UsuarioService> {
    return this.db.executeSql('select * from usuario where Usuario = ? and Password = ?',[Usuario,Password]).then(res => { 
      return {
        Usuario: res.rows.item(0).Usuario,
        Nombre: res.rows.item(0).Nombre,
        Apellido: res.rows.item(0).Apellido,
        TipoUsuario: res.rows.item(0).TipoUsuario
      }
    });
  }

  getUsuarioModificar(Usuario:string): Promise<UsuarioService> {
    return this.db.executeSql('select * from usuario where Usuario = ?',[Usuario]).then(res => { 
      return {
        Usuario: res.rows.item(0).Usuario,
        Nombre: res.rows.item(0).Nombre,
        Apellido: res.rows.item(0).Apellido,
        TipoUsuario: res.rows.item(0).TipoUsuario
      }
    });
  }

  setUsuarioModificar(Usuario: string, Password:string, Nombre:string, Apellido:string, TipoUsuario:number){
    let data = [Password, Nombre, Apellido, TipoUsuario, Usuario];
    return this.db.executeSql('UPDATE usuario SET Password = ?, Nombre = ?, Apellido = ?, TipoUsuario = ? WHERE Usuario = ?', [Password, Nombre, Apellido, TipoUsuario, Usuario])
    .then(data => {
      console.log('usuario actualizado');
    })
  }

  getUsuarios():Promise<any>{

    return this.db.executeSql('select * from usuario',[]).then(res => { 
       let items = [];

        for (var i = 0; i < res.rows.length; i++) { 
          items.push({ 
            Usuario: res.rows.item(i).Usuario,
            Nombre: res.rows.item(i).Nombre,
            Apellido: res.rows.item(i).Apellido,
            TipoUsuario: res.rows.item(i).TipoUsuario,
            sincronizado: res.rows.item(i).sincronizado
           });
        }
        return items;
    });
  }

  getTodosUsuarios():Promise<any>{

    return this.db.executeSql('select Usuario from usuario',[]).then(res => { 
       let items = [];

        for (var i = 0; i < res.rows.length; i++) { 
          items.push({ 
            Usuario: res.rows.item(i).Usuario
           });
        }
        console.log(items);
        return items;
    });
  }

  createUser(Usuario:string,Password:string,Nombre:string,Apellido:string,TipoUsuario:number){
    return new Promise((resolve, reject) =>{
      let sql = 'insert into usuario(Usuario, Password, Nombre,Apellido,TipoUsuario) values(?,?,?,?,?)';
      this.db.executeSql(sql, [Usuario,Password,Nombre,Apellido,TipoUsuario]).then((data) => {
        resolve(data);
      }),(error) => {
        reject(error);
      };  
    });
  }

  deleteUsuario(id) {
    return this.db.executeSql('DELETE FROM usuario WHERE Usuario = ?', [id])
    .then(data => {
      console.log('usuario eliminado');
    })
  }

  getPaquetes():Promise<any>{

    return this.db.executeSql('select * from paquete',[]).then(res => { 
       let items = [];

        for (var i = 0; i < res.rows.length; i++) { 
          items.push({ 
            
            position: {
              lat: res.rows.item(i).Latitud,
              lng: res.rows.item(i).Longitud
            },
            name: res.rows.item(i).Descripcion,
            IdPaquete: res.rows.item(i).IdPaquete,
            address: res.rows.item(i).Dirreccion,
            StatusPaquete: res.rows.item(i).StatusPaquete,
            EmpleadoEntrega : res.rows.item(i).EmpleadoEntrega,
            sincronizado: res.rows.item(i).sincronizado
          });
        }
        return items;
    });
  }

  getPaquetesEntrega(Empleado: string):Promise<any>{

    return this.db.executeSql('select * from paquete where EmpleadoEntrega = ?', [Empleado]).then(res => { 
       let items = [];

        for (var i = 0; i < res.rows.length; i++) { 
          items.push({ 
            
            position: {
              lat: res.rows.item(i).Latitud,
              lng: res.rows.item(i).Longitud
            },
            name: res.rows.item(i).Descripcion,
            IdPaquete: res.rows.item(i).IdPaquete,
            address: res.rows.item(i).Dirreccion,
            StatusPaquete: res.rows.item(i).StatusPaquete,
            sincronizado: res.rows.item(i).sincronizado

          });
        }
        return items;
    });
  }

  setPaquete(Descripcion:string, Dirreccion:string, Latitud:number, Longitud:number, EmpleadoEntrega:string){
    return new Promise((resolve, reject) =>{
      let sql = 'insert into paquete(Descripcion, Dirreccion, Latitud, Longitud, EmpleadoEntrega) values(?,?,?,?,?)';
      this.db.executeSql(sql, [Descripcion, Dirreccion, Latitud, Longitud, EmpleadoEntrega]).then((data) => {
        resolve(data);
      }),(error) => {
        reject(error);
      };  
    });
  }

  /* Server */

  getPaquetesServer():Promise<any>{

    return this.db.executeSql('select * from paquete where sincronizado = 0',[]).then(res => { 
       let items = [];

        for (var i = 0; i < res.rows.length; i++) { 
          items.push({ 
            
            Latitud: res.rows.item(i).Latitud,
            Longitud: res.rows.item(i).Longitud,
            Descripcion: res.rows.item(i).Descripcion,
            Dirreccion: res.rows.item(i).Dirreccion,
            StatusPaquete: res.rows.item(i).StatusPaquete,
            EmpleadoEntrega : res.rows.item(i).EmpleadoEntrega
          });
        }
        return items;
    });
  }

  getUsuariosServer():Promise<any>{

    return this.db.executeSql('select * from usuario',[]).then(res => { 
       let items = [];

        for (var i = 0; i < res.rows.length; i++) { 
          items.push({ 
            Usuario: res.rows.item(i).Usuario,
            Password: res.rows.item(i).Password,
            Nombre: res.rows.item(i).Nombre,
            Apellido: res.rows.item(i).Apellido,
            TipoUsuario: res.rows.item(i).TipoUsuario,
            sincronizado: res.rows.item(i).sincronizado
           });
        }
        console.log(items);
        return items;
    });
  }

  setPaqueteServer(Descripcion:string, Dirreccion:string, Latitud:number, Longitud:number, EmpleadoEntrega:string, sincronizado:number){
    return new Promise((resolve, reject) =>{
      let sql = 'insert into paquete(Descripcion, Dirreccion, Latitud, Longitud, EmpleadoEntrega,sincronizado) values(?,?,?,?,?,?)';
      this.db.executeSql(sql, [Descripcion, Dirreccion, Latitud, Longitud, EmpleadoEntrega, sincronizado]).then((data) => {
        resolve(data);
      }),(error) => {
        reject(error);
      };  
    });
  }

  setUsuarioServer(Usuario:string,Password:string,Nombre:string,Apellido:string,TipoUsuario:number){
    return new Promise((resolve, reject) =>{
      let sql = 'insert into usuario(Usuario, Password, Nombre,Apellido,TipoUsuario, Usuario varchar(20)) values(?,?,?,?,?)';
      this.db.executeSql(sql, [Usuario,Password,Nombre,Apellido,TipoUsuario]).then((data) => {
        resolve(data);
      }),(error) => {
        reject(error);
      };  
    });
  }

}