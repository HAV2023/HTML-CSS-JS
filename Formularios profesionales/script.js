// Obtener referencia al campo de fecha de nacimiento
const birthdate = document.getElementById('birthdate');
// Establecer el valor máximo permitido para la fecha (no puede ser mayor que hoy)
birthdate.max = new Date().toISOString().split('T')[0];

const form = document.getElementById('professionalForm');      // Referencia al formulario completo
const successMessage = document.getElementById('successMessage'); // Mensaje de éxito tras envío

// Referencias a campos individuales para validar y controlar
const ageInput = document.getElementById('age');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const emailConfirmInput = document.getElementById('emailConfirm');
const passwordInput = document.getElementById('password');
const commentsInput = document.getElementById('comments');
const commentsCounter = document.getElementById('commentsCounter');

// -------------- BLOQUEO Y LIMPIEZA DE ENTRADAS -------------------

// Evita que en Edad se inserten caracteres no numéricos antes de que ocurran (teclado, autocompletar, etc.)
ageInput.addEventListener('beforeinput', (e) => {
  if (e.data && /\D/.test(e.data)) e.preventDefault(); // Bloquear cualquier cosa que no sea dígito
});

// Permite solo teclas numéricas y teclas de control para el campo Edad
ageInput.addEventListener('keydown', (e) => {
  // Lista de teclas permitidas (borrar, flechas, tab, etc.)
  const allowedKeys = ["Backspace","Tab","ArrowLeft","ArrowRight","Delete","Home","End"];
  // Si la tecla está en permitidas o es un número entre 0 y 9, permitir
  if (allowedKeys.includes(e.key) || (e.key >= '0' && e.key <= '9')) return;
  // Bloquear cualquier otra tecla
  e.preventDefault();
});

// Por si acaso, eliminar cualquier carácter no numérico tras la inserción
ageInput.addEventListener('input', () => {
  ageInput.value = ageInput.value.replace(/\D/g, '');
});

// Evitar pegar texto no numérico en Edad
ageInput.addEventListener('paste', (e) => {
  const paste = (e.clipboardData || window.clipboardData).getData('text');
  if (!/^\d*$/.test(paste)) e.preventDefault();
});

// Bloquear números en el campo Nombre (antes de que se inserten)
nameInput.addEventListener('beforeinput', (e) => {
  if (e.data && /\d/.test(e.data)) e.preventDefault();
});

// Permitir solo letras, espacios y teclas de control en Nombre
nameInput.addEventListener('keydown', (e) => {
  const allowedKeys = ["Backspace","Tab","ArrowLeft","ArrowRight","Delete","Home","End"," "];
  if (allowedKeys.includes(e.key) || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]$/.test(e.key)) return;
  e.preventDefault();
});

// Eliminar números accidentalmente ingresados en Nombre
nameInput.addEventListener('input', () => {
  nameInput.value = nameInput.value.replace(/\d/g, '');
});

// Actualizar contador de caracteres escritos en comentarios en tiempo real
commentsInput.addEventListener('input', () => {
  const length = commentsInput.value.length;
  commentsCounter.textContent = `${length} / 2000 caracteres`;
});

// ------------------ VALIDACIÓN AL ENVIAR ---------------------------

form.addEventListener('submit', (e) => {
  e.preventDefault();            // Evitar que el formulario se envíe automáticamente
  successMessage.style.display = 'none'; // Ocultar mensaje éxito si estaba visible

  let valid = true;              // Indicador general de validez

  // Validar Nombre: requerido, solo letras y espacios
  const nameError = document.getElementById('error-name');
  if (!nameInput.value.trim() || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nameInput.value.trim())) {
    valid = false;               // Invalidar formulario
    nameError.style.display = 'block';  // Mostrar mensaje error
    nameInput.setAttribute('aria-invalid', 'true'); // Atributo accesibilidad error
  } else {
    nameError.style.display = 'none';    // Ocultar mensaje error
    nameInput.removeAttribute('aria-invalid');
  }

  // Validar Email: requerido, formato válido según navegador
  const emailError = document.getElementById('error-email');
  if (!emailInput.value || !emailInput.checkValidity()) {
    valid = false;
    emailError.style.display = 'block';
    emailInput.setAttribute('aria-invalid', 'true');
  } else {
    emailError.style.display = 'none';
    emailInput.removeAttribute('aria-invalid');
  }

  // Validar Confirmación de Email: requerido y debe coincidir con Email
  const emailConfirmError = document.getElementById('error-emailConfirm');
  if (!emailConfirmInput.value || emailConfirmInput.value !== emailInput.value) {
    valid = false;
    emailConfirmError.style.display = 'block';
    emailConfirmInput.setAttribute('aria-invalid', 'true');
  } else {
    emailConfirmError.style.display = 'none';
    emailConfirmInput.removeAttribute('aria-invalid');
  }

  // Validar Contraseña: requerida, mínimo 8 caracteres
  const passwordError = document.getElementById('error-password');
  if (!passwordInput.value || passwordInput.value.length < 8) {
    valid = false;
    passwordError.style.display = 'block';
    passwordInput.setAttribute('aria-invalid', 'true');
  } else {
    passwordError.style.display = 'none';
    passwordInput.removeAttribute('aria-invalid');
  }

  // Validar Edad: requerida, número entre 1 y 120
  const ageVal = Number(ageInput.value);
  const ageError = document.getElementById('error-age');
  if (!ageInput.value || isNaN(ageVal) || ageVal < 1 || ageVal > 120) {
    valid = false;
    ageError.style.display = 'block';
    ageInput.setAttribute('aria-invalid', 'true');
  } else {
    ageError.style.display = 'none';
    ageInput.removeAttribute('aria-invalid');
  }

  // Validar Fecha de nacimiento: requerida, no puede ser fecha futura
  const birthInput = form.birthdate;
  const birthError = document.getElementById('error-birthdate');
  if (!birthInput.value || new Date(birthInput.value) > new Date()) {
    valid = false;
    birthError.style.display = 'block';
    birthInput.setAttribute('aria-invalid', 'true');
  } else {
    birthError.style.display = 'none';
    birthInput.removeAttribute('aria-invalid');
  }

  // Validar Comentarios: opcional, máximo 2000 caracteres, patrón permitido
  const commentsError = document.getElementById('error-comments');
  if (commentsInput.value.length > 2000) {
    valid = false;
    commentsError.textContent = 'El comentario no puede superar los 2000 caracteres.';
    commentsError.style.display = 'block';
    commentsInput.setAttribute('aria-invalid', 'true');
  } else if (commentsInput.value.trim() && !/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,!?-]*$/.test(commentsInput.value.trim())) {
    valid = false;
    commentsError.textContent = 'Sólo se permiten letras, números y signos básicos.';
    commentsError.style.display = 'block';
    commentsInput.setAttribute('aria-invalid', 'true');
  } else {
    commentsError.style.display = 'none';
    commentsInput.removeAttribute('aria-invalid');
  }

  // Si todo es válido mostrar mensaje éxito y resetear formulario y contador
  if (valid) {
    successMessage.style.display = 'block';
    form.reset();
    commentsCounter.textContent = '0 / 2000 caracteres'; // Reiniciar contador de comentarios
  } else {
    // Ocultar mensaje éxito si hubo error
    successMessage.style.display = 'none';
  }
});

// Convertir automáticamente a mayúsculas los inputs tipo texto excepto el textarea de comentarios
form.querySelectorAll('input[type="text"]').forEach(input => {
  if(input.id === 'comments') return; // Excluir campo comentarios
  input.addEventListener('input', () => {
    input.value = input.value.toUpperCase();
  });
});

// Al enfocar cualquier input o textarea, ocultar el mensaje de error correspondiente y quitar atributo aria-invalid
form.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('focus', () => {
    const errorDiv = document.getElementById('error-' + input.id);
    if (errorDiv) errorDiv.style.display = 'none';
    input.removeAttribute('aria-invalid');
  });
});
