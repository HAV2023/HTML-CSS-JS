// Ajustar máximo para fecha de nacimiento (hoy)
const birthdate = document.getElementById('birthdate');
// Obtiene el elemento input de fecha de nacimiento por su id "birthdate"

birthdate.max = new Date().toISOString().split('T')[0];
// Establece la fecha máxima permitida en el campo como la fecha actual en formato YYYY-MM-DD,
// usando ISO string y dividiendo para obtener solo la parte de fecha sin hora

const form = document.getElementById('professionalForm');
// Obtiene el formulario completo por su id "professionalForm"

const successMessage = document.getElementById('successMessage');
// Obtiene el elemento que muestra el mensaje de éxito tras enviar el formulario

const ageInput = document.getElementById('age');
// Obtiene el input del campo edad por su id "age"

// Bloquear entrada no numérica antes de que se inserte (teclas, mantenimiento, autocompletar)
ageInput.addEventListener('beforeinput', (e) => {
  if (e.data && /\D/.test(e.data)) {
    e.preventDefault();
  }
});
// Evento "beforeinput": intercepta la entrada antes de insertarla en el campo
// Si el texto a insertar contiene cualquier carácter no dígito (\D), cancela la inserción
// Esto bloquea que se pueda escribir letras o caracteres no numéricos

// Bloquear teclas no numéricas en keydown (controles permitidos)
ageInput.addEventListener('keydown', (e) => {
  const allowedKeys = [
    "Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", "Home", "End"
  ];
  if (
    allowedKeys.includes(e.key) ||
    (e.key >= '0' && e.key <= '9')
  ) {
    return;
  }
  e.preventDefault();
});
// Evento "keydown": antes de que la tecla afecte el input
// Permite teclas de control (borrar, navegación, tabulador) y números 0-9
// Bloquea cualquier otra tecla, como letras o símbolos

// Limpiar cualquier carácter no numérico en input (por si acaso)
ageInput.addEventListener('input', () => {
  ageInput.value = ageInput.value.replace(/\D/g, '');
});
// Evento "input": después de que el valor cambia
// Reemplaza el contenido del campo eliminando cualquier carácter no dígito (\D)
// Esto corrige posibles entradas inválidas no bloqueadas antes, como pegar texto

// Bloquear pegar texto no numérico
ageInput.addEventListener('paste', (e) => {
  const paste = (e.clipboardData || window.clipboardData).getData('text');
  if (!/^\d*$/.test(paste)) {
    e.preventDefault();
  }
});
// Evento "paste": al intentar pegar texto
// Obtiene el texto pegado y verifica que contenga solo dígitos (regex /^\d*$/)
// Si contiene otro carácter, cancela el pegado

// Evento submit para validar todos los campos del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();
  // Previene el envío automático del formulario

  successMessage.style.display = 'none';
  // Oculta el mensaje de éxito antes de validar

  let valid = true;
  // Variable para controlar si el formulario es válido

  // Validar Nombre (solo letras y espacios)
  const nameInput = form.name;
  const nameError = document.getElementById('error-name');
  if (!nameInput.value.trim() || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nameInput.value.trim())) {
    valid = false;
    nameError.style.display = 'block';
    nameInput.setAttribute('aria-invalid', 'true');
  } else {
    nameError.style.display = 'none';
    nameInput.removeAttribute('aria-invalid');
  }
  // Verifica que el nombre no esté vacío y cumpla la expresión regular que permite solo letras, acentos y espacios
  // Muestra mensaje de error si no cumple, y marca el campo con atributo aria-invalid para accesibilidad

  // Validar Edad (1-120)
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
  // Valida que edad sea un número entre 1 y 120, no vacío ni NaN
  // Muestra error si no es válido

  // Validar Fecha de nacimiento (no futura y no vacía)
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
  // Verifica que la fecha no esté vacía ni sea mayor a la fecha actual
  // Muestra mensaje de error si no cumple

  // Validar Comentarios (opcional, pero si hay texto, validar patrón)
  const commentsInput = form.comments;
  const commentsError = document.getElementById('error-comments');
  if (commentsInput.value.trim() && !/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,!?-]*$/.test(commentsInput.value.trim())) {
    valid = false;
    commentsError.style.display = 'block';
    commentsInput.setAttribute('aria-invalid', 'true');
  } else {
    commentsError.style.display = 'none';
    commentsInput.removeAttribute('aria-invalid');
  }
  // Si el campo comentarios tiene texto, valida que solo contenga letras, números, espacios y signos básicos
  // Muestra mensaje de error si el patrón no coincide

  if (valid) {
    successMessage.style.display = 'block';
    form.reset();
  } else {
    successMessage.style.display = 'none';
  }
  // Si todos los campos son válidos, muestra mensaje de éxito y resetea el formulario
  // Si no, oculta el mensaje de éxito para que el usuario corrija errores
});

// Convertir a mayúsculas el texto mientras escriben (input text)
form.querySelectorAll('input[type="text"]').forEach(input => {
  input.addEventListener('input', () => {
    input.value = input.value.toUpperCase();
  });
});
// Recorre todos los inputs de tipo texto y convierte su valor a mayúsculas en tiempo real mientras el usuario escribe

// Al hacer focus, ocultar error correspondiente
form.querySelectorAll('input').forEach(input => {
  input.addEventListener('focus', () => {
    const errorDiv = document.getElementById('error-' + input.id);
    if (errorDiv) {
      errorDiv.style.display = 'none';
    }
    input.removeAttribute('aria-invalid');
  });
});
// Para cada input, al recibir foco oculta el mensaje de error correspondiente y quita la marca aria-invalid para accesibilidad
