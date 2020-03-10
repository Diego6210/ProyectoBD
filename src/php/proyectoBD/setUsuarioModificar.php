
<?php
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    require("conexion.php");
    $con=retornarConexion();

    $json = file_get_contents('php://input');

    $params = json_decode($json);

    $sql = 'select * from usuario where IdUsuario = "'.$params->IdUsuario.'";';  

    $registros=mysqli_query($con,$sql);

    $vec=[];
    while ($reg=mysqli_fetch_array($registros))
    {
        $vec[]=$reg;
    }

    echo json_encode($vec);

    header('Content-Type: application/json');

?>