/**
 * ===============================================================================
 * SCRIPT.JS — VALIDACIÓN Y ENVÍO CON EMAILJS
 * ===============================================================================
 * 
 * Autor: Hector Arciniega
 * Proyecto: Formulario de Registro Profesional con EmailJS
 * Versión: 3.0 - EmailJS Edition
 * Fecha última actualización: 04/06/2025
 * 
 * DESCRIPCIÓN:
 * -----------
 * Este script implementa validación completa del formulario y envío de emails
 * usando EmailJS, permitiendo que funcione desde archivos locales sin servidor.
 * 
 * CONFIGURACIÓN REQUERIDA:
 * -----------------------
 * 1. Cuenta en EmailJS (emailjs.com)
 * 2. Servicio de email configurado (Gmail recomendado)
 * 3. Template de email creado
 * 4. Credenciales de EmailJS (ver sección de configuración abajo)
 * 
 * VARIABLES DEL TEMPLATE EMAILJS:
 * ------------------------------
 * - {{user_name}} - Nombre completo
 * - {{user_email}} - Correo electrónico
 * - {{user_email_confirm}} - Confirmación de correo
 * - {{user_password}} - Contraseña (opcional en template)
 * - {{user_age}} - Edad
 * - {{user_birthdate}} - Fecha de nacimiento
 * - {{user_comments}} - Comentarios
 * 
 * ===============================================================================
 */

// ===============================================================================
// CONFIGURACIÓN DE EMAILJS - ¡IMPORTANTE: REEMPLAZAR CON TUS CREDENCIALES!
// ===============================================================================

/**
 * PASO 1: REEMPLAZA ESTAS CREDENCIALES CON LAS TUYAS DE EMAILJS
 * 
 * Obtén estas credenciales desde tu dashboard de EmailJS:
 * - PUBLIC_KEY: En "Account" → "API Keys" → "Public Key"
 * - SERVICE_ID: En "Email Services" → Tu servicio → "Service ID"
 * - TEMPLATE_ID: En "Email Templates" → Tu template → "Template ID"
 */
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "YOUR_PUBLIC_KEY_HERE",     // 🔑 Reemplazar con tu Public Key
  SERVICE_ID: "YOUR_SERVICE_ID_HERE",     // 📧 Reemplazar con tu Service ID
  TEMPLATE_ID: "YOUR_TEMPLATE_ID_HERE"    // 📝 Reemplazar con tu Template ID
};

// ===============================================================================
// INICIALIZACIÓN Y PUNTO DE ENTRADA
// ===============================================================================

/**
 * Inicializar EmailJS cuando se carga el script
 * IMPORTANTE: Esto debe ejecutarse antes del DOMContentLoaded
 */
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

/**
 * Event Listener principal - Se ejecuta cuando el DOM está completamente cargado
 */
document.addEventListener('DOMContentLoaded', () => {

  // ===============================================================================
  // SECCIÓN 1: CAPTURA DE REFERENCIAS A ELEMENTOS DEL DOM
  // ===============================================================================

  /**
   * ELEMENTOS PRINCIPALES DEL FORMULARIO
   */
  const form = document.getElementById('professionalForm');
  const success = document.getElementById('successMessage');
  const sending = document.getElementById('sendingMessage');  // NUEVO: Mensaje de envío
  const submitBtn = document.getElementById('submitBtn');     // NUEVO: Referencia al botón

  /**
   * CAMPOS DE ENTRADA DEL FORMULARIO
   */
  const nameIn = document.getElementById('name');
  const emailIn = document.getElementById('email');
  const emailC = document.getElementById('emailConfirm');
  const passIn = document.getElementById('password');
  const passC = document.getElementById('passwordConfirm');
  const ageIn = document.getElementById('age');
  const birthIn = document.getElementById('birthdate');
  const commIn = document.getElementById('comments');
  const commCnt = document.getElementById('commentsCounter');

  /**
   * BOTONES DE TOGGLE PARA CONTRASEÑAS
   */
  const togP = document.getElementById('togglePassword');
  const togPC = document.getElementById('togglePasswordConfirm');

  // ===============================================================================
  // SECCIÓN 2: CONFIGURACIÓN INICIAL Y RESTRICCIONES DE INTERFAZ
  // ===============================================================================

  /**
   * CONFIGURACIÓN DE FECHA MÁXIMA PARA FECHA DE NACIMIENTO
   * Establece la fecha actual como máxima para prevenir fechas futuras
   */
  if (birthIn) {
    birthIn.max = new Date().toISOString().split('T')[0];
  }

  /**
   * TRANSFORMACIÓN AUTOMÁTICA A MAYÚSCULAS
   * Aplica a todos los inputs de tipo "text" excepto los de contraseña
   */
  form.querySelectorAll('input[type="text"]').forEach(inp => {
    inp.addEventListener('input', () => {
      inp.value = inp.value.toUpperCase();
    });
  });

  /**
   * CONTADOR DE CARACTERES PARA TEXTAREA
   * Actualiza dinámicamente el contador "X / 2000 caracteres"
   */
  if (commIn && commCnt) {
    commIn.addEventListener('input', () => {
      commCnt.textContent = `${commIn.value.length} / 2000 caracteres`;
    });
  }

  /**
   * FUNCIONALIDAD DE TOGGLE PARA CONTRASEÑAS
   * Alterna entre mostrar/ocultar contraseñas con iconos 👁️/🙈
   */
  function toggleVisibility(inputField, button) {
    if (inputField.type === 'password') {
      inputField.type = 'text';
      button.textContent = '🙈'; // Icono: ocultar
    } else {
      inputField.type = 'password';
      button.textContent = '👁️'; // Icono: mostrar
    }
  }

  // Asignar eventos a los botones de toggle
  togP.addEventListener('click', () => toggleVisibility(passIn, togP));
  togPC.addEventListener('click', () => toggleVisibility(passC, togPC));

  /**
   * RESTRICCIÓN NUMÉRICA PARA CAMPO EDAD
   * Permite solo dígitos, elimina cualquier otro carácter
   */
  if (ageIn) {
    ageIn.addEventListener('input', () => {
      ageIn.value = ageIn.value.replace(/\D/g, ''); // \D = no dígitos
    });
  }

  /**
   * RESTRICCIÓN ANTI-NÚMEROS PARA CAMPO NOMBRE
   * Previene entrada de números tanto al escribir como al pegar
   */
  if (nameIn) {
    // Restricción al escribir
    nameIn.addEventListener('input', () => {
      nameIn.value = nameIn.value.replace(/[0-9]/g, '');
    });

    // Restricción al pegar
    nameIn.addEventListener('paste', (e) => {
      const pasted = e.clipboardData.getData('text');
      if (/\d/.test(pasted)) { // Si contiene dígitos
        e.preventDefault();
        nameIn.value += pasted.replace(/[0-9]/g, ''); // Agregar solo sin números
      }
    });
  }

  // ===============================================================================
  // SECCIÓN 3: SISTEMA DE VALIDACIÓN Y ENVÍO CON EMAILJS
  // ===============================================================================

  /**
   * EVENT LISTENER PRINCIPAL DEL FORMULARIO
   * Maneja validación completa y envío con EmailJS
   */
  form.addEventListener('submit', e => {
    e.preventDefault(); // Prevenir envío por defecto del navegador
    let valid = true;   // Bandera de validación

    /**
     * FUNCIONES AUXILIARES PARA MANEJO DE ERRORES
     */
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

    /**
     * VALIDACIONES INDIVIDUALES POR CAMPO
     * Cada validación sigue el patrón: verificar → mostrar/ocultar error → actualizar flag
     */

    // VALIDACIÓN 1: NOMBRE COMPLETO
    // Regex: Solo letras (incluye acentos españoles), espacios, sin números
    if (!/^[A-ZÁÉÍÓÚÑ\s]+$/.test(nameIn.value.trim())) {
      valid = false;
      showErr('error-name', 'Sólo letras y espacios.');
      nameIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-name');
      nameIn.removeAttribute('aria-invalid');
    }

    // VALIDACIÓN 2: CORREO ELECTRÓNICO
    // Usa validación nativa del navegador (type="email")
    if (!emailIn.value || !emailIn.checkValidity()) {
      valid = false;
      showErr('error-email', 'Correo inválido.');
      emailIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-email');
      emailIn.removeAttribute('aria-invalid');
    }

    // VALIDACIÓN 3: CONFIRMACIÓN DE CORREO
    // Debe coincidir exactamente con el correo principal
    if (emailC.value !== emailIn.value) {
      valid = false;
      showErr('error-emailConfirm', 'Los correos no coinciden.');
      emailC.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-emailConfirm');
      emailC.removeAttribute('aria-invalid');
    }

    // VALIDACIÓN 4: CONTRASEÑA PRINCIPAL
    // Reglas: mínimo 8 caracteres, al menos 1 mayúscula Y 1 minúscula
    const passOK =
      passIn.value.length >= 8 &&
      /[a-z]/.test(passIn.value) &&  // Al menos una minúscula
      /[A-Z]/.test(passIn.value);    // Al menos una mayúscula

    if (!passOK) {
      valid = false;
      showErr('error-password', 'Mín. 8 caracteres, mayúsculas y minúsculas.');
      passIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-password');
      passIn.removeAttribute('aria-invalid');
    }

    // VALIDACIÓN 5: CONFIRMACIÓN DE CONTRASEÑA
    // Debe coincidir exactamente con la contraseña principal
    if (passC.value !== passIn.value) {
      valid = false;
      showErr('error-passwordConfirm', 'Las contraseñas no coinciden.');
      passC.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-passwordConfirm');
      passC.removeAttribute('aria-invalid');
    }

    // VALIDACIÓN 6: EDAD
    // Debe ser un número válido entre 1 y 120
    const ageVal = Number(ageIn.value);
    if (!ageVal || ageVal < 1 || ageVal > 120) {
      valid = false;
      showErr('error-age', 'Edad entre 1 y 120.');
      ageIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-age');
      ageIn.removeAttribute('aria-invalid');
    }

    // VALIDACIÓN 7: FECHA DE NACIMIENTO
    // No puede estar vacía ni ser fecha futura
    if (!birthIn.value || new Date(birthIn.value) > new Date()) {
      valid = false;
      showErr('error-birthdate', 'Fecha inválida.');
      birthIn.setAttribute('aria-invalid', 'true');
    } else {
