import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { UsuarioService } from '../class/usuario.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Network } from '@ionic-native/network/ngx';

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
        db.executeSql('create table usuario (IdUsuario int auto_increment primary key, Usuario varchar(20),Password varchar(20), Nombre varchar(50), Apellido varchar(50),TipoUsuario int);', []).then(() => console.log('Executed SQL')).catch(e => console.log(e));
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


  getUsuarios(){

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



  updateSong(id, song: any) {
    let data = [song.artist_name, song.song_name];
    return this.db.executeSql(`UPDATE songtable SET artist_name = ?, song_name = ? WHERE id = ${id}`, data)
    .then(data => {
      //this.getSongs();
    })
  }

  // Delete
  deleteSong(id) {
    return this.db.executeSql('DELETE FROM songtable WHERE id = ?', [id])
    .then(_ => {
      //this.getSongs();
    });
  }




}