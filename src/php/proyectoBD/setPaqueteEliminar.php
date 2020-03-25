
<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    require("conexion.php");
    $conexion=retornarConexion();
    $TRANSACTION = "SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED";
    $BEGIN = "BEGIN";
    $COMMIT = "COMMIT";
    $ROLLBACK = "ROLLBACK";

    $json = file_get_contents('php://input');
 
    $params = json_decode($json);
    

    mysqli_query($conexion, $TRANSACTION);

    mysqli_query($conexion, $BEGIN);

    $sql = "DELETE FROM  paquete WHERE Descripcion = '$params->Descripcion' and Dirreccion = '$params->Descripcion'";
    
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
        $sql = "INSERT INTO deletePaquete(Descripcion, Dirreccion, sincronizado) VALUES ('$params->Descripcion', '$params->Dirreccion', 1)";
        mysqli_query($conexion, $sql);
    }
    
    mysqli_close($conexion);
    

    header('Content-Type: application/json');

?>