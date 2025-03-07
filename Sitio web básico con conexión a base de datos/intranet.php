<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("Location: login.html");
    exit;
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zona Restringida - Intranet</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <nav class="menu">
        <ul class="menu-links">
            <li><a href="../intranet/index.html">Inicio</a></li>
            <li><a href="../intranet/logout.php">Cerrar Sesión</a></li>
        </ul>
    </nav>

    <div class="container">
        <h2>Bienvenido a la Intranet</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ac lacus at risus feugiat fermentum.
        Sed sit amet dolor sed elit feugiat interdum nec nec arcu.</p>
    </div>
</body>
</html>