// Ajustar máximo para fecha de nacimiento (hoy)
const birthdate = document.getElementById('birthdate');
birthdate.max = new Date().toISOString().split('T')[0];

const form = document.getElementById('professionalForm');
const successMessage = document.getElementById('successMessage');

// Restringir solo números en campo Edad
const ageInput = document.getElementById('age');

ageInput.addEventListener('keydown', (e) => {
  // Permitir: backspace, tab, flechas, delete y números (fila superior y numpad)
  const allowedKeys = [
    "Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete", 
    "Home", "End"
  ];
  if (
    allowedKeys.includes(e.key) ||
    (e.key >= '0' && e.key <= '9') ||
    (e.key >= 'Numpad0' && e.key <= 'Numpad9')
  ) {
    return; // Permitir tecla
  }
  e.preventDefault(); // Bloquear otras teclas
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  successMessage.style.display = 'none';

  let valid = true;

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

  if (valid) {
    successMessage.style.display = 'block';
    form.reset();
  } else {
    successMessage.style.display = 'none';
  }
});

// Convertir a mayúsculas el texto mientras escriben (input text)
form.querySelectorAll('input[type="text"]').forEach(input => {
  input.addEventListener('input', () => {
    input.value = input.value.toUpperCase();
  });
});

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
