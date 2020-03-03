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
        db.executeSql('create table usuario (IdUsuario INTEGER PRIMARY KEY AUTOINCREMENT, Usuario varchar(20),Password varchar(20), Nombre varchar(50), Apellido varchar(50),TipoUsuario int);', []).then(() => console.log('Executed SQL')).catch(e => console.log(e));
        db.executeSql('insert or ignore into usuario(IdUsuario,Nombre, Usuario, Password, TipoUsuario) values(1,"Administrador", "Administrador", "admin",2)', []).then(() => console.log('Executed SQL')).catch(e => console.log(e));
                
        this.isOpen = true;

        console.log(this.isOpen);      
      }).catch(e => console.log(e));
    }
  }


  getUsuarioLogin(Usuario:string,Password:string): Promise<UsuarioService> {
    return this.db.executeSql('select * from usuario where Usuario = ? and Password = ?',[Usuario,Password]).then(res => { 
      return {
        IdUsuario: res.rows.item(0).IdUsuario,
        Usuario: res.rows.item(0).Usuario,
        Nombre: res.rows.item(0).Nombre,
        Apellido: res.rows.item(0).Apellido,
        TipoUsuario: res.rows.item(0).TipoUsuario
      }
    });
  }

  getUsuarioModificar(IdUsuario:number): Promise<UsuarioService> {
    return this.db.executeSql('select * from usuario where IdUsuario = ?',[IdUsuario]).then(res => { 
      return {
        IdUsuario: res.rows.item(0).IdUsuario,
        Usuario: res.rows.item(0).Usuario,
        Nombre: res.rows.item(0).Nombre,
        Apellido: res.rows.item(0).Apellido,
        TipoUsuario: res.rows.item(0).TipoUsuario
      }
    });
  }

  setUsuarioModificar(IdUsuario: number, Password:string, Nombre:string, Apellido:string, TipoUsuario:number){
    let data = [Password, Nombre, Apellido, TipoUsuario, IdUsuario];
    return this.db.executeSql('UPDATE usuario SET Password = ?, Nombre = ?, Apellido = ?, TipoUsuario = ? WHERE IdUsuario = ?', data)
    .then(data => {
      console.log('usuario actualizado');
    })
  }

  getUsuarios():Promise<any>{

    return this.db.executeSql('select * from usuario',[]).then(res => { 
       let items = [];

        for (var i = 0; i < res.rows.length; i++) { 
          items.push({ 
            IdUsuario: res.rows.item(i).IdUsuario,
            Usuario: res.rows.item(i).Usuario,
            Nombre: res.rows.item(i).Nombre,
            Apellido: res.rows.item(i).Apellido,
            TipoUsuario: res.rows.item(i).TipoUsuario
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
    return this.db.executeSql('DELETE FROM usuario WHERE IdUsuario = ?', [id])
    .then(data => {
      console.log('usuario eliminado');
    })
  }

}