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
      
  $sql = "select paquete.Descripcion, paquete.Dirreccion, Latitud ,Longitud, StatusPaquete, EmpleadoEntrega from paquete inner join deletePaquete on paquete.Dirreccion = deletePaquete.Dirreccion and paquete.Descripcion = deletePaquete.Descripcion;";
  
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