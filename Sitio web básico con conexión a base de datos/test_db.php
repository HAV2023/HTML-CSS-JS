<?php
require 'config.php';

try {
    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    $count = $stmt->fetchColumn();
    echo "✅ Conexión exitosa. Usuarios en la base de datos: " . $count;
} catch (PDOException $e) {
    echo "❌ Error de conexión: " . $e->getMessage();
}
?>
