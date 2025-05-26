// script.js
// Documentación granular de la lógica JavaScript para el Formulario Profesional

document.addEventListener('DOMContentLoaded', () => {
  // --- Referencias a elementos del DOM ---
  const form            = document.getElementById('professionalForm');      // Formulario principal
  const success         = document.getElementById('successMessage');       // Contenedor de mensaje de éxito

  const nameIn          = document.getElementById('name');                 // Input de nombre
  const emailIn         = document.getElementById('email');                // Input de correo
  const emailC          = document.getElementById('emailConfirm');         // Input de confirmación de correo
  const passIn          = document.getElementById('password');             // Input de contraseña
  const passC           = document.getElementById('passwordConfirm');      // Input de confirmación de contraseña
  const ageIn           = document.getElementById('age');                  // Input de edad
  const birthIn         = document.getElementById('birthdate');            // Input de fecha de nacimiento
  const commIn          = document.getElementById('comments');             // Textarea de comentarios
  const commCnt         = document.getElementById('commentsCounter');      // Contador de comentarios

  const togP            = document.getElementById('togglePassword');       // Botón para toggle password
  const togPC           = document.getElementById('togglePasswordConfirm');// Botón para toggle passwordConfirm

  // --- Ajuste dinámico de la fecha máxima de nacimiento ---
  // Evita seleccionar una fecha futura estableciendo 'max' al día de hoy
  if (birthIn) birthIn.max = new Date().toISOString().split('T')[0];

  // --- Conversión a mayúsculas sólo en inputs de tipo texto ---
  form.querySelectorAll('input[type="text"]').forEach(inp => {
    // Al modificar el valor, lo convertimos a mayúsculas
    inp.addEventListener('input', () => { inp.value = inp.value.toUpperCase(); });
  });

  // --- Contador de caracteres en el textarea de comentarios ---
  if (commIn && commCnt) {
    commIn.addEventListener('input', () => {
      // Muestra "número de caracteres / 2000"
      commCnt.textContent = `${commIn.value.length} / 2000 caracteres`;
    });
  }

  // --- Función de mostrar/ocultar contraseña ---
  // Alterna el atributo 'type' y el icono del botón
  function toggleVisibility(inputField, button) {
    if (inputField.type === 'password') {
      inputField.type = 'text';   // Mostrar texto
      button.textContent = '🙈';   // Cambiar icono a cara tapándose los ojos
    } else {
      inputField.type = 'password';
      button.textContent = '👁️';   // Icono de ojito
    }
  }
  // Asociar toggle con cada botón correspondiente
  togP.addEventListener('click', () => toggleVisibility(passIn, togP));
  togPC.addEventListener('click', () => toggleVisibility(passC, togPC));

  // --- Validación de sólo números en edad ---
  if (ageIn) {
    ageIn.addEventListener('input', () => {
      // Elimina caracteres no numéricos
      ageIn.value = ageIn.value.replace(/\D/g, '');
    });
  }

  // --- Validación de formulario y envío ---
  form.addEventListener('submit', e => {
    e.preventDefault(); // Evita envío nativo
    let valid = true;    // Bandera de estado general

    // Funciones auxiliares para mostrar u ocultar errores
    const showErr = (id, msg) => {
      const el = document.getElementById(id);
      el.textContent = msg;
      el.style.display = 'block';
    };
    const hideErr = id => {
      const el = document.getElementById(id);
      el.style.display = 'none';
      el.textContent = '';
    };

    // -- Validar nombre: sólo letras y espacios en mayúsculas --
    if (!/^[A-ZÁÉÍÓÚÑ\s]+$/.test(nameIn.value.trim())) {
      valid = false;
      showErr('error-name', 'Sólo letras y espacios.');
      nameIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-name');
      nameIn.removeAttribute('aria-invalid');
    }

    // -- Validar correo electrónico con validación HTML5 --
    if (!emailIn.value || !emailIn.checkValidity()) {
      valid = false;
      showErr('error-email', 'Correo inválido.');
      emailIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-email');
      emailIn.removeAttribute('aria-invalid');
    }

    // -- Validar confirmación de correo --
    if (emailC.value !== emailIn.value) {
      valid = false;
      showErr('error-emailConfirm', 'Los correos no coinciden.');
      emailC.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-emailConfirm');
      emailC.removeAttribute('aria-invalid');
    }

    // -- Validar contraseña: al menos 8 caracteres, mayúsculas y minúsculas --
    const passOK = passIn.value.length >= 8 && /[a-z]/.test(passIn.value) && /[A-Z]/.test(passIn.value);
    if (!passOK) {
      valid = false;
      showErr('error-password', 'Mín. 8 caracteres, mayúsculas y minúsculas.');
      passIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-password');
      passIn.removeAttribute('aria-invalid');
    }

    // -- Validar confirmación de contraseña --
    if (passC.value !== passIn.value) {
      valid = false;
      showErr('error-passwordConfirm', 'Las contraseñas no coinciden.');
      passC.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-passwordConfirm');
      passC.removeAttribute('aria-invalid');
    }

    // -- Validar edad: número entre 1 y 120 --
    const ageVal = Number(ageIn.value);
    if (!ageVal || ageVal < 1 || ageVal > 120) {
      valid = false;
      showErr('error-age', 'Edad entre 1 y 120.');
      ageIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-age');
      ageIn.removeAttribute('aria-invalid');
    }

    // -- Validar fecha de nacimiento: no futura --
    if (!birthIn.value || new Date(birthIn.value) > new Date()) {
      valid = false;
      showErr('error-birthdate', 'Fecha inválida.');
      birthIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-birthdate');
      birthIn.removeAttribute('aria-invalid');
    }

    // -- Validar comentarios: hasta 2000 caracteres --
    if (commIn.value.length > 2000) {
      valid = false;
      showErr('error-comments', 'Máx. 2000 caracteres.');
      commIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-comments');
      commIn.removeAttribute('aria-invalid');
    }

    // Mostrar mensaje de éxito si todo es válido
    if (valid) {
      success.style.display = 'block';
      form.reset();
      if (commCnt) commCnt.textContent = '0 / 2000 caracteres';
    } else {
      success.style.display = 'none';
    }
  });
});
