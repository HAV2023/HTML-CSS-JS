/**
 * ===================================================================
 * FORMULARIO PROFESIONAL CON EMAILJS Y VALIDACIÓN DE EMAIL
 * ===================================================================
 * Autor: Hector Arciniega
 * Versión: Con validación de email en tiempo real
 * Descripción: Script que maneja validación completa de formulario,
 *              envío por email y validación de existencia de emails
 */

/* ===================================================================
   CONFIGURACIONES GLOBALES Y CONSTANTES
   =================================================================== */

// Configuración para el servicio EmailJS
// EmailJS permite enviar emails sin servidor backend
const EMAILJS_CONFIG = {
  // Clave pública de EmailJS (visible en frontend, es segura)
  PUBLIC_KEY: "Escribir public_key",
  
  // ID del servicio de email configurado en EmailJS
  SERVICE_ID: "Escribir service_id",
  
  // ID del template de email configurado en EmailJS
  TEMPLATE_ID: "Escribir template_id"
};

// Configuración para validación de emails con API externa
const EMAIL_VALIDATION_CONFIG = {
  // API Key de EmailValidation.io para verificar existencia de emails
  API_KEY: "Escribir API_Key",
  
  // URL base de la API de validación
  API_URL: "https://api.emailvalidation.io/v1/info"
};

/* ===================================================================
   ESTADO GLOBAL DE VALIDACIÓN DE EMAIL
   =================================================================== */

// Objeto que mantiene el estado de la validación de email en tiempo real
// Se usa para evitar validar el mismo email repetidamente
let emailValidationState = {
  // Indica si actualmente se está validando un email
  isValidating: false,
  
  // Indica si el email actual es válido
  isValid: false,
  
  // Mensaje de estado actual (para debugging)
  message: '',
  
  // Último email que se validó (para evitar re-validaciones innecesarias)
  lastValidatedEmail: ''
};

/* ===================================================================
   INICIALIZACIÓN Y CONFIGURACIÓN INICIAL
   =================================================================== */

// Inicializar EmailJS con la clave pública
// Esto debe hacerse antes de usar cualquier función de EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

// Event listener que se ejecuta cuando el DOM está completamente cargado
// Esto asegura que todos los elementos HTML estén disponibles
document.addEventListener('DOMContentLoaded', function() {
  
  /* ===================================================================
     REFERENCIAS A ELEMENTOS DEL DOM
     =================================================================== */
  
  // === ELEMENTOS PRINCIPALES DEL FORMULARIO ===
  
  // Referencia al formulario completo
  const form = document.getElementById('professionalForm');
  
  // Botón de envío del formulario
  const submitBtn = document.getElementById('submitBtn');
  
  // Contenedores de mensajes de estado
  const successMessage = document.getElementById('successMessage');   // Mensaje de éxito
  const sendingMessage = document.getElementById('sendingMessage');   // Mensaje de "enviando..."
  const errorMessage = document.getElementById('errorMessage');       // Mensaje de error global
  
  // === CAMPOS DE ENTRADA DEL FORMULARIO ===
  
  // Campos de información personal
  const nameInput = document.getElementById('name');                         // Campo nombre
  const emailInput = document.getElementById('email');                       // Campo email principal
  const emailConfirmInput = document.getElementById('emailConfirm');         // Campo confirmación email
  const passwordInput = document.getElementById('password');                 // Campo contraseña
  const passwordConfirmInput = document.getElementById('passwordConfirm');   // Campo confirmación contraseña
  const ageInput = document.getElementById('age');                           // Campo edad
  const birthdateInput = document.getElementById('birthdate');               // Campo fecha nacimiento
  const commentsInput = document.getElementById('comments');                 // Campo comentarios (opcional)
  
  // Elemento que muestra el contador de caracteres del campo comentarios
  const commentsCounter = document.getElementById('commentsCounter');
  
  // === BOTONES DE FUNCIONALIDAD ESPECIAL ===
  
  // Botones para mostrar/ocultar contraseñas
  const togglePassword = document.getElementById('togglePassword');                   // Toggle contraseña principal
  const togglePasswordConfirm = document.getElementById('togglePasswordConfirm');   // Toggle confirmación contraseña

  /* ===================================================================
     CONFIGURACIONES INICIALES DEL FORMULARIO
     =================================================================== */
  
  // Configurar fecha máxima para el campo de fecha de nacimiento
  // Esto previene que el usuario seleccione fechas futuras
  if (birthdateInput) {
    // Obtener fecha actual en formato ISO (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    
    // Establecer como fecha máxima permitida
    birthdateInput.max = today;
  }

  /* ===================================================================
     FUNCIONES DE VALIDACIÓN DE EMAIL
     =================================================================== */

  /**
   * Validación avanzada del formato de email
   * Verifica múltiples aspectos del formato según estándares RFC
   * @param {string} email - El email a validar
   * @returns {object} - Objeto con resultado de validación y detalles
   */
  function validateEmailAdvanced(email) {
    // Expresión regular robusta para validar formato de email
    // Basada en RFC 5322 pero simplificada para uso práctico
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    // Objeto con diferentes verificaciones del email
    const checks = {
      // Verificar que cumple con el patrón regex
      format: emailRegex.test(email),
      
      // RFC 5321: longitud máxima de 254 caracteres
      length: email.length <= 254,
      
      // RFC 5321: parte local (antes del @) máximo 64 caracteres
      localPart: email.split('@')[0]?.length <= 64,
      
      // No permitir puntos consecutivos (..)
      noConsecutiveDots: !email.includes('..'),
      
      // No puede empezar o terminar con punto
      noStartEndDots: !email.startsWith('.') && !email.endsWith('.'),
      
      // Debe tener al menos un punto en la parte del dominio
      validDomain: email.split('@')[1]?.includes('.') || false
    };
    
    // Retornar resultado de validación
    return {
      // El email es válido si pasa todas las verificaciones
      isValid: Object.values(checks).every(check => check),
      
      // Detalles de cada verificación para debugging
      checks: checks
    };
  }

  /**
   * Detecta errores comunes de tipeo en dominios populares
   * Sugiere la corrección automática para dominios mal escritos
   * @param {string} email - El email a verificar
   * @returns {object|null} - Objeto con sugerencia o null si no hay errores
   */
  function validateCommonDomains(email) {
    // Extraer dominio del email y convertir a minúsculas
    const domain = email.split('@')[1]?.toLowerCase();
    
    // Mapeo de dominios correctos y sus errores de tipeo comunes
    const commonDomains = {
      'gmail.com': ['gmai.com', 'gmial.com', 'gmail.co', 'gmaill.com', 'gmeil.com'],
      'hotmail.com': ['hotmial.com', 'hotmai.com', 'hotmal.com', 'hotmeil.com'],
      'yahoo.com': ['yaho.com', 'yahooo.com', 'yahoo.co', 'yhoo.com'],
      'outlook.com': ['outlok.com', 'outllook.com', 'outlook.co'],
      'icloud.com': ['iclod.com', 'icoud.com', 'icloud.co']
    };
    
    // Buscar si el dominio actual está en la lista de errores
    for (const [correct, typos] of Object.entries(commonDomains)) {
      if (typos.includes(domain)) {
        return {
          // Email sugerido con corrección
          suggestion: email.replace(domain, correct),
          
          // Dominio original (con error)
          originalDomain: domain,
          
          // Dominio sugerido (correcto)
          suggestedDomain: correct
        };
      }
    }
    
    // No se encontraron errores de tipeo
    return null;
  }

  /**
   * Validación de email usando API externa (EmailValidation.io)
   * Verifica si el email realmente existe y puede recibir correos
   * @param {string} email - El email a validar
   * @returns {Promise<object>} - Promesa con resultado de validación
   */
  async function validateEmailWithAPI(email) {
    try {
      // Construir URL de la API con parámetros
      const url = `${EMAIL_VALIDATION_CONFIG.API_URL}?apikey=${EMAIL_VALIDATION_CONFIG.API_KEY}&email=${encodeURIComponent(email)}`;
      
      // Realizar petición HTTP a la API
      const response = await fetch(url);
      
      // Verificar que la respuesta sea exitosa
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Convertir respuesta a JSON
      const data = await response.json();
      
      // Log para debugging (ver respuesta de la API)
      console.log('Respuesta de validación:', data);
      
      // Procesar respuesta de la API
      return {
        // Email es válido si:
        // - Tiene formato correcto (format_valid)
        // - El dominio tiene registros MX (mx_found) 
        // - El buzón responde a SMTP (smtp_check)
        // - NO es email desechable (!disposable)
        isValid: data.format_valid && data.mx_found && data.smtp_check && !data.disposable,
        
        // Detalles de la validación
        details: {
          format: data.format_valid,      // Formato correcto
          domain: data.mx_found,          // Dominio válido
          mailbox: data.smtp_check,       // Buzón activo
          disposable: data.disposable,    // Email temporal
          role: data.role,                // Email de rol (admin, info, etc.)
          suggestion: data.suggestion,    // Sugerencia de la API
          status: data.state              // Estado general
        },
        
        // Respuesta completa de la API (para debugging)
        raw: data
      };
    } catch (error) {
      // Manejar errores de red o de la API
      console.error('Error validando email con API:', error);
      return { 
        isValid: false, 
        error: 'Error de conexión con el servicio de validación',
        details: {} 
      };
    }
  }

  /**
   * Muestra visualmente el estado de validación del email
   * Actualiza clases CSS y mensajes de error en tiempo real
   * @param {string} status - Estado: 'valid', 'invalid', 'suggestion', o ''
   * @param {string} message - Mensaje a mostrar al usuario
   * @param {boolean} isLoading - Si está en proceso de validación
   */
  function showEmailValidationStatus(status, message, isLoading = false) {
    // Obtener elemento donde se muestran errores de email
    const errorElement = document.getElementById('error-email');
    
    // Limpiar clases CSS previas del input
    emailInput.classList.remove('validating', 'valid', 'invalid');
    
    if (isLoading) {
      // Estado: validando email con API
      emailInput.classList.add('validating');                  // Clase CSS para efectos visuales
      errorElement.innerHTML = '🔄 Validando email...';        // Mensaje con emoji
      errorElement.style.color = '#ff9800';                    // Color naranja
      errorElement.style.display = 'block';                    // Mostrar mensaje
    } else if (status === 'valid') {
      // Estado: email válido
      emailInput.classList.add('valid');                       // Clase CSS verde
      errorElement.innerHTML = '✅ Email válido y verificado';  // Mensaje de éxito
      errorElement.style.color = '#4CAF50';                    // Color verde
      errorElement.style.display = 'block';
    } else if (status === 'invalid') {
      // Estado: email inválido
      emailInput.classList.add('invalid');                     // Clase CSS roja
      errorElement.innerHTML = message || '❌ Email no válido'; // Mensaje de error
      errorElement.style.color = '#d93025';                    // Color rojo
      errorElement.style.display = 'block';
    } else if (status === 'suggestion') {
      // Estado: sugerencia de corrección
      emailInput.classList.add('invalid');                     // Clase CSS roja
      errorElement.innerHTML = message;                        // Mensaje con HTML (botón)
      errorElement.style.color = '#ff9800';                    // Color naranja
      errorElement.style.display = 'block';
    } else {
      // Estado: ocultar mensaje
      errorElement.style.display = 'none';
    }
  }

  /**
   * Crea mensaje HTML con sugerencia de corrección de dominio
   * Incluye botón para aplicar la corrección automáticamente
   * @param {string} originalEmail - Email original con error
   * @param {string} suggestedEmail - Email sugerido (no usado actualmente)
   * @returns {string|null} - HTML del mensaje o null si no hay sugerencia
   */
  function createDomainSuggestion(originalEmail, suggestedEmail) {
    // Verificar si hay sugerencia de dominio
    const suggestion = validateCommonDomains(originalEmail);
    if (suggestion) {
      // Crear HTML con botón interactivo
      return `❓ ¿Quisiste decir <strong>${suggestion.suggestion}</strong>? 
              <button type="button" onclick="document.getElementById('email').value='${suggestion.suggestion}'; 
              document.getElementById('email').dispatchEvent(new Event('input'));" 
              style="background: #ff9800; color: white; border: none; padding: 2px 6px; border-radius: 3px; margin-left: 5px; cursor: pointer;">
              Usar esta
              </button>`;
    }
    return null;
  }

  /* ===================================================================
     CONFIGURACIÓN DE VALIDACIÓN EN TIEMPO REAL
     =================================================================== */

  // Variable para almacenar el timeout de validación
  // Se usa para implementar "debounce" (evitar validar en cada tecla)
  let emailValidationTimeout;

  /**
   * Configura la validación de email en tiempo real
   * Implementa debounce para evitar demasiadas llamadas a la API
   */
  function setupEmailValidation() {
    // Agregar evento 'input' al campo de email
    // Se ejecuta cada vez que el usuario escribe algo
    emailInput.addEventListener('input', function() {
      // Obtener valor actual del campo, sin espacios
      const email = this.value.trim();
      
      // Cancelar validación anterior si existe
      clearTimeout(emailValidationTimeout);
      
      // Resetear estado global de validación
      emailValidationState.isValid = false;
      emailValidationState.isValidating = false;
      
      // Si el campo está vacío, no mostrar nada
      if (email.length === 0) {
        showEmailValidationStatus('', '');
        return;
      }
      
      // === VALIDACIÓN INMEDIATA (SIN API) ===
      
      // Verificar formato básico sin llamar a la API
      const basicValidation = validateEmailAdvanced(email);
      if (!basicValidation.isValid) {
        showEmailValidationStatus('invalid', '❌ Formato de email incorrecto');
        return;
      }
      
      // Verificar errores de tipeo en dominios comunes
      const suggestionMessage = createDomainSuggestion(email);
      if (suggestionMessage) {
        showEmailValidationStatus('suggestion', suggestionMessage);
        return;
      }
      
      // === VALIDACIÓN CON API (DESPUÉS DE DELAY) ===
      
      // Configurar timeout para validar con API después de 1.5 segundos sin escribir
      // Esto evita hacer muchas llamadas mientras el usuario escribe
      emailValidationTimeout = setTimeout(async () => {
        // Optimización: no re-validar el mismo email
        if (emailValidationState.lastValidatedEmail === email && emailValidationState.isValid) {
          showEmailValidationStatus('valid');
          return;
        }
        
        // Mostrar estado de "validando..."
        showEmailValidationStatus('', '', true);
        emailValidationState.isValidating = true;
        
        try {
          // Llamar a la API de validación
          const result = await validateEmailWithAPI(email);
          
          // Actualizar estado global
          emailValidationState.isValidating = false;
          emailValidationState.lastValidatedEmail = email;
          emailValidationState.isValid = result.isValid;
          
          // Procesar resultado de la API
          if (result.error) {
            // Error de conexión o API
            showEmailValidationStatus('invalid', `⚠️ ${result.error}`);
          } else if (result.isValid) {
            // Email válido
            showEmailValidationStatus('valid');
          } else {
            // Email inválido - determinar razón específica
            let reason = '❌ Email no válido';
            
            if (result.details.disposable) {
              reason = '🚫 Email temporal/desechable detectado';
            } else if (result.details.role) {
              reason = '⚠️ Email de rol detectado (admin, info, etc.)';
            } else if (!result.details.format) {
              reason = '❌ Formato de email incorrecto';
            } else if (!result.details.domain) {
              reason = '❌ Dominio no válido o no existe';
            } else if (!result.details.mailbox) {
              reason = '❌ Buzón de correo no existe';
            }
            
            showEmailValidationStatus('invalid', reason);
          }
        } catch (error) {
          // Error inesperado en la validación
          emailValidationState.isValidating = false;
          showEmailValidationStatus('invalid', '⚠️ Error al validar email');
        }
      }, 1500); // Delay de 1.5 segundos
    });
  }

  /* ===================================================================
     FUNCIONES DE UTILIDAD PARA MANEJO DE ERRORES
     =================================================================== */

  /**
   * Muestra mensaje de error para un campo específico
   * @param {string} fieldId - ID del campo (sin prefijo 'error-')
   * @param {string} message - Mensaje de error a mostrar
   */
  function showError(fieldId, message) {
    // Construir ID del elemento de error
    const errorElement = document.getElementById('error-' + fieldId);
    if (errorElement) {
      // Establecer texto del mensaje
      errorElement.textContent = message;
      
      // Mostrar el elemento
      errorElement.style.display = 'block';
    }
  }

  /**
   * Oculta mensaje de error para un campo específico
   * @param {string} fieldId - ID del campo (sin prefijo 'error-')
   */
  function hideError(fieldId) {
    // Construir ID del elemento de error
    const errorElement = document.getElementById('error-' + fieldId);
    if (errorElement) {
      // Ocultar elemento
      errorElement.style.display = 'none';
      
      // Limpiar contenido
      errorElement.textContent = '';
    }
  }

  /**
   * Oculta todos los mensajes globales de estado del formulario
   */
  function hideAllMessages() {
    successMessage.style.display = 'none';   // Ocultar mensaje de éxito
    sendingMessage.style.display = 'none';   // Ocultar mensaje de envío
    errorMessage.style.display = 'none';     // Ocultar mensaje de error global
  }

  /* ===================================================================
     RESTRICCIONES DE ENTRADA EN CAMPOS
     =================================================================== */

  // === CAMPO NOMBRE: Solo letras y espacios, convertir a mayúsculas ===
  if (nameInput) {
    // Evento 'input': se ejecuta cada vez que cambia el contenido
    nameInput.addEventListener('input', function() {
      // Remover todos los números del texto
      this.value = this.value.replace(/[0-9]/g, '');
      
      // Convertir todo a mayúsculas
      this.value = this.value.toUpperCase();
    });

    // Evento 'paste': se ejecuta cuando el usuario pega texto
    nameInput.addEventListener('paste', function(e) {
      // Obtener texto del portapapeles
      const pastedText = e.clipboardData.getData('text');
      
      // Si contiene números, prevenir pegado normal y limpiar
      if (/\d/.test(pastedText)) {
        e.preventDefault(); // Cancelar pegado original
        
        // Agregar solo la parte sin números, en mayúsculas
        this.value += pastedText.replace(/[0-9]/g, '').toUpperCase();
      }
    });
  }

  // === CAMPO EDAD: Solo números ===
  if (ageInput) {
    ageInput.addEventListener('input', function() {
      // Mantener solo números, remover todo lo demás
      this.value = this.value.replace(/[^0-9]/g, '');
      
      // Convertir a mayúsculas (aunque sea redundante para números)
      this.value = this.value.toUpperCase();
    });
  }

  /* ===================================================================
     CONTADOR DE CARACTERES PARA COMENTARIOS
     =================================================================== */

  // Configurar contador solo si ambos elementos existen
  if (commentsInput && commentsCounter) {
    commentsInput.addEventListener('input', function() {
      // Obtener longitud actual del texto
      const currentLength = this.value.length;
      
      // Actualizar texto del contador
      commentsCounter.textContent = `${currentLength} / 2000 caracteres`;
      
      // Cambiar color si excede el límite
      if (currentLength > 2000) {
        commentsCounter.style.color = '#d93025'; // Rojo si excede
      } else {
        commentsCounter.style.color = '#666';    // Gris normal
      }
    });
  }

  /* ===================================================================
     FUNCIONALIDAD DE MOSTRAR/OCULTAR CONTRASEÑAS
     =================================================================== */

  /**
   * Configura botón para mostrar/ocultar contraseña
   * @param {HTMLElement} inputElement - Campo de contraseña
   * @param {HTMLElement} buttonElement - Botón de toggle
   */
  function setupPasswordToggle(inputElement, buttonElement) {
    // Verificar que ambos elementos existan
    if (inputElement && buttonElement) {
      buttonElement.addEventListener('click', function(e) {
        // Prevenir comportamiento por defecto del botón
        e.preventDefault();
        e.stopPropagation();
        
        // Alternar entre mostrar y ocultar
        if (inputElement.type === 'password') {
          // Cambiar a texto visible
          inputElement.type = 'text';
          buttonElement.textContent = '🙈'; // Emoji "no ver"
        } else {
          // Cambiar a contraseña oculta
          inputElement.type = 'password';
          buttonElement.textContent = '👁️'; // Emoji "ojo"
        }
      });
    }
  }

  // Configurar toggles para ambos campos de contraseña
  setupPasswordToggle(passwordInput, togglePassword);
  setupPasswordToggle(passwordConfirmInput, togglePasswordConfirm);

  /* ===================================================================
     FUNCIÓN PRINCIPAL DE VALIDACIÓN DEL FORMULARIO
     =================================================================== */

  /**
   * Valida todos los campos del formulario antes del envío
   * @returns {boolean} - true si todos los campos son válidos
   */
  function validateForm() {
    let isValid = true; // Flag para rastrear si el formulario es válido

    // === VALIDACIÓN DEL NOMBRE ===
    const nameValue = nameInput.value.trim();
    if (!nameValue) {
      // Campo vacío
      showError('name', 'El nombre es obligatorio.');
      isValid = false;
    } else if (!/^[A-ZÁÉÍÓÚÑ\s]+$/.test(nameValue)) {
      // Contiene caracteres no permitidos
      // Regex permite solo letras (incluyendo acentos) y espacios
      showError('name', 'Solo se permiten letras y espacios.');
      isValid = false;
    } else {
      // Válido
      hideError('name');
    }

    // === VALIDACIÓN DEL EMAIL (CON API) ===
    const emailValue = emailInput.value.trim();
    if (!emailValue) {
      // Campo vacío
      showError('email', 'El correo electrónico es obligatorio.');
      isValid = false;
    } else if (emailValidationState.isValidating) {
      // Aún se está validando con la API
      showError('email', 'Esperando validación de email...');
      isValid = false;
    } else if (!emailValidationState.isValid) {
      // No pasó la validación de la API
      showError('email', 'Por favor ingresa un email válido y existente.');
      isValid = false;
    } else {
      // Válido
      hideError('email');
    }

    // === VALIDACIÓN DE CONFIRMACIÓN DE EMAIL ===
    const emailConfirmValue = emailConfirmInput.value.trim();
    if (!emailConfirmValue) {
      // Campo vacío
      showError('emailConfirm', 'La confirmación de correo es obligatoria.');
      isValid = false;
    } else if (emailConfirmValue !== emailValue) {
      // No coincide con el email principal
      showError('emailConfirm', 'Los correos electrónicos no coinciden.');
      isValid = false;
    } else {
      // Válido
      hideError('emailConfirm');
    }

    // === VALIDACIÓN DE CONTRASEÑA ===
    const passwordValue = passwordInput.value;
    if (!passwordValue) {
      // Campo vacío
      showError('password', 'La contraseña es obligatoria.');
      isValid = false;
    } else if (passwordValue.length < 8) {
      // Muy corta
      showError('password', 'La contraseña debe tener al menos 8 caracteres.');
      isValid = false;
    } else if (!/[a-z]/.test(passwordValue) || !/[A-Z]/.test(passwordValue)) {
      // No contiene mayúsculas y minúsculas
      showError('password', 'La contraseña debe contener al menos una mayúscula y una minúscula.');
      isValid = false;
    } else {
      // Válido
      hideError('password');
    }

    // === VALIDACIÓN DE CONFIRMACIÓN DE CONTRASEÑA ===
    const passwordConfirmValue = passwordConfirmInput.value;
    if (!passwordConfirmValue) {
      // Campo vacío
      showError('passwordConfirm', 'La confirmación de contraseña es obligatoria.');
      isValid = false;
    } else if (passwordConfirmValue !== passwordValue) {
      // No coincide con la contraseña principal
      showError('passwordConfirm', 'Las contraseñas no coinciden.');
      isValid = false;
    } else {
      // Válido
      hideError('passwordConfirm');
    }

    // === VALIDACIÓN DE EDAD ===
    const ageValue = parseInt(ageInput.value);
    if (!ageInput.value) {
      // Campo vacío
      showError('age', 'La edad es obligatoria.');
      isValid = false;
    } else if (isNaN(ageValue) || ageValue < 1 || ageValue > 120) {
      // Fuera del rango válido
      showError('age', 'La edad debe estar entre 1 y 120 años.');
      isValid = false;
    } else {
      // Válido
      hideError('age');
    }

    // === VALIDACIÓN DE FECHA DE NACIMIENTO ===
    const birthdateValue = birthdateInput.value;
    if (!birthdateValue) {
      // Campo vacío
      showError('birthdate', 'La fecha de nacimiento es obligatoria.');
      isValid = false;
    } else {
      // Verificar que no sea fecha futura
      const birthDate = new Date(birthdateValue);
      const today = new Date();
      if (birthDate > today) {
        showError('birthdate', 'La fecha de nacimiento no puede ser futura.');
        isValid = false;
      } else {
        // Válido
        hideError('birthdate');
      }
    }

    // === VALIDACIÓN DE COMENTARIOS (OPCIONAL) ===
    const commentsValue = commentsInput.value;
    if (commentsValue.length > 2000) {
      // Excede límite de caracteres
      showError('comments', 'Los comentarios no pueden exceder 2000 caracteres.');
      isValid = false;
    } else {
      // Válido (o vacío, que está permitido)
      hideError('comments');
    }

    // Retornar resultado general de validación
    return isValid;
  }

  /* ===================================================================
     MANEJO DEL ENVÍO DEL FORMULARIO
     =================================================================== */

  // Agregar evento de envío al formulario
  form.addEventListener('submit', function(e) {
    // Prevenir envío por defecto del navegador
    e.preventDefault();
    
    // Log para debugging
    console.log('Formulario enviado - iniciando validación');
    
    // Ocultar mensajes de estado previos
    hideAllMessages();
    
    // Ejecutar validación completa
    if (!validateForm()) {
      console.log('Validación fallida');
      return; // Salir sin enviar si hay errores
    }
    
    // Log para debugging
    console.log('Validación exitosa - enviando email');
    
    // === CAMBIAR ESTADO VISUAL DURANTE EL ENVÍO ===
    
    // Mostrar mensaje de "enviando..."
    sendingMessage.style.display = 'block';
    
    // Deshabilitar botón para evitar envíos múltiples
    submitBtn.disabled = true;
    
    // Cambiar texto del botón para feedback visual
    submitBtn.textContent = 'Enviando...';
    
    // === ENVÍO CON EMAILJS ===
    
    // EmailJS envía el formulario usando la configuración establecida
    // SERVICE_ID: servicio de email configurado
    // TEMPLATE_ID: plantilla de email configurada  
    // form: elemento del formulario HTML con todos los campos
    emailjs.sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, form)
      .then(function(response) {
        // === MANEJO DE ENVÍO EXITOSO ===
        
        // Log para debugging
        console.log('Email enviado exitosamente:', response);
        
        // Ocultar mensaje de "enviando..."
        sendingMessage.style.display = 'none';
        
        // Mostrar mensaje de éxito
        successMessage.style.display = 'block';
        
        // === LIMPIAR FORMULARIO DESPUÉS DEL ENVÍO ===
        
        // Resetear todos los campos del formulario
        form.reset();
        
        // Restaurar contador de comentarios manualmente
        // (form.reset() no dispara eventos 'input')
        if (commentsCounter) {
          commentsCounter.textContent = '0 / 2000 caracteres';
        }
        
        // Resetear estado de validación de email
        // Esto es importante para nuevos envíos
        emailValidationState = {
          isValidating: false,
          isValid: false,
          message: '',
          lastValidatedEmail: ''
        };
        
        // === RESTAURAR ESTADO DEL BOTÓN ===
        
        // Rehabilitar botón
        submitBtn.disabled = false;
        
        // Restaurar texto original
        submitBtn.textContent = 'Enviar información';
        
        // === REDIRECCIÓN AUTOMÁTICA ===
        
        // Redirigir a página de agradecimiento después de 3 segundos
        // Esto da tiempo al usuario para ver el mensaje de éxito
        setTimeout(function() {
          window.location.href = 'gracias.html';
        }, 3000);
        
      })
      .catch(function(error) {
        // === MANEJO DE ERROR EN EL ENVÍO ===
        
        // Log del error para debugging
        console.error('Error al enviar email:', error);
        
        // Ocultar mensaje de "enviando..."
        sendingMessage.style.display = 'none';
        
        // Mostrar mensaje de error global
        errorMessage.style.display = 'block';
        
        // === RESTAURAR ESTADO DEL BOTÓN ===
        
        // Rehabilitar botón para permitir reintento
        submitBtn.disabled = false;
        
        // Restaurar texto original
        submitBtn.textContent = 'Enviar información';
      });
  });

  /* ===================================================================
     INICIALIZACIÓN FINAL
     =================================================================== */

  // Activar validación de email en tiempo real
  // Esta función configura todos los eventos necesarios
  setupEmailValidation();

  // Log de confirmación para debugging
  console.log('Script inicializado correctamente con validación de email');
});
