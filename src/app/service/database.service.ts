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
        db.executeSql('create table usuario (Usuario varchar(20) PRIMARY KEY, Password varchar(20), Nombre varchar(50), Apellido varchar(50),TipoUsuario integer, sincronizado integer, modificado integer);', []).then(() => console.log('Executed SQL')).catch(e => console.log(e));
        db.executeSql('create table paquete (IdPaquete INTEGER PRIMARY KEY AUTOINCREMENT,Descripcion varchar(50), Dirreccion varchar(50), Latitud integer, Longitud integer, StatusPaquete integer, EmpleadoEntrega varchar(20),sincronizado integer, modificado integer);', []).then(() => console.log('Executed SQL')).catch(e => console.log(e));
        db.executeSql('create table deletePaquete (Descripcion varchar(50) UNIQUE, Dirreccion varchar(50) UNIQUE,sincronizado integer);', []).then(() => console.log('Executed SQL')).catch(e => console.log(e));
        db.executeSql('create table deleteUsuario (Usuario varchar(20) PRIMARY KEY, sincronizado integer);', []).then(() => console.log('Executed SQL')).catch(e => console.log(e));
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

  getPaqueteModificar(IdPaquete:string): Promise<any> {
    return this.db.executeSql('select * from paquete where IdPaquete = ?',[IdPaquete]).then(res => { 
      return {
        position: {
          lat: res.rows.item(0).Latitud,
          lng: res.rows.item(0).Longitud
        },
        name: res.rows.item(0).Descripcion,
        IdPaquete: res.rows.item(0).IdPaquete,
        address: res.rows.item(0).Dirreccion,
        StatusPaquete: res.rows.item(0).StatusPaquete,
        EmpleadoEntrega : res.rows.item(0).EmpleadoEntrega,
        sincronizado: res.rows.item(0).sincronizado
      }
    });
  }

  setPaqueteModificar(Descripcion:string, Dirreccion:string, EmpleadoEntrega:string, StatusPaquete:number, IdPaquete:string){
    let sql = 'UPDATE paquete SET Descripcion = ?, Dirreccion = ?, EmpleadoEntrega  = ?, StatusPaquete = ? WHERE IdPaquete = ?';
    return this.db.executeSql(sql, [Descripcion, Dirreccion, EmpleadoEntrega, StatusPaquete,IdPaquete]).then(data => {
      console.log('usuario actualizado');
    });
  }

  setUsuarioModificar(Usuario: string, Password:string, Nombre:string, Apellido:string, TipoUsuario:number){
    let data = [Password, Nombre, Apellido, TipoUsuario, Usuario];
    return this.db.executeSql('UPDATE usuario SET Password = ?, Nombre = ?, Apellido = ?, TipoUsuario = ?, modificado = 1 WHERE Usuario = ?', [Password, Nombre, Apellido, TipoUsuario, Usuario])
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
        //console.log(items);
        return items;
    });
  }

  createUser(Usuario:string,Password:string,Nombre:string,Apellido:string,TipoUsuario:number){
    return new Promise((resolve, reject) =>{
      let sql = 'insert into usuario(Usuario, Password, Nombre,Apellido,TipoUsuario,sincronizado, modificado) values(?,?,?,?,?,0,0)';
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

  deletePaquete(id) {
    return this.db.executeSql('DELETE FROM paquete WHERE IdPaquete = ?', [id])
    .then(data => {
      console.log('paquete eliminado');
    })
  }

  setDeleteUsuario(Usuario){
    return new Promise((resolve, reject) =>{
      let sql = 'insert into deleteUsuario(Usuario, sincronizado) values(?,0)';
      this.db.executeSql(sql, [Usuario]).then((data) => {
        resolve(data);
      }),(error) => {
        reject(error);
      };  
    });
  }
  
  setDeletePaquete(Descripcion:string,Dirreccion:string){
    return new Promise((resolve, reject) =>{
      let sql = 'insert into deletePaquete(Descripcion, Dirreccion, sincronizado) values(?,?,0)';
      this.db.executeSql(sql, [Descripcion,Dirreccion]).then((data) => {
        resolve(data);
      }),(error) => {
        reject(error);
      };  
    });
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
        //console.log(items);
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
      let sql = 'insert into paquete(Descripcion, Dirreccion, Latitud, Longitud, EmpleadoEntrega, StatusPaquete ,sincronizado,modificado ) values(?,?,?,?,?,0,0,0)';
      this.db.executeSql(sql, [Descripcion, Dirreccion, Latitud, Longitud, EmpleadoEntrega]).then((data) => {
        resolve(data);
      }),(error) => {
        reject(error);
      };  
    });
  }

  setUsuarioModificarStatus(Usuario: string){
    return this.db.executeSql('UPDATE usuario SET sincronizado = 1  WHERE Usuario = ?', [Usuario])
    .then(data => {
      console.log('usuario actualizado');
    })
  }

  setDeleteUsuarioModificarStatus(Usuario: string){ 
    return this.db.executeSql('UPDATE deleteUsuario SET sincronizado = 1  WHERE Usuario = ?', [Usuario])
    .then(data => {
      console.log('delete usuario actualizado');
    })
  }

  setDeletePaqueteModificarStatus(Descripcion:string,Dirreccion:string){ 
    return this.db.executeSql('UPDATE deletePaquete SET sincronizado = 1  WHERE Descripcion = ? and Dirreccion = ?', [Descripcion,Dirreccion])
    .then(data => {
      console.log('delete paquete actualizado');
    });
  }

  setUsuarioStatusModificado(Usuario: string){
    return this.db.executeSql('UPDATE usuario SET modificado = 0  WHERE Usuario = ?', [Usuario])
    .then(data => {
      console.log('usuario actualizado modificado');
    });
  }
 
  setPaqueteModificarStatus(IdPaquete: string){
    return this.db.executeSql('UPDATE paquete SET sincronizado = 1  WHERE IdPaquete = ?', [IdPaquete])
    .then(data => {
      console.log('paquete actualizado');
    });
  }

  setUsuarioModificarStatusModificado(Usuario: string){
    return this.db.executeSql('UPDATE usuario SET modificado = 1  WHERE Usuario = ?', [Usuario])
    .then(data => {
      console.log('usuario actualizado estatus modificado');
    })
  }

  setPaqueteModificarStatusModificado(idpaquete: string){
    return this.db.executeSql('UPDATE paquete SET modificado = 1  WHERE IdPaquete = ?', [idpaquete])
    .then(data => {
      console.log('paquete actualizado');
    });
  }
  
  getUsuarioStatusModificar(Usuario: string):Promise<any>{
// revisar si el estatu esta sincronizado
    return this.db.executeSql('select Usuario from usuario WHERE sincronizado = 1 and Usuario = ?',[Usuario]).then(res => { 
       let items = [];

        for (var i = 0; i < res.rows.length; i++) { 
          items.push({ 
            Usuario: res.rows.item(i).Usuario
           });
        }
        return items;
    });
  }

  getPaqueteStatusModificar(idPaquete: string):Promise<any>{
    // revisar si el estatu esta sincronizado
        return this.db.executeSql('select Descripcion from paquete WHERE sincronizado = 1 and idPaquete = ?',[idPaquete]).then(res => { 
           let items = [];
    
            for (var i = 0; i < res.rows.length; i++) { 
              items.push({ 
                Descripcion: res.rows.item(i).Descripcion
               });
            }
            return items;
        });
      }

  
  getDeleteUsuarios():Promise<any>{

    return this.db.executeSql('select * from deleteUsuario where sincronizado = 0',[]).then(res => { 
       let items = [];

        for (var i = 0; i < res.rows.length; i++) { 
          items.push({ 
            Usuario: res.rows.item(i).Usuario,
            sincronizado: res.rows.item(i).sincronizado
          });
        }
        //console.log(items);
        return items;
    });
  }

  getDeletePaquete():Promise<any>{

    return this.db.executeSql('select * from deletePaquete where sincronizado = 0',[]).then(res => { 
       let items = [];

        for (var i = 0; i < res.rows.length; i++) { 
          items.push({ 
            Descripcion: res.rows.item(i).Descripcion,
            Dirreccion: res.rows.item(i).Dirreccion,
            sincronizado: res.rows.item(i).sincronizado
          });
        }
        //console.log(items);
        return items;
    });
  }

  setDeleteUsuariosModificarStatus(Usuario: string){
    return this.db.executeSql('UPDATE deleteUsuario SET sincronizado = 1  WHERE sincronizado = 0', [])
    .then(data => {
      console.log('paquete actualizado');
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
            EmpleadoEntrega : res.rows.item(i).EmpleadoEntrega,
            sincronizado : res.rows.item(i).sincronizado
          });
        }
        //console.log(items);
        return items;
    });
  }

  getUsuariosServer():Promise<any>{

    return this.db.executeSql('select * from usuario where sincronizado = 0',[]).then(res => { 
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
        //console.log(items);
        return items;
    });
  }

  setPaqueteServer(Descripcion:string, Dirreccion:string, Latitud:number, Longitud:number, EmpleadoEntrega:string){
    return new Promise((resolve, reject) =>{
      let sql = 'insert into paquete(Descripcion, Dirreccion, Latitud, Longitud, EmpleadoEntrega,sincronizado) values(?,?,?,?,?,1)';
      this.db.executeSql(sql, [Descripcion, Dirreccion, Latitud, Longitud, EmpleadoEntrega]).then((data) => {
        resolve(data);
      }),(error) => {
        reject(error);
      };  
    });
  }

  setUsuarioServer(Usuario:string,Password:string,Nombre:string,Apellido:string,TipoUsuario:number){
    return new Promise((resolve, reject) =>{
      let sql = 'insert into usuario(Usuario, Password, Nombre,Apellido,TipoUsuario, sincronizado) values(?,?,?,?,?,1)';
      this.db.executeSql(sql, [Usuario,Password,Nombre,Apellido,TipoUsuario]).then((data) => {
        resolve(data);
      }),(error) => {
        reject(error);
      };  
    });
  }
  
  getPaquetesModificarServer():Promise<any>{

    return this.db.executeSql('select * from paquete where modificado = 1',[]).then(res => { 
       let items = [];

        for (var i = 0; i < res.rows.length; i++) { 
          items.push({ 
            IdPaquete: res.rows.item(i).IdPaquete,
            Latitud: res.rows.item(i).Latitud,
            Longitud: res.rows.item(i).Longitud,
            Descripcion: res.rows.item(i).Descripcion,
            Dirreccion: res.rows.item(i).Dirreccion,
            StatusPaquete: res.rows.item(i).StatusPaquete,
            EmpleadoEntrega : res.rows.item(i).EmpleadoEntrega,
            sincronizado : res.rows.item(i).sincronizado
          });
        }
        //console.log(items);
        return items;
    });
  }

  getUsuariosModificarServer():Promise<any>{

    return this.db.executeSql('select * from usuario where modificado = 1',[]).then(res => { 
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
        //console.log(items);
        return items;
    });
  }

  getPaquetesServerDelete():Promise<any>{

    return this.db.executeSql('select * from deletePaquete',[]).then(res => { 
       let items = [];

        for (var i = 0; i < res.rows.length; i++) { 
          items.push({ 
            
            Latitud: res.rows.item(i).Latitud,
            Longitud: res.rows.item(i).Longitud,
            Descripcion: res.rows.item(i).Descripcion,
            Dirreccion: res.rows.item(i).Dirreccion,
            StatusPaquete: res.rows.item(i).StatusPaquete,
            EmpleadoEntrega : res.rows.item(i).EmpleadoEntrega,
            sincronizado : res.rows.item(i).sincronizado
          });
        }
        //console.log(items);
        return items;
    });
  }

  getUsuariosServerDelete():Promise<any>{

    return this.db.executeSql('select * from deleteUsuario',[]).then(res => { 
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
        //console.log(items);
        return items;
    });
  }

  setUsuarioModificarServer(Usuario: string, Password:string, Nombre:string, Apellido:string, TipoUsuario:number){
    let data = [Password, Nombre, Apellido, TipoUsuario, Usuario];
    return this.db.executeSql('UPDATE usuario SET Password = ?, Nombre = ?, Apellido = ?, TipoUsuario = ?, modificado = 0 WHERE Usuario = ?', [Password, Nombre, Apellido, TipoUsuario, Usuario])
    .then(data => {
      console.log('usuario actualizado');
    })
  }

  setPaqueteModificarServer(Descripcion:string, Dirreccion:string, EmpleadoEntrega:string, StatusPaquete:number){
    let sql = 'UPDATE paquete SET Descripcion = ?, Dirreccion = ?, EmpleadoEntrega  = ?, StatusPaquete = ? WHERE Descripcion = ? and Dirreccion = ?';
    return this.db.executeSql(sql, [Descripcion, Dirreccion, EmpleadoEntrega, StatusPaquete,Descripcion, Dirreccion]).then(data => {
      console.log('usuario actualizado');
    });
  }

  deletePaqueteServer(Descripcion:string, Dirreccion:string) {
    return this.db.executeSql('DELETE FROM paquete WHERE Descripcion = ? and Dirreccion = ?', [Descripcion,Dirreccion])
    .then(data => {
      console.log('paquete eliminado');
    })
  }
}