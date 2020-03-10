<?php
function retornarConexion() {
  $con=mysqli_connect("localhost","diego","","proyectoBD");
  return $con;
}
?>