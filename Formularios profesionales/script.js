/**
 * FORMULARIO PROFESIONAL CON EMAILJS Y VALIDACIÓN DE EMAIL
 * Autor: Hector Arciniega
 * Versión: Con validación de email en tiempo real e indicador de fortaleza de contraseña
 * 
 * DESCRIPCIÓN GENERAL:
 * Este script maneja un formulario profesional con:
 * - Validación de email en tiempo real usando API externa
 * - Medidor de fortaleza de contraseñas
 * - Envío de emails mediante EmailJS
 * - Validaciones robustas del lado cliente
 * - Interfaz de usuario interactiva
 */

// ===================================================================
// CONFIGURACIONES PRINCIPALES
// ===================================================================

/**
 * CONFIGURACIÓN EMAILJS - Credenciales para el servicio de envío de emails
 * EmailJS https://www.emailjs.com/ permite enviar emails directamente desde el frontend sin backend
 */
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "Escribir public_key",    // Clave pública de EmailJS
  SERVICE_ID: "Escribir service_id",       // ID del servicio de email configurado
  TEMPLATE_ID: "Escribir template_id"      // ID de la plantilla de email
};

/**
 * CONFIGURACIÓN DE VALIDACIÓN DE EMAIL - API externa para verificar emails
 * https://emailvalidation.io/ es un servicio que verifica si un email existe realmente
 */
const EMAIL_VALIDATION_CONFIG = {
  API_KEY: "Escribir API_kEY",  // Clave de API
  API_URL: "https://api.emailvalidation.io/v1/info"              // Endpoint de la API
};

/**
 * LISTA DE CONTRASEÑAS COMUNES - Para detectar contraseñas débiles
 * Array con las contraseñas más utilizadas mundialmente
 */
const COMMON_PASSWORDS = [
  '123456', 'password', '123456789', '12345678', '12345', '1234567', 
  'qwerty', 'abc123', 'password123', 'admin', 'letmein', 'welcome',
  '123123', 'password1', 'qwerty123', '111111', '000000', '1234',
  'iloveyou', 'dragon', 'monkey', 'sunshine', 'princess', 'football'
];

/**
 * ESTADO GLOBAL DE VALIDACIÓN DE EMAIL
 * Objeto que mantiene el estado actual de la validación de email
 */
let emailValidationState = {
  isValidating: false,        // Si está validando actualmente
  isValid: false,             // Si el último email validado es válido
  message: '',                // Mensaje de estado actual
  lastValidatedEmail: ''      // Último email que se validó para evitar validaciones repetidas
};

// ===================================================================
// INICIALIZACIÓN DE SERVICIOS EXTERNOS
// ===================================================================

/**
 * INICIALIZAR EMAILJS
 * Configura EmailJS con la clave pública para poder enviar emails
 */
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

// ===================================================================
// EVENTO PRINCIPAL - CUANDO EL DOM ESTÁ CARGADO
// ===================================================================

/**
 * EVENT LISTENER PRINCIPAL
 * Se ejecuta cuando el DOM está completamente cargado
 * Aquí se inicializan todos los componentes del formulario
 */
document.addEventListener('DOMContentLoaded', function() {
  
  // ===================================================================
  // REFERENCIAS A ELEMENTOS DEL DOM
  // ===================================================================
  
  /**
   * ELEMENTOS PRINCIPALES DEL FORMULARIO
   * Referencias a los elementos más importantes del formulario
   */
  const form = document.getElementById('professionalForm');           // El formulario completo
  const submitBtn = document.getElementById('submitBtn');             // Botón de envío
  const successMessage = document.getElementById('successMessage');   // Mensaje de éxito
  const sendingMessage = document.getElementById('sendingMessage');   // Mensaje de "enviando"
  const errorMessage = document.getElementById('errorMessage');       // Mensaje de error global
  
  /**
   * CAMPOS DE ENTRADA DEL FORMULARIO
   * Referencias a todos los campos de input del formulario
   */
  const nameInput = document.getElementById('name');                     // Campo nombre
  const emailInput = document.getElementById('email');                   // Campo email
  const emailConfirmInput = document.getElementById('emailConfirm');     // Confirmación email
  const passwordInput = document.getElementById('password');             // Campo contraseña
  const passwordConfirmInput = document.getElementById('passwordConfirm'); // Confirmación contraseña
  const ageInput = document.getElementById('age');                       // Campo edad
  const birthdateInput = document.getElementById('birthdate');           // Campo fecha nacimiento
  const commentsInput = document.getElementById('comments');             // Campo comentarios
  const commentsCounter = document.getElementById('commentsCounter');    // Contador de caracteres
  
  /**
   * ELEMENTOS DEL INDICADOR DE FORTALEZA DE CONTRASEÑA
   * Referencias a los elementos que muestran la fortaleza de la contraseña
   */
  const passwordStrength = document.getElementById('passwordStrength');  // Contenedor completo
  const strengthBar = document.getElementById('strengthBar');            // Barra de progreso
  const strengthText = document.getElementById('strengthText');          // Texto descriptivo
  
  /**
   * BOTONES DE MOSTRAR/OCULTAR CONTRASEÑA
   * Referencias a los botones que permiten ver las contraseñas
   */
  const togglePassword = document.getElementById('togglePassword');           // Toggle contraseña principal
  const togglePasswordConfirm = document.getElementById('togglePasswordConfirm'); // Toggle confirmación

  // ===================================================================
  // CONFIGURACIONES INICIALES
  // ===================================================================
  
  /**
   * CONFIGURAR FECHA MÁXIMA PARA FECHA DE NACIMIENTO
   * Evita que se seleccionen fechas futuras
   */
  if (birthdateInput) {
    const today = new Date().toISOString().split('T')[0];  // Fecha actual en formato YYYY-MM-DD
    birthdateInput.max = today;                            // Establecer como fecha máxima
  }

  // ===================================================================
  // FUNCIONES DE FORTALEZA DE CONTRASEÑA
  // ===================================================================

  /**
   * VERIFICAR REQUISITOS DE CONTRASEÑA
   * Evalúa si una contraseña cumple con diferentes criterios de seguridad
   * 
   * @param {string} password - La contraseña a evaluar
   * @returns {object} - Objeto con booleanos indicando qué requisitos cumple
   */
  function checkPasswordRequirements(password) {
    return {
      length: password.length >= 8,                                           // Mínimo 8 caracteres
      lower: /[a-z]/.test(password),                                         // Al menos una minúscula
      upper: /[A-Z]/.test(password),                                         // Al menos una mayúscula
      number: /\d/.test(password),                                           // Al menos un número
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),     // Al menos un carácter especial
      noCommon: !COMMON_PASSWORDS.includes(password.toLowerCase())          // No es contraseña común
    };
  }

  /**
   * CALCULAR FORTALEZA DE CONTRASEÑA
   * Determina el nivel de fortaleza basado en los requisitos cumplidos
   * 
   * @param {string} password - La contraseña a evaluar
   * @returns {object} - Objeto con nivel, texto, clase CSS y datos adicionales
   */
  function calculatePasswordStrength(password) {
    // Si está vacía, retornar estado inicial
    if (password.length === 0) {
      return { level: 'empty', text: 'Escribe tu contraseña', className: '' };
    }

    // Obtener requisitos cumplidos
    const requirements = checkPasswordRequirements(password);
    const metRequirements = Object.values(requirements).filter(Boolean).length; // Contar requisitos cumplidos
    
    // Variables para el resultado
    let level = '';
    let text = '';
    let className = '';

    /**
     * LÓGICA DE CLASIFICACIÓN DE FORTALEZA
     * Basada en la cantidad de requisitos cumplidos
     */
    if (metRequirements <= 2) {
      // Muy débil - cumple 2 o menos requisitos
      level = 'weak';
      text = '🔴 Débil - Necesita mejoras';
      className = 'strength-weak text-weak';
    } else if (metRequirements === 3 || metRequirements === 4) {
      // Regular - cumple 3 o 4 requisitos
      level = 'medium';
      text = '🟡 Regular - Puede mejorar';
      className = 'strength-medium text-medium';
    } else if (metRequirements === 5) {
      // Fuerte - cumple 5 requisitos
      level = 'strong';
      text = '🟢 Fuerte - ¡Muy bien!';
      className = 'strength-strong text-strong';
    } else if (metRequirements === 6) {
      // Excelente - cumple todos los requisitos
      level = 'very-strong';
      text = '🔵 Excelente - ¡Perfecta!';
      className = 'strength-very-strong text-very-strong';
    }

    /**
     * BONUS POR LONGITUD EXTRA
     * Si la contraseña es muy larga y ya es fuerte, la hace excelente
     */
    if (password.length >= 12 && level === 'strong') {
      level = 'very-strong';
      text = '🔵 Excelente - ¡Perfecta!';
      className = 'strength-very-strong text-very-strong';
    }

    return { level, text, className, requirements, score: metRequirements };
  }

  /**
   * ACTUALIZAR INTERFAZ DE FORTALEZA DE CONTRASEÑA
   * Modifica la UI para mostrar el nivel actual de fortaleza
   * 
   * @param {string} password - La contraseña actual
   */
  function updatePasswordStrength(password) {
    const strength = calculatePasswordStrength(password);
    
    /**
     * MOSTRAR/OCULTAR INDICADOR
     * Se muestra cuando hay texto, se oculta cuando está vacío
     */
    if (password.length > 0) {
      passwordStrength.style.display = 'block';          // Hacer visible
      passwordStrength.classList.add('show');            // Agregar clase de animación
    } else {
      passwordStrength.classList.remove('show');         // Quitar clase de animación
      // Ocultar después de la animación (300ms)
      setTimeout(() => {
        if (password.length === 0) {
          passwordStrength.style.display = 'none';
        }
      }, 300);
      return; // Salir de la función si está vacío
    }
    
    /**
     * ACTUALIZAR ELEMENTOS VISUALES
     * Modifica la barra de progreso y el texto descriptivo
     */
    strengthBar.className = `password-strength-bar ${strength.className.split(' ')[0]}`;      // Clase para la barra
    strengthText.textContent = strength.text;                                                  // Texto descriptivo
    strengthText.className = `password-strength-text ${strength.className.split(' ')[1]}`;    // Clase para el texto
  }

  // ===================================================================
  // FUNCIONES DE VALIDACIÓN DE EMAIL
  // ===================================================================

  /**
   * VALIDACIÓN AVANZADA DE FORMATO DE EMAIL
   * Verifica que el email cumpla con el formato RFC estándar y otras reglas
   * 
   * @param {string} email - El email a validar
   * @returns {object} - Resultado de la validación con detalles
   */
  function validateEmailAdvanced(email) {
    // Expresión regular RFC 5322 para validar emails
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    /**
     * VERIFICACIONES ESPECÍFICAS
     * Conjunto de validaciones para diferentes aspectos del email
     */
    const checks = {
      format: emailRegex.test(email),                           // Formato general válido
      length: email.length <= 254,                             // Longitud máxima del email
      localPart: email.split('@')[0]?.length <= 64,           // Longitud máxima de la parte local
      noConsecutiveDots: !email.includes('..'),               // No puntos consecutivos
      noStartEndDots: !email.startsWith('.') && !email.endsWith('.'), // No puntos al inicio/final
      validDomain: email.split('@')[1]?.includes('.') || false // Dominio contiene punto
    };
    
    return {
      isValid: Object.values(checks).every(check => check),    // Todas las verificaciones deben pasar
      checks: checks                                           // Detalles de cada verificación
    };
  }

  /**
   * VALIDACIÓN DE DOMINIOS COMUNES (DETECTAR ERRORES DE TIPEO)
   * Sugiere correcciones para dominios mal escritos
   * 
   * @param {string} email - El email a verificar
   * @returns {object|null} - Sugerencia de corrección o null si no hay errores
   */
  function validateCommonDomains(email) {
    const domain = email.split('@')[1]?.toLowerCase();  // Obtener dominio en minúsculas
    
    /**
     * MAPEO DE DOMINIOS COMUNES Y SUS ERRORES TÍPICOS
     * Cada dominio correcto tiene una lista de errores comunes de tipeo
     */
    const commonDomains = {
      'gmail.com': ['gmai.com', 'gmial.com', 'gmail.co', 'gmaill.com', 'gmeil.com'],
      'hotmail.com': ['hotmial.com', 'hotmai.com', 'hotmal.com', 'hotmeil.com'],
      'yahoo.com': ['yaho.com', 'yahooo.com', 'yahoo.co', 'yhoo.com'],
      'outlook.com': ['outlok.com', 'outllook.com', 'outlook.co'],
      'icloud.com': ['iclod.com', 'icoud.com', 'icloud.co']
    };
    
    /**
     * BUSCAR COINCIDENCIAS CON ERRORES COMUNES
     * Recorre los dominios para encontrar posibles correcciones
     */
    for (const [correct, typos] of Object.entries(commonDomains)) {
      if (typos.includes(domain)) {
        return {
          suggestion: email.replace(domain, correct),    // Email corregido
          originalDomain: domain,                        // Dominio original (con error)
          suggestedDomain: correct                       // Dominio sugerido (correcto)
        };
      }
    }
    
    return null; // No se encontraron errores de tipeo
  }

  /**
   * VALIDACIÓN CON API DE EMAILVALIDATION.IO
   * Verifica que el email existe realmente usando un servicio externo
   * 
   * @param {string} email - El email a validar
   * @returns {Promise<object>} - Resultado de la validación con detalles
   */
  async function validateEmailWithAPI(email) {
    try {
      // Construir URL de la API con parámetros
      const url = `${EMAIL_VALIDATION_CONFIG.API_URL}?apikey=${EMAIL_VALIDATION_CONFIG.API_KEY}&email=${encodeURIComponent(email)}`;
      const response = await fetch(url);
      
      // Verificar que la respuesta sea exitosa
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Respuesta de validación:', data); // Log para debugging
      
      /**
       * ANÁLISIS DE LA RESPUESTA DE LA API
       * La API retorna varios campos que determinan si el email es válido
       */
      return {
        // Email válido si: formato correcto + dominio existe + buzón existe + no es desechable
        isValid: data.format_valid && data.mx_found && data.smtp_check && !data.disposable,
        details: {
          format: data.format_valid,      // Formato es válido
          domain: data.mx_found,          // Dominio tiene registros MX
          mailbox: data.smtp_check,       // Buzón de correo existe
          disposable: data.disposable,    // Es email temporal/desechable
          role: data.role,               // Es email de rol (admin, info, etc.)
          suggestion: data.suggestion,    // Sugerencia de corrección de la API
          status: data.state             // Estado general de la validación
        },
        raw: data // Datos completos de la API para debugging
      };
    } catch (error) {
      console.error('Error validando email con API:', error);
      return { 
        isValid: false, 
        error: 'Error de conexión con el servicio de validación',
        details: {} 
      };
    }
  }

  /**
   * MOSTRAR ESTADO DE VALIDACIÓN EN LA INTERFAZ
   * Actualiza la UI para reflejar el estado actual de validación del email
   * 
   * @param {string} status - Estado: 'valid', 'invalid', 'suggestion', o ''
   * @param {string} message - Mensaje a mostrar
   * @param {boolean} isLoading - Si está en proceso de validación
   */
  function showEmailValidationStatus(status, message, isLoading = false) {
    const errorElement = document.getElementById('error-email');
    
    // Limpiar clases CSS previas del input
    emailInput.classList.remove('validating', 'valid', 'invalid');
    
    if (isLoading) {
      // Estado de carga/validando
      emailInput.classList.add('validating');
      errorElement.innerHTML = '🔄 Validando email...';
      errorElement.style.color = '#ff9800';  // Color naranja
      errorElement.style.display = 'block';
    } else if (status === 'valid') {
      // Email válido
      emailInput.classList.add('valid');
      errorElement.innerHTML = '✅ Email válido y verificado';
      errorElement.style.color = '#4CAF50';  // Color verde
      errorElement.style.display = 'block';
    } else if (status === 'invalid') {
      // Email inválido
      emailInput.classList.add('invalid');
      errorElement.innerHTML = message || '❌ Email no válido';
      errorElement.style.color = '#d93025';  // Color rojo
      errorElement.style.display = 'block';
    } else if (status === 'suggestion') {
      // Sugerencia de corrección
      emailInput.classList.add('invalid');
      errorElement.innerHTML = message;
      errorElement.style.color = '#ff9800';  // Color naranja
      errorElement.style.display = 'block';
    } else {
      // Ocultar mensaje
      errorElement.style.display = 'none';
    }
  }

  /**
   * CREAR SUGERENCIA DE DOMINIO CON BOTÓN INTERACTIVO
   * Genera HTML para mostrar sugerencia de corrección con botón para aplicarla
   * 
   * @param {string} originalEmail - Email original con error
   * @param {string} suggestedEmail - Email sugerido (no usado actualmente)
   * @returns {string|null} - HTML de la sugerencia o null si no hay sugerencia
   */
  function createDomainSuggestion(originalEmail, suggestedEmail) {
    const suggestion = validateCommonDomains(originalEmail);
    if (suggestion) {
      return `❓ ¿Quisiste decir <strong>${suggestion.suggestion}</strong>? 
              <button type="button" onclick="document.getElementById('email').value='${suggestion.suggestion}'; 
              document.getElementById('email').dispatchEvent(new Event('input'));" 
              style="background: #ff9800; color: white; border: none; padding: 2px 6px; border-radius: 3px; margin-left: 5px; cursor: pointer;">
              Usar esta
              </button>`;
    }
    return null;
  }

  /**
   * CONFIGURAR VALIDACIÓN DE EMAIL EN TIEMPO REAL
   * Establece los event listeners para validar email mientras el usuario escribe
   */
  let emailValidationTimeout; // Variable para manejar el debounce

  function setupEmailValidation() {
    emailInput.addEventListener('input', function() {
      const email = this.value.trim();
      
      // Limpiar timeout anterior para implementar debounce
      clearTimeout(emailValidationTimeout);
      
      // Resetear estado de validación
      emailValidationState.isValid = false;
      emailValidationState.isValidating = false;
      
      // Si el campo está vacío, limpiar validación
      if (email.length === 0) {
        showEmailValidationStatus('', '');
        return;
      }
      
      /**
       * VALIDACIÓN BÁSICA INMEDIATA
       * Se ejecuta instantáneamente sin esperar
       */
      const basicValidation = validateEmailAdvanced(email);
      if (!basicValidation.isValid) {
        showEmailValidationStatus('invalid', '❌ Formato de email incorrecto');
        return;
      }
      
      /**
       * VERIFICAR SUGERENCIAS DE DOMINIO
       * Se ejecuta inmediatamente después de la validación básica
       */
      const suggestionMessage = createDomainSuggestion(email);
      if (suggestionMessage) {
        showEmailValidationStatus('suggestion', suggestionMessage);
        return;
      }
      
      /**
       * VALIDACIÓN CON API (CON DEBOUNCE)
       * Se ejecuta después de 1.5 segundos de inactividad para evitar muchas llamadas
       */
      emailValidationTimeout = setTimeout(async () => {
        // Evitar validar el mismo email múltiples veces
        if (emailValidationState.lastValidatedEmail === email && emailValidationState.isValid) {
          showEmailValidationStatus('valid');
          return;
        }
        
        // Mostrar estado de carga
        showEmailValidationStatus('', '', true);
        emailValidationState.isValidating = true;
        
        try {
          // Llamar a la API de validación
          const result = await validateEmailWithAPI(email);
          emailValidationState.isValidating = false;
          emailValidationState.lastValidatedEmail = email;
          emailValidationState.isValid = result.isValid;
          
          if (result.error) {
            // Error de conectividad o API
            showEmailValidationStatus('invalid', `⚠️ ${result.error}`);
          } else if (result.isValid) {
            // Email válido
            showEmailValidationStatus('valid');
          } else {
            /**
             * EMAIL INVÁLIDO - DETERMINAR RAZÓN ESPECÍFICA
             * Analizar los detalles para dar un mensaje más específico
             */
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
      }, 1500); // Debounce de 1.5 segundos
    });
  }

  // ===================================================================
  // CONFIGURAR INDICADOR DE CONTRASEÑA
  // ===================================================================
  
  /**
   * EVENT LISTENER PARA INPUT DE CONTRASEÑA
   * Se activa cada vez que el usuario escribe en el campo de contraseña
   */
  passwordInput.addEventListener('input', function() {
    updatePasswordStrength(this.value);
  });

  /**
   * EVENT LISTENER PARA FOCUS DE CONTRASEÑA
   * Muestra el indicador si ya hay contenido cuando se enfoca el campo
   */
  passwordInput.addEventListener('focus', function() {
    if (this.value.length > 0) {
      passwordStrength.style.display = 'block';
      passwordStrength.classList.add('show');
    }
  });

  // ===================================================================
  // FUNCIONES DE UTILIDAD PARA MENSAJES
  // ===================================================================
  
  /**
   * MOSTRAR MENSAJE DE ERROR EN UN CAMPO ESPECÍFICO
   * @param {string} fieldId - ID del campo sin el prefijo 'error-'
   * @param {string} message - Mensaje de error a mostrar
   */
  function showError(fieldId, message) {
    const errorElement = document.getElementById('error-' + fieldId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
  }

  /**
   * OCULTAR MENSAJE DE ERROR DE UN CAMPO ESPECÍFICO
   * @param {string} fieldId - ID del campo sin el prefijo 'error-'
   */
  function hideError(fieldId) {
    const errorElement = document.getElementById('error-' + fieldId);
    if (errorElement) {
      errorElement.style.display = 'none';
      errorElement.textContent = '';
    }
  }

  /**
   * OCULTAR TODOS LOS MENSAJES GLOBALES
   * Limpia los mensajes de éxito, envío y error global
   */
  function hideAllMessages() {
    successMessage.style.display = 'none';
    sendingMessage.style.display = 'none';
    errorMessage.style.display = 'none';
  }

  // ===================================================================
  // RESTRICCIONES DE ENTRADA Y FORMATEO
  // ===================================================================
  
  /**
   * CONFIGURAR CAMPO DE NOMBRE
   * Solo permite letras y convierte a mayúsculas automáticamente
   */
  if (nameInput) {
    // Event listener para input normal
    nameInput.addEventListener('input', function() {
      this.value = this.value.replace(/[0-9]/g, '');  // Remover números
      this.value = this.value.toUpperCase();          // Convertir a mayúsculas
    });

    // Event listener para texto pegado
    nameInput.addEventListener('paste', function(e) {
      const pastedText = e.clipboardData.getData('text');
      if (/\d/.test(pastedText)) {                    // Si contiene números
        e.preventDefault();                           // Prevenir pegado normal
        this.value += pastedText.replace(/[0-9]/g, '').toUpperCase(); // Pegar sin números
      }
    });
  }

  /**
   * CONFIGURAR CAMPO DE EDAD
   * Solo permite números
   */
  if (ageInput) {
    ageInput.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9]/g, ''); // Solo números
      this.value = this.value.toUpperCase();          // Convertir a mayúsculas (no afecta números)
    });
  }

  // ===================================================================
  // CONTADOR DE CARACTERES PARA COMENTARIOS
  // ===================================================================
  
  /**
   * CONFIGURAR CONTADOR DE CARACTERES
   * Actualiza el contador en tiempo real y cambia color si excede el límite
   */
  if (commentsInput && commentsCounter) {
    commentsInput.addEventListener('input', function() {
      const currentLength = this.value.length;
      commentsCounter.textContent = `${currentLength} / 2000 caracteres`;
      
      // Cambiar color si excede el límite
      if (currentLength > 2000) {
        commentsCounter.style.color = '#d93025';  // Rojo
      } else {
        commentsCounter.style.color = '#666';     // Gris normal
      }
    });
  }

  // ===================================================================
  // FUNCIONALIDAD DE MOSTRAR/OCULTAR CONTRASEÑAS
  // ===================================================================
  
  /**
   * CONFIGURAR TOGGLE DE CONTRASEÑA
   * Función reutilizable para configurar botones de mostrar/ocultar
   * 
   * @param {HTMLElement} inputElement - Campo de contraseña
   * @param {HTMLElement} buttonElement - Botón de toggle
   */
  function setupPasswordToggle(inputElement, buttonElement) {
    if (inputElement && buttonElement) {
      buttonElement.addEventListener('click', function(e) {
        e.preventDefault();      // Prevenir envío del formulario
        e.stopPropagation();     // Prevenir propagación del evento
        
        // Alternar tipo de input y emoji del botón
        if (inputElement.type === 'password') {
          inputElement.type = 'text';           // Mostrar contraseña
          buttonElement.textContent = '🙈';     // Cambiar emoji
        } else {
          inputElement.type = 'password';       // Ocultar contraseña
          buttonElement.textContent = '👁️';     // Cambiar emoji
        }
      });
    }
  }

  // Configurar ambos toggles de contraseña
  setupPasswordToggle(passwordInput, togglePassword);
  setupPasswordToggle(passwordConfirmInput, togglePasswordConfirm);

  // ===================================================================
  // FUNCIÓN PRINCIPAL DE VALIDACIÓN DEL FORMULARIO
  // ===================================================================
  
  /**
   * VALIDAR TODO EL FORMULARIO
   * Ejecuta todas las validaciones y retorna si el formulario es válido
   * 
   * @returns {boolean} - true si todas las validaciones pasan
   */
  function validateForm() {
    let isValid = true; // Bandera para acumular el resultado de todas las validaciones

    /**
     * VALIDACIÓN DEL NOMBRE
     * Verifica que no esté vacío y solo contenga letras y espacios
     */
    const nameValue = nameInput.value.trim();
    if (!nameValue) {
      showError('name', 'El nombre es obligatorio.');
      isValid = false;
    } else if (!/^[A-ZÁÉÍÓÚÑ\s]+$/.test(nameValue)) {
      // Regex que solo permite letras (incluye acentos) y espacios
      showError('name', 'Solo se permiten letras y espacios.');
      isValid = false;
    } else {
      hideError('name'); // Limpiar error si es válido
    }

    /**
     * VALIDACIÓN DEL EMAIL CON API
     * Verifica formato y existencia real del email
     */
    const emailValue = emailInput.value.trim();
    if (!emailValue) {
      showError('email', 'El correo electrónico es obligatorio.');
      isValid = false;
    } else if (emailValidationState.isValidating) {
      // Si aún está validando, no permitir envío
      showError('email', 'Esperando validación de email...');
      isValid = false;
    } else if (!emailValidationState.isValid) {
      // Si la validación de API falló
      showError('email', 'Por favor ingresa un email válido y existente.');
      isValid = false;
    } else {
      hideError('email'); // Email válido
    }

    /**
     * VALIDACIÓN DE CONFIRMACIÓN DE EMAIL
     * Verifica que coincida exactamente con el email principal
     */
    const emailConfirmValue = emailConfirmInput.value.trim();
    if (!emailConfirmValue) {
      showError('emailConfirm', 'La confirmación de correo es obligatoria.');
      isValid = false;
    } else if (emailConfirmValue !== emailValue) {
      showError('emailConfirm', 'Los correos electrónicos no coinciden.');
      isValid = false;
    } else {
      hideError('emailConfirm');
    }

    /**
     * VALIDACIÓN DE CONTRASEÑA CON SISTEMA DE FORTALEZA
     * Usa el sistema de puntuación de fortaleza implementado
     */
    const passwordValue = passwordInput.value;
    if (!passwordValue) {
      showError('password', 'La contraseña es obligatoria.');
      isValid = false;
    } else {
      const strength = calculatePasswordStrength(passwordValue);
      // Requiere al menos nivel "Regular" (score >= 3)
      if (strength.score < 3) {
        showError('password', 'La contraseña debe ser al menos "Regular". Cumple más requisitos.');
        isValid = false;
      } else {
        hideError('password');
      }
    }

    /**
     * VALIDACIÓN DE CONFIRMACIÓN DE CONTRASEÑA
     * Verifica que coincida exactamente con la contraseña principal
     */
    const passwordConfirmValue = passwordConfirmInput.value;
    if (!passwordConfirmValue) {
      showError('passwordConfirm', 'La confirmación de contraseña es obligatoria.');
      isValid = false;
    } else if (passwordConfirmValue !== passwordValue) {
      showError('passwordConfirm', 'Las contraseñas no coinciden.');
      isValid = false;
    } else {
      hideError('passwordConfirm');
    }

    /**
     * VALIDACIÓN DE EDAD
     * Verifica que sea un número entre 1 y 120
     */
    const ageValue = parseInt(ageInput.value);
    if (!ageInput.value) {
      showError('age', 'La edad es obligatoria.');
      isValid = false;
    } else if (isNaN(ageValue) || ageValue < 1 || ageValue > 120) {
      showError('age', 'La edad debe estar entre 1 y 120 años.');
      isValid = false;
    } else {
      hideError('age');
    }

    /**
     * VALIDACIÓN DE FECHA DE NACIMIENTO
     * Verifica que no esté vacía y no sea una fecha futura
     */
    const birthdateValue = birthdateInput.value;
    if (!birthdateValue) {
      showError('birthdate', 'La fecha de nacimiento es obligatoria.');
      isValid = false;
    } else {
      const birthDate = new Date(birthdateValue);
      const today = new Date();
      if (birthDate > today) {
        showError('birthdate', 'La fecha de nacimiento no puede ser futura.');
        isValid = false;
      } else {
        hideError('birthdate');
      }
    }

    /**
     * VALIDACIÓN DE COMENTARIOS (OPCIONAL)
     * Solo verifica que no exceda el límite de caracteres
     */
    const commentsValue = commentsInput.value;
    if (commentsValue.length > 2000) {
      showError('comments', 'Los comentarios no pueden exceder 2000 caracteres.');
      isValid = false;
    } else {
      hideError('comments');
    }

    return isValid; // Retorna true solo si todas las validaciones pasaron
  }

  // ===================================================================
  // MANEJO DEL ENVÍO DEL FORMULARIO
  // ===================================================================
  
  /**
   * EVENT LISTENER PARA ENVÍO DEL FORMULARIO
   * Maneja todo el proceso de validación y envío
   */
  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir envío normal del formulario
    
    console.log('Formulario enviado - iniciando validación');
    
    // Limpiar todos los mensajes globales previos
    hideAllMessages();
    
    /**
     * EJECUTAR VALIDACIÓN COMPLETA
     * Si alguna validación falla, detener el proceso
     */
    if (!validateForm()) {
      console.log('Validación fallida');
      return; // Salir si hay errores de validación
    }
    
    console.log('Validación exitosa - enviando email');
    
    /**
     * CONFIGURAR UI PARA ESTADO DE ENVÍO
     * Mostrar indicadores de que el envío está en progreso
     */
    sendingMessage.style.display = 'block';    // Mostrar mensaje "Enviando..."
    submitBtn.disabled = true;                 // Deshabilitar botón
    submitBtn.textContent = 'Enviando...';     // Cambiar texto del botón
    
    /**
     * ENVIAR EMAIL CON EMAILJS
     * Usa el servicio EmailJS para enviar el formulario por email
     */
    emailjs.sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, form)
      .then(function(response) {
        // ===== CASO DE ÉXITO =====
        console.log('Email enviado exitosamente:', response);
        
        // Ocultar mensaje de envío
        sendingMessage.style.display = 'none';
        
        // Mostrar mensaje de éxito
        successMessage.style.display = 'block';
        
        /**
         * LIMPIAR Y RESETEAR FORMULARIO
         * Volver todo a su estado inicial
         */
        form.reset(); // Limpiar todos los campos
        
        // Resetear contador de comentarios
        if (commentsCounter) {
          commentsCounter.textContent = '0 / 2000 caracteres';
        }
        
        // Ocultar y resetear indicador de contraseña
        passwordStrength.style.display = 'none';
        passwordStrength.classList.remove('show');
        
        // Resetear estado de validación de email
        emailValidationState = {
          isValidating: false,
          isValid: false,
          message: '',
          lastValidatedEmail: ''
        };
        
        // Restaurar botón a su estado normal
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar información';
        
        /**
         * REDIRECCIÓN AUTOMÁTICA
         * Redirige a página de agradecimiento después de 3 segundos
         */
        setTimeout(function() {
          window.location.href = 'gracias.html';
        }, 3000);
        
      })
      .catch(function(error) {
        // ===== CASO DE ERROR =====
        console.error('Error al enviar email:', error);
        
        // Ocultar mensaje de envío
        sendingMessage.style.display = 'none';
        
        // Mostrar mensaje de error global
        errorMessage.style.display = 'block';
        
        // Restaurar botón para permitir reintento
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar información';
      });
  });

  // ===================================================================
  // INICIALIZACIÓN FINAL
  // ===================================================================
  
  /**
   * INICIALIZAR VALIDACIÓN DE EMAIL
   * Configura todos los event listeners para validación en tiempo real
   */
  setupEmailValidation();

  /**
   * LOG DE CONFIRMACIÓN
   * Indica que el script se inicializó correctamente
   */
  console.log('Script inicializado correctamente con validación de email e indicador de contraseña');

}); // Fin del event listener DOMContentLoaded

// ===================================================================
// RESUMEN DE FUNCIONALIDADES IMPLEMENTADAS
// ===================================================================

/**
 * CARACTERÍSTICAS PRINCIPALES DEL FORMULARIO:
 * 
 * 1. VALIDACIÓN DE EMAIL EN TIEMPO REAL:
 *    - Validación de formato RFC 5322
 *    - Detección de errores de tipeo en dominios comunes
 *    - Verificación de existencia real del email con API
 *    - Sugerencias automáticas de corrección
 * 
 * 2. MEDIDOR DE FORTALEZA DE CONTRASEÑA:
 *    - Análisis de 6 criterios de seguridad
 *    - Indicador visual con colores y texto
 *    - Detección de contraseñas comunes
 *    - Feedback inmediato mientras se escribe
 * 
 * 3. VALIDACIONES ROBUSTAS:
 *    - Validación en tiempo real de todos los campos
 *    - Mensajes de error específicos y claros
 *    - Prevención de envío con datos inválidos
 * 
 * 4. EXPERIENCIA DE USUARIO:
 *    - Autocompletado y formateo automático
 *    - Contador de caracteres para comentarios
 *    - Botones para mostrar/ocultar contraseñas
 *    - Feedback visual inmediato
 * 
 * 5. ENVÍO SEGURO:
 *    - Integración con EmailJS para envío sin backend
 *    - Manejo de estados de carga y error
 *    - Redirección automática tras éxito
 *    - Limpieza automática del formulario
 * 
 * 6. ACCESIBILIDAD:
 *    - Etiquetas aria para lectores de pantalla
 *    - Mensajes de error asociados a campos
 *    - Navegación por teclado funcional
 *    - Colores y contrastes apropiados
 */
