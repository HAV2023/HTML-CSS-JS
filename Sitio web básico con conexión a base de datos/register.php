<?php
require 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST['username']);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);

    try {
        // Verificar si el usuario ya existe
        $sql = "SELECT id FROM users WHERE username = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$username]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo "<script>alert('⚠️ El nombre de usuario ya está en uso. Prueba con otro.'); window.location.href='register.html';</script>";
            exit;
        }

        // Insertar nuevo usuario si no existe
        $sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        $stmt = $pdo->prepare($sql);

        if ($stmt->execute([$username, $password])) {
            header("Location: success_register.html");
            exit;
        } else {
            echo "<script>alert('❌ Error al registrar usuario. Intenta de nuevo.'); window.location.href='register.html';</script>";
        }
    } catch (PDOException $e) {
        echo "<script>alert('❌ Error de base de datos: " . $e->getMessage() . "'); window.location.href='register.html';</script>";
    }
}
?>
