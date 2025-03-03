// scripts.js

// ======= Simulación de base de datos de usuarios =======
const users = [
    { username: 'admin', password: 'password123' }, // Usuario administrador
    { username: 'user', password: 'userpass' } // Usuario normal
];

// ======= Manejo de inicio de sesión =======

// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {
    // Verifica si el formulario de inicio de sesión está presente en la página
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Evita que el formulario se envíe automáticamente

            // Obtiene los valores ingresados por el usuario
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Busca un usuario que coincida con las credenciales ingresadas
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                // Si las credenciales son correctas, se guarda la sesión del usuario
                sessionStorage.setItem('loggedIn', 'true');

                // Redirige al usuario a la página restringida
                window.location.href = 'restricted.html';
            } else {
                // Si las credenciales son incorrectas, muestra un mensaje de error
                document.getElementById('loginError').innerText = 'Usuario o contraseña incorrectos';
            }
        });
    }

    // ======= Verificación de sesión en páginas restringidas =======
    if (window.location.pathname.includes('restricted.html')) {
        // Si no hay sesión iniciada, redirige al usuario a la página de inicio de sesión
        if (!sessionStorage.getItem('loggedIn')) {
            window.location.href = 'login.html';
        }
    }

    // ======= Manejo de cierre de sesión =======
    const logoutButton = document.getElementById('logout');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            // Elimina la sesión del usuario
            sessionStorage.removeItem('loggedIn');

            // Redirige al usuario a la página de inicio de sesión
            window.location.href = 'login.html';
        });
    }
});

