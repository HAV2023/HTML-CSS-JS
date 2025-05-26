// Obtener el elemento input de fecha de nacimiento por su id 'birthdate'
const birthdate = document.getElementById('birthdate');
// Establecer el atributo 'max' del input fecha para que no pueda seleccionar una fecha futura
// Esto usa la fecha actual en formato ISO (YYYY-MM-DD)
birthdate.max = new Date().toISOString().split('T')[0];

// Obtener el formulario completo por su id para control y validación
const form = document.getElementById('professionalForm');
// Obtener el contenedor del mensaje de éxito para mostrar/ocultar tras validar
const successMessage = document.getElementById('successMessage');

// Obtener referencias a los inputs del formulario para validar individualmente
const ageInput = document.getElementById('age');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const emailConfirmInput = document.getElementById('emailConfirm');
const passwordInput = document.getElementById('password');
const commentsInput = document.getElementById('comments');
// Contador dinámico que muestra caracteres escritos en comentarios
const commentsCounter = document.getElementById('commentsCounter');


// ------------- VALIDACIÓN Y BLOQUEO DE ENTRADA EN EDAD ---------------

// Escuchar antes de que un nuevo carácter sea insertado en Edad
ageInput.addEventListener('beforeinput', (e) => {
  // Si se intenta insertar algo que no es dígito (\D = no dígito), bloquear la acción
  if (e.data && /\D/.test(e.data)) e.preventDefault();
});

// Escuchar cada tecla presionada en Edad para permitir solo números y teclas de control
ageInput.addEventListener('keydown', (e) => {
  // Definir teclas que no son caracteres pero sí permitidas (borrar, flechas, tab, etc.)
  const allowedKeys = ["Backspace","Tab","ArrowLeft","ArrowRight","Delete","Home","End"];
  // Si la tecla presionada está permitida o es número del 0 al 9, permitir la entrada
  if (allowedKeys.includes(e.key) || (e.key >= '0' && e.key <= '9')) return;
  // Si no, prevenir la acción para no insertar caracteres inválidos
  e.preventDefault();
});

// Escuchar el evento input para limpiar cualquier carácter no numérico que haya podido entrar
ageInput.addEventListener('input', () => {
  // Reemplazar cualquier cosa que no sea dígito por cadena vacía (eliminar)
  ageInput.value = ageInput.value.replace(/\D/g, '');
});

// Bloquear pegar texto que contenga caracteres no numéricos en Edad
ageInput.addEventListener('paste', (e) => {
  // Obtener texto pegado del portapapeles
  const paste = (e.clipboardData || window.clipboardData).getData('text');
  // Si el texto pegado no es sólo dígitos, cancelar la acción
  if (!/^\d*$/.test(paste)) e.preventDefault();
});


// ----------- VALIDACIÓN Y BLOQUEO EN EL CAMPO NOMBRE --------------

// Bloquear la inserción de números en Nombre
nameInput.addEventListener('beforeinput', (e) => {
  // Si el nuevo carácter es un número, bloquear la acción
  if (e.data && /\d/.test(e.data)) e.preventDefault();
});

// Permitir sólo letras, espacios y teclas de control en Nombre
nameInput.addEventListener('keydown', (e) => {
  // Teclas permitidas (control + espacio)
  const allowedKeys = ["Backspace","Tab","ArrowLeft","ArrowRight","Delete","Home","End"," "];
  // Permitir letras (incluyendo acentos y ñ)
  if (allowedKeys.includes(e.key) || /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]$/.test(e.key)) return;
  // Bloquear cualquier otra tecla
  e.preventDefault();
});

// En caso de que accidentalmente se hayan ingresado números, eliminarlos en input
nameInput.addEventListener('input', () => {
  nameInput.value = nameInput.value.replace(/\d/g, '');
});


// --------- CONTADOR DINÁMICO DE CARACTERES EN COMENTARIOS ----------

// Actualizar el texto del contador cada vez que cambia el contenido de comentarios
commentsInput.addEventListener('input', () => {
  const length = commentsInput.value.length; // Obtener longitud actual
  commentsCounter.textContent = `${length} / 2000 caracteres`; // Mostrar contador actualizado
});


// ---------------- VALIDACIÓN GENERAL AL ENVIAR FORMULARIO ----------------

form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevenir el envío tradicional para validar primero

  successMessage.style.display = 'none'; // Ocultar mensaje éxito previo

  let valid = true; // Indicador global para estado de validación

  // VALIDAR NOMBRE
  const nameError = document.getElementById('error-name');
  // Verificar que no esté vacío y cumpla patrón solo letras y espacios
  if (!nameInput.value.trim() || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nameInput.value.trim())) {
    valid = false;
    nameError.style.display = 'block';        // Mostrar mensaje error
    nameInput.setAttribute('aria-invalid', 'true'); // Para accesibilidad
  } else {
    nameError.style.display = 'none';         // Ocultar mensaje error
    nameInput.removeAttribute('aria-invalid');
  }

  // VALIDAR EMAIL
  const emailError = document.getElementById('error-email');
  // Email debe estar lleno y ser válido según validación HTML5 del input
  if (!emailInput.value || !emailInput.checkValidity()) {
    valid = false;
    emailError.style.display = 'block';
    emailInput.setAttribute('aria-invalid', 'true');
  } else {
    emailError.style.display = 'none';
    emailInput.removeAttribute('aria-invalid');
  }

  // VALIDAR CONFIRMACIÓN EMAIL
  const emailConfirmError = document.getElementById('error-emailConfirm');
  // Debe estar lleno y coincidir exactamente con el email original
  if (!emailConfirmInput.value || emailConfirmInput.value !== emailInput.value) {
    valid = false;
    emailConfirmError.style.display = 'block';
    emailConfirmInput.setAttribute('aria-invalid', 'true');
  } else {
    emailConfirmError.style.display = 'none';
    emailConfirmInput.removeAttribute('aria-invalid');
  }

  // VALIDAR CONTRASEÑA
  const passwordError = document.getElementById('error-password');
  // Requerido y mínimo 8 caracteres
  if (!passwordInput.value || passwordInput.value.length < 8) {
    valid = false;
    passwordError.style.display = 'block';
    passwordInput.setAttribute('aria-invalid', 'true');
  } else {
    passwordError.style.display = 'none';
    passwordInput.removeAttribute('aria-invalid');
  }

  // VALIDAR EDAD
  const ageVal = Number(ageInput.value);
  const ageError = document.getElementById('error-age');
  // Debe ser número válido entre 1 y 120
  if (!ageInput.value || isNaN(ageVal) || ageVal < 1 || ageVal > 120) {
    valid = false;
    ageError.style.display = 'block';
    ageInput.setAttribute('aria-invalid', 'true');
  } else {
    ageError.style.display = 'none';
    ageInput.removeAttribute('aria-invalid');
  }

  // VALIDAR FECHA DE NACIMIENTO
  const birthInput = form.birthdate;
  const birthError = document.getElementById('error-birthdate');
  // No vacía y no fecha futura
  if (!birthInput.value || new Date(birthInput.value) > new Date()) {
    valid = false;
    birthError.style.display = 'block';
    birthInput.setAttribute('aria-invalid', 'true');
  } else {
    birthError.style.display = 'none';
    birthInput.removeAttribute('aria-invalid');
  }

  // VALIDAR COMENTARIOS
  const commentsError = document.getElementById('error-comments');
  // Si hay texto, validar patrón y longitud máxima
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

  // SI TODO ESTÁ BIEN
  if (valid) {
    successMessage.style.display = 'block'; // Mostrar mensaje éxito
    form.reset();                           // Limpiar formulario
    commentsCounter.textContent = '0 / 2000 caracteres'; // Reiniciar contador
  } else {
    successMessage.style.display = 'none'; // Ocultar mensaje éxito
  }
});

// Convertir a mayúsculas los inputs de tipo texto excepto comentarios
form.querySelectorAll('input[type="text"]').forEach(input => {
  if(input.id === 'comments') return; // Excluir campo comentarios
  input.addEventListener('input', () => {
    input.value = input.value.toUpperCase();
  });
});

// Al enfocar cualquier input o textarea, ocultar mensaje error y quitar atributo aria-invalid
form.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('focus', () => {
    const errorDiv = document.getElementById('error-' + input.id);
    if (errorDiv) errorDiv.style.display = 'none';
    input.removeAttribute('aria-invalid');
  });
});
