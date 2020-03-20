
create table usuario (
Usuario varchar(20) primary key, 
Password varchar(20), 
Nombre varchar(50), 
Apellido varchar(50),
TipoUsuario int,
sincronizado int
);

create table paquete (
IdPaquete int auto_increment PRIMARY KEY,
Descripcion varchar(50) UNIQUE, 
Dirreccion varchar(50) UNIQUE,
Latitud double, 
Longitud double, 
StatusPaquete integer, 
EmpleadoEntrega varchar(20),
sincronizado int,
FOREIGN KEY (EmpleadoEntrega) REFERENCES usuario(Usuario)
);

create table deleteUsuario (
Usuario varchar(20) PRIMARY KEY,
sincronizado integer
);

create table deletePaquete (
Descripcion varchar(50) UNIQUE, 
Dirreccion varchar(50) UNIQUE,
sincronizado integer
);

create table modificarUsuario (
Usuario varchar(20) PRIMARY KEY,
sincronizado integer
);

create table modificarPaquete (
Descripcion varchar(50) UNIQUE, 
Dirreccion varchar(50) UNIQUE,
sincronizado integer
);

insert into usuario(Nombre, Usuario, Password, TipoUsuario, sincronizado) values("Administrador", "Administrador", "admin",2,1);
insert into usuario(Usuario, Nombre, Password, TipoUsuario, sincronizado) values("prueba", "prueba", "prueba",2,1);


select * from paquete;
select * from deletePaquete; 
select * from modificarPaquete; 
select * from usuario;
select * from deleteUsuario;
select * from modificarUsuario;

TRUNCATE TABLE usuario;



drop table paquete;
drop table usuario; 
drop table deleteUsuario;
drop table deletePaquete; 
drop table modificarUsuario;
drop table modificarPaquete; 
