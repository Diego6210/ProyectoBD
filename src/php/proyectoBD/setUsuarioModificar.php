
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

    $sql = "UPDATE usuario SET Nombre = '$params->Nombre', Apellido = '$params->Apellido', Usuario = '$params->Usuario', Password = '$params->Password', TipoUsuario = $params->TipoUsuario WHERE Usuario = '$params->Usuario'";
    
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
        $sql = "INSERT INTO modificarUsuario( Usuario,sincronizado) VALUES ('$params->Usuario', 1)";
        mysqli_query($conexion, $sql);
    }
    
    mysqli_close($conexion);
    

    header('Content-Type: application/json');

?>