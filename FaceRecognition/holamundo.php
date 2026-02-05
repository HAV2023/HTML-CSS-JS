<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo "Hola Mundo con PHP"; ?></title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f8ff;
            text-align: center;
            padding: 50px;
        }
        .contenedor {
            background-color: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            max-width: 600px;
            margin: 0 auto;
        }
        .saludo {
            color: #2c3e50;
            font-size: 2em;
            margin-bottom: 20px;
        }
        .info {
            color: #7f8c8d;
            font-size: 1.1em;
        }
    </style>
</head>
<body>
    <div class="contenedor">
        <h1 class="saludo"><?php echo "¡Hola Mundo!"; ?></h1>
        
        <p class="info">
            Esta página fue generada el: 
            <strong><?php echo date("d/m/Y H:i:s"); ?></strong>
        </p>
        
        <p class="info">
            Servidor: <strong><?php echo $_SERVER['SERVER_NAME']; ?></strong>
        </p>
        
        <?php
            $visitante = "Amigo visitante";
            $hora = date("H");
            
            if ($hora < 12) {
                $saludo_tiempo = "Buenos días";
            } elseif ($hora < 18) {
                $saludo_tiempo = "Buenas tardes";
            } else {
                $saludo_tiempo = "Buenas noches";
            }
        ?>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #ecf0f1; border-radius: 5px;">
            <h2><?php echo $saludo_tiempo . ", " . $visitante; ?>!</h2>
            <p>Son las <?php echo date("H:i"); ?> horas</p>
        </div>
        
        <footer style="margin-top: 30px; font-size: 0.9em; color: #95a5a6;">
            <p>Creado con PHP <?php echo phpversion(); ?> ❤️</p>
        </footer>
    </div>
</body>
</html>