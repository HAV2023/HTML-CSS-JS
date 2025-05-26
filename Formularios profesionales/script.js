/**
 * script.js — Validación avanzada de formulario profesional
 * 
 * Autor: Hector Arciniega
 * Proyecto: Formulario de Registro Profesional
 * Descripción:
 *   Este script implementa validaciones, restricciones y mejoras de experiencia
 *   de usuario en un formulario profesional hecho en HTML5 + CSS3.
 *   - Convierte a mayúsculas los campos de texto.
 *   - Impide números en el campo "Nombre" (ni al escribir, ni al pegar).
 *   - Restringe la edad a valores numéricos y rango válido.
 *   - Valida contraseñas, correos, fechas y comentarios.
 *   - Incluye contador de caracteres, toggles de visibilidad de contraseñas
 *   - Muestra mensajes de error y éxito según los criterios definidos.
 * 
 * Fecha última actualización: 26/05/2025
 */

document.addEventListener('DOMContentLoaded', () => {

  // ===================
  // Referencias a elementos del formulario y sus campos
  // ===================
  const form    = document.getElementById('professionalForm');
  const success = document.getElementById('successMessage');

  const nameIn  = document.getElementById('name');
  const emailIn = document.getElementById('email');
  const emailC  = document.getElementById('emailConfirm');
  const passIn  = document.getElementById('password');
  const passC   = document.getElementById('passwordConfirm');
  const ageIn   = document.getElementById('age');
  const birthIn = document.getElementById('birthdate');
  const commIn  = document.getElementById('comments');
  const commCnt = document.getElementById('commentsCounter');

  const togP    = document.getElementById('togglePassword');
  const togPC   = document.getElementById('togglePasswordConfirm');

  // ===================
  // Lógica de interfaz y restricciones
  // ===================

  // --- Fecha de nacimiento: Establecer como máximo la fecha actual ---
  if (birthIn) birthIn.max = new Date().toISOString().split('T')[0];

  // --- Inputs de texto: convertir automáticamente a mayúsculas mientras se escribe ---
  form.querySelectorAll('input[type="text"]').forEach(inp => {
    inp.addEventListener('input', () => { inp.value = inp.value.toUpperCase(); });
  });

  // --- Contador de caracteres en el textarea de comentarios ---
  if (commIn && commCnt) {
    commIn.addEventListener('input', () => {
      commCnt.textContent = `${commIn.value.length} / 2000 caracteres`;
    });
  }

  // --- Botones de mostrar/ocultar contraseña (cambia el tipo del input) ---
  function toggleVisibility(inputField, button) {
    if (inputField.type === 'password') {
      inputField.type = 'text';
      button.textContent = '🙈'; // Cambia el ícono al mostrar la contraseña
    } else {
      inputField.type = 'password';
      button.textContent = '👁️'; // Cambia el ícono al ocultar la contraseña
    }
  }
  togP.addEventListener('click', () => toggleVisibility(passIn, togP));
  togPC.addEventListener('click', () => toggleVisibility(passC, togPC));

  // --- Restringe el campo de Edad para aceptar solo números ---
  if (ageIn) {
    ageIn.addEventListener('input', () => {
      ageIn.value = ageIn.value.replace(/\D/g, ''); // Elimina todo lo que no sea dígito
    });
  }

  // --- Restringe el campo Nombre para NO permitir números ni al escribir ni al pegar ---
  if (nameIn) {
    // Al escribir, elimina cualquier número
    nameIn.addEventListener('input', () => {
      nameIn.value = nameIn.value.replace(/[0-9]/g, '');
    });

    // Al pegar, elimina los números del texto pegado
    nameIn.addEventListener('paste', (e) => {
      const pasted = e.clipboardData.getData('text');
      if (/\d/.test(pasted)) {
        e.preventDefault();
        nameIn.value += pasted.replace(/[0-9]/g, '');
      }
    });
  }

  // ===================
  // Validación y envío del formulario
  // ===================
  form.addEventListener('submit', e => {
    e.preventDefault(); // Previene el envío por defecto
    let valid = true;   // Bandera de validez

    // Funciones auxiliares para mostrar u ocultar mensajes de error
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

    // --- Validación de campos ---

    // Validar Nombre: Solo letras mayúsculas (incluye acentos y Ñ), sin números
    if (!/^[A-ZÁÉÍÓÚÑ\s]+$/.test(nameIn.value.trim())) {
      valid = false;
      showErr('error-name', 'Sólo letras y espacios.');
      nameIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-name');
      nameIn.removeAttribute('aria-invalid');
    }

    // Validar correo electrónico (formato correcto)
    if (!emailIn.value || !emailIn.checkValidity()) {
      valid = false;
      showErr('error-email', 'Correo inválido.');
      emailIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-email');
      emailIn.removeAttribute('aria-invalid');
    }

    // Validar confirmación de correo (debe coincidir)
    if (emailC.value !== emailIn.value) {
      valid = false;
      showErr('error-emailConfirm', 'Los correos no coinciden.');
      emailC.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-emailConfirm');
      emailC.removeAttribute('aria-invalid');
    }

    // Validar contraseña: mínimo 8 caracteres, al menos una mayúscula y una minúscula
    const passOK =
      passIn.value.length >= 8 &&
      /[a-z]/.test(passIn.value) &&
      /[A-Z]/.test(passIn.value);
    if (!passOK) {
      valid = false;
      showErr('error-password', 'Mín. 8 caracteres, mayúsculas y minúsculas.');
      passIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-password');
      passIn.removeAttribute('aria-invalid');
    }

    // Validar confirmación de contraseña (debe coincidir)
    if (passC.value !== passIn.value) {
      valid = false;
      showErr('error-passwordConfirm', 'Las contraseñas no coinciden.');
      passC.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-passwordConfirm');
      passC.removeAttribute('aria-invalid');
    }

    // Validar Edad: Debe ser un número entre 1 y 120
    const ageVal = Number(ageIn.value);
    if (!ageVal || ageVal < 1 || ageVal > 120) {
      valid = false;
      showErr('error-age', 'Edad entre 1 y 120.');
      ageIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-age');
      ageIn.removeAttribute('aria-invalid');
    }

    // Validar fecha de nacimiento: No puede ser futura ni estar vacía
    if (!birthIn.value || new Date(birthIn.value) > new Date()) {
      valid = false;
      showErr('error-birthdate', 'Fecha inválida.');
      birthIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-birthdate');
      birthIn.removeAttribute('aria-invalid');
    }

    // Validar comentarios: máximo 2000 caracteres
    if (commIn.value.length > 2000) {
      valid = false;
      showErr('error-comments', 'Máx. 2000 caracteres.');
      commIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-comments');
      commIn.removeAttribute('aria-invalid');
    }

    // --- Resultado final: mostrar mensaje de éxito o dejar errores visibles ---
    if (valid) {
      success.style.display = 'block';   // Muestra mensaje de éxito
      form.reset();                      // Limpia formulario
      if (commCnt) commCnt.textContent = '0 / 2000 caracteres'; // Reinicia contador
    } else {
      success.style.display = 'none';    // Oculta mensaje de éxito si hay errores
    }
  });
});
