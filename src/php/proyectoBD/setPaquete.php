
<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    require("conexion.php");
    $con=retornarConexion();

    $TRANSACTION = 'START TRANSACTION';
    $COMMIT = 'COMMIT';
    $ROLLBACK = 'ROLLBACK';

    $json = file_get_contents('php://input');
 
    $params = json_decode($json);
    

    mysqli_query($conexion, $TRANSACTION);
        
    $sql = "INSERT INTO paquete (Descripcion, Dirreccion, Latitud, Longitud, StatusPaquete, EmpleadoEntrega, sincronizado) VALUES ('$params->Descripcion', '$params->Dirreccion', $params->Latitud, $params->Longitud, $params->StatusPaquete,  '$params->EmpleadoEntrega', 1)";
    
    $estatus = mysqli_query($conexion, $sql);

    
    if(!$estatus)
    {
        mysqli_query($conexion, $ROLLBACK);
        echo "ERROR";
    }
    else
    {
        mysqli_query($conexion, $COMMIT);
        echo "OK";
    }
    
    mysqli_close($conexion);
    

    header('Content-Type: application/json');

?>