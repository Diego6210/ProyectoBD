<?php 
  header('Access-Control-Allow-Origin: *'); 
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  
  require("conexion.php");
  $conexion=retornarConexion();
  $TRANSACTION = "SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED";
  $BEGIN = "BEGIN";
  $COMMIT = "COMMIT";
  $ROLLBACK = "ROLLBACK";

  mysqli_query($conexion, $TRANSACTION);

  mysqli_query($conexion, $BEGIN);
      
  $sql = "select usuario.Usuario, Password, Nombre, Apellido, TipoUsuario from usuario inner join deleteUsuario on usuario.Usuario = deleteUsuario.Usuario;";
  
  $estatus = mysqli_query($conexion, $sql);
  
  if(!$estatus)
  {
    mysqli_query($conexion, $ROLLBACK);
    echo "ERROR";
  }
  else
  {
    mysqli_query($conexion, $COMMIT);
    $vec=[];  
    while ($reg=mysqli_fetch_array($estatus))  
    {
      $vec[]=$reg;
    }
    
    $cad=json_encode($vec);
    echo $cad;
  }
  
  mysqli_close($conexion);
  header('Content-Type: application/json');