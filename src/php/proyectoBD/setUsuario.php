
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

    $sql = "INSERT INTO usuario(Nombre, Apellido, Usuario, Password, TipoUsuario, sincronizado) VALUES ('$params->Nombre', '$params->Apellido', '$params->Usuario', '$params->Password', $params->TipoUsuario, 1)";
    
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