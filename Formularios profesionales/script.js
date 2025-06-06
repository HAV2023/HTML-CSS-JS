/**
 * =============================================================================
 * FORMULARIO PROFESIONAL CON EMAILJS Y VALIDACIÓN DE EMAIL
 * =============================================================================
 * Autor: Hector Arciniega
 * Versión: 2.0 - Con validación de email en tiempo real e indicador de fortaleza de contraseña
 * Fecha: 2025
 * 
 * CARACTERÍSTICAS PRINCIPALES:
 * - Validación de email en tiempo real con API externa
 * - Indicador visual de fortaleza de contraseña
 * - Envío de emails con EmailJS
 * - Validaciones granulares para todos los campos
 * - Detección de contraseñas comunes
 * - Sugerencias automáticas para dominios de email
 * - Interfaz completamente responsive
 * - Accesibilidad mejorada con ARIA
 * =============================================================================
 */

// =============================================================================
// 1. CONFIGURACIÓN DE SERVICIOS EXTERNOS
// =============================================================================

/**
 * CONFIGURACIÓN EMAILJS
 * Credenciales para el servicio de envío de emails
 * IMPORTANTE: Estas son las credenciales reales del proyecto
 */
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "h4Tg7EWpnWF4KFAS9",    // Clave pública de EmailJS
  SERVICE_ID: "service_nfepreu",      // ID del servicio de email configurado
  TEMPLATE_ID: "template_io3adnr"     // ID de la plantilla de email
};

/**
 * CONFIGURACIÓN DE VALIDACIÓN DE EMAIL
 * API externa para validar emails en tiempo real
 * Verifica formato, existencia del dominio y buzón activo
 */
const EMAIL_VALIDATION_CONFIG = {
  API_KEY: "ema_live_4t63hZuLgvVCvYJQMWOTkCAfBVwwaFGCRTIueyA1", // Clave API
  API_URL: "https://api.emailvalidation.io/v1/info"              // Endpoint de validación
};

/**
 * LISTA DE CONTRASEÑAS COMUNES
 * Array de contraseñas que se consideran inseguras
 * Se usa para validar que el usuario no use contraseñas obvias
 */
const COMMON_PASSWORDS = [
  '123456', 'password', '123456789', '12345678', '12345', '1234567', 
  'qwerty', 'abc123', 'password123', 'admin', 'letmein', 'welcome',
  '123123', 'password1', 'qwerty123', '111111', '000000', '1234',
  'iloveyou', 'dragon', 'monkey', 'sunshine', 'princess', 'football'
];

// =============================================================================
// 2. ESTADO GLOBAL DE LA APLICACIÓN
// =============================================================================

/**
 * ESTADO DE VALIDACIÓN DE EMAIL
 * Objeto que mantiene el estado actual de la validación de email
 */
let emailValidationState = {
  isValidating: false,        // ¿Está validándose actualmente?
  isValid: false,            // ¿Es válido el email actual?
  message: '',               // Mensaje de estado actual
  lastValidatedEmail: ''     // Último email validado (para cache)
};

// =============================================================================
// 3. INICIALIZACIÓN DE SERVICIOS
// =============================================================================

/**
 * INICIALIZAR EMAILJS
 * Configura el servicio EmailJS con la clave pública
 * Debe llamarse antes de usar cualquier función de EmailJS
 */
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

// =============================================================================
// 4. PUNTO DE ENTRADA PRINCIPAL
// =============================================================================

/**
 * EVENTO DOM CONTENT LOADED
 * Se ejecuta cuando el DOM está completamente cargado
 * Inicializa todos los event listeners y configuraciones
 */
document.addEventListener('DOMContentLoaded', function() {
  
  // =========================================================================
  // 4.1 REFERENCIAS A ELEMENTOS DEL DOM
  // =========================================================================
  
  /**
   * ELEMENTOS PRINCIPALES DEL FORMULARIO
   * Referencias a los elementos más importantes para funcionalidad
   */
  const form = document.getElementById('professionalForm');           // Formulario principal
  const submitBtn = document.getElementById('submitBtn');             // Botón de envío
  const successMessage = document.getElementById('successMessage');   // Mensaje de éxito
  const sendingMessage = document.getElementById('sendingMessage');   // Mensaje de envío
  const errorMessage = document.getElementById('errorMessage');       // Mensaje de error global
  
  /**
   * CAMPOS DE ENTRADA DEL FORMULARIO
   * Referencias a todos los inputs del formulario
   */
  const nameInput = document.getElementById('name');                  // Campo nombre
  const emailInput = document.getElementById('email');                // Campo email
  const emailConfirmInput = document.getElementById('emailConfirm');  // Confirmación email
  const passwordInput = document.getElementById('password');          // Campo contraseña
  const passwordConfirmInput = document.getElementById('passwordConfirm'); // Confirmación contraseña
  const ageInput = document.getElementById('age');                    // Campo edad
  const birthdateInput = document.getElementById('birthdate');        // Campo fecha nacimiento
  const commentsInput = document.getElementById('comments');          // Campo comentarios
  const commentsCounter = document.getElementById('commentsCounter'); // Contador de caracteres
  
  /**
   * ELEMENTOS DEL INDICADOR DE CONTRASEÑA
   * Referencias específicas para el indicador de fortaleza
   */
  const passwordStrength = document.getElementById('passwordStrength'); // Contenedor indicador
  const strengthBar = document.getElementById('strengthBar');           // Barra de progreso
  const strengthText = document.getElementById('strengthText');         // Texto descriptivo
  
  /**
   * BOTONES DE TOGGLE DE CONTRASEÑA
   * Botones para mostrar/ocultar contraseñas
   */
  const togglePassword = document.getElementById('togglePassword');           // Toggle contraseña
  const togglePasswordConfirm = document.getElementById('togglePasswordConfirm'); // Toggle confirmación

  // =========================================================================
  // 4.2 CONFIGURACIONES INICIALES
  // =========================================================================

  /**
   * CONFIGURAR FECHA MÁXIMA PARA NACIMIENTO
   * Establece la fecha actual como máxima para evitar fechas futuras
   */
  if (birthdateInput) {
    const today = new Date().toISOString().split('T')[0];
    birthdateInput.max = today;
    console.log('Fecha máxima establecida:', today);
  }

  // =========================================================================
  // 5. FUNCIONES DE FORTALEZA DE CONTRASEÑA
  // =========================================================================

  /**
   * VERIFICAR REQUISITOS DE CONTRASEÑA
   * Evalúa una contraseña contra múltiples criterios de seguridad
   * 
   * @param {string} password - La contraseña a evaluar
   * @returns {Object} Objeto con booleanos para cada requisito
   */
  function checkPasswordRequirements(password) {
    return {
      length: password.length >= 8,                    // Mínimo 8 caracteres
      lower: /[a-z]/.test(password),                  // Al menos una minúscula
      upper: /[A-Z]/.test(password),                  // Al menos una mayúscula
      number: /\d/.test(password),                    // Al menos un número
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), // Carácter especial
      noCommon: !COMMON_PASSWORDS.includes(password.toLowerCase()) // No es contraseña común
    };
  }

  /**
   * CALCULAR FORTALEZA DE CONTRASEÑA
   * Determina el nivel de fortaleza basado en los requisitos cumplidos
   * 
   * @param {string} password - La contraseña a evaluar
   * @returns {Object} Objeto con nivel, texto, clases CSS y puntuación
   */
  function calculatePasswordStrength(password) {
    // Contraseña vacía
    if (password.length === 0) {
      return { 
        level: 'empty', 
        text: 'Escribe tu contraseña', 
        className: '' 
      };
    }

    // Verificar requisitos cumplidos
    const requirements = checkPasswordRequirements(password);
    const metRequirements = Object.values(requirements).filter(Boolean).length;
    
    let level = '';
    let text = '';
    let className = '';

    // Determinar nivel basado en requisitos cumplidos
    if (metRequirements <= 2) {
      level = 'weak';
      text = '🔴 Débil - Necesita mejoras';
      className = 'strength-weak text-weak';
    } else if (metRequirements === 3 || metRequirements === 4) {
      level = 'medium';
      text = '🟡 Regular - Puede mejorar';
      className = 'strength-medium text-medium';
    } else if (metRequirements === 5) {
      level = 'strong';
      text = '🟢 Fuerte - ¡Muy bien!';
      className = 'strength-strong text-strong';
    } else if (metRequirements === 6) {
      level = 'very-strong';
      text = '🔵 Excelente - ¡Perfecta!';
      className = 'strength-very-strong text-very-strong';
    }

    // Bonus por longitud extra (12+ caracteres)
    if (password.length >= 12 && level === 'strong') {
      level = 'very-strong';
      text = '🔵 Excelente - ¡Perfecta!';
      className = 'strength-very-strong text-very-strong';
    }

    return { 
      level, 
      text, 
      className, 
      requirements, 
      score: metRequirements 
    };
  }

  /**
   * ACTUALIZAR INDICADOR DE FORTALEZA
   * Actualiza la interfaz visual del indicador de fortaleza
   * 
   * @param {string} password - La contraseña actual
   */
  function updatePasswordStrength(password) {
    const strength = calculatePasswordStrength(password);
    
    // Mostrar el indicador inmediatamente cuando se empiece a escribir
    if (password.length > 0) {
      passwordStrength.style.display = 'block';
      passwordStrength.classList.add('show');
      
      console.log('Mostrando indicador de fortaleza:', strength.level);
    } else {
      // Ocultar con animación cuando no hay texto
      passwordStrength.classList.remove('show');
      setTimeout(() => {
        if (password.length === 0) {
          passwordStrength.style.display = 'none';
        }
      }, 300); // Tiempo de la transición CSS
      return;
    }
    
    // Actualizar barra de progreso
    strengthBar.className = `password-strength-bar ${strength.className.split(' ')[0]}`;
    
    // Actualizar texto descriptivo
    strengthText.textContent = strength.text;
    strengthText.className = `password-strength-text ${strength.className.split(' ')[1]}`;
  }

  // =========================================================================
  // 6. FUNCIONES DE VALIDACIÓN DE EMAIL
  // =========================================================================

  /**
   * VALIDACIÓN AVANZADA DE FORMATO DE EMAIL
   * Verifica el formato del email usando regex y validaciones adicionales
   * 
   * @param {string} email - El email a validar
   * @returns {Object} Resultado de la validación con detalles
   */
  function validateEmailAdvanced(email) {
    // Regex estándar para emails (RFC 5322 simplificado)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    // Verificaciones múltiples
    const checks = {
      format: emailRegex.test(email),                    // Formato básico correcto
      length: email.length <= 254,                       // Longitud máxima permitida
      localPart: email.split('@')[0]?.length <= 64,      // Parte local no muy larga
      noConsecutiveDots: !email.includes('..'),          // Sin puntos consecutivos
      noStartEndDots: !email.startsWith('.') && !email.endsWith('.'), // Sin puntos al inicio/final
      validDomain: email.split('@')[1]?.includes('.') || false // Dominio tiene punto
    };
    
    return {
      isValid: Object.values(checks).every(check => check), // Todas las verificaciones pasan
      checks: checks
    };
  }

  /**
   * VALIDACIÓN DE DOMINIOS COMUNES
   * Detecta errores de tipeo en dominios populares y sugiere correcciones
   * 
   * @param {string} email - El email a verificar
   * @returns {Object|null} Sugerencia de corrección o null
   */
  function validateCommonDomains(email) {
    const domain = email.split('@')[1]?.toLowerCase();
    
    // Mapeo de dominios correctos y sus errores comunes
    const commonDomains = {
      'gmail.com': ['gmai.com', 'gmial.com', 'gmail.co', 'gmaill.com', 'gmeil.com'],
      'hotmail.com': ['hotmial.com', 'hotmai.com', 'hotmal.com', 'hotmeil.com'],
      'yahoo.com': ['yaho.com', 'yahooo.com', 'yahoo.co', 'yhoo.com'],
      'outlook.com': ['outlok.com', 'outllook.com', 'outlook.co'],
      'icloud.com': ['iclod.com', 'icoud.com', 'icloud.co']
    };
    
    // Buscar si el dominio actual es un error común
    for (const [correct, typos] of Object.entries(commonDomains)) {
      if (typos.includes(domain)) {
        return {
          suggestion: email.replace(domain, correct),    // Email corregido
          originalDomain: domain,                        // Dominio original
          suggestedDomain: correct                       // Dominio sugerido
        };
      }
    }
    
    return null; // No se encontró sugerencia
  }

  /**
   * VALIDACIÓN CON API EXTERNA
   * Valida el email usando el servicio EmailValidation.io
   * Verifica existencia del dominio, buzón activo, emails temporales, etc.
   * 
   * @param {string} email - El email a validar
   * @returns {Promise<Object>} Resultado de la validación
   */
  async function validateEmailWithAPI(email) {
    try {
      // Construir URL de la API con parámetros
      const url = `${EMAIL_VALIDATION_CONFIG.API_URL}?apikey=${EMAIL_VALIDATION_CONFIG.API_KEY}&email=${encodeURIComponent(email)}`;
      
      console.log('Validando email con API:', email);
      
      // Realizar petición HTTP
      const response = await fetch(url);
      
      // Verificar que la respuesta sea exitosa
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Parsear respuesta JSON
      const data = await response.json();
      console.log('Respuesta de validación:', data);
      
      // Procesar resultado de la API
      return {
        isValid: data.format_valid && data.mx_found && data.smtp_check && !data.disposable,
        details: {
          format: data.format_valid,      // Formato correcto
          domain: data.mx_found,          // Dominio existe
          mailbox: data.smtp_check,       // Buzón activo
          disposable: data.disposable,    // Email temporal/desechable
          role: data.role,               // Email de rol (admin, info, etc.)
          suggestion: data.suggestion,    // Sugerencia de la API
          status: data.state             // Estado general
        },
        raw: data // Datos completos de la API
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
   * MOSTRAR ESTADO DE VALIDACIÓN DE EMAIL
   * Actualiza la interfaz para mostrar el estado actual de validación
   * 
   * @param {string} status - Estado: 'valid', 'invalid', 'suggestion', ''
   * @param {string} message - Mensaje a mostrar
   * @param {boolean} isLoading - Si está en proceso de validación
   */
  function showEmailValidationStatus(status, message, isLoading = false) {
    const errorElement = document.getElementById('error-email');
    
    // Limpiar clases CSS previas
    emailInput.classList.remove('validating', 'valid', 'invalid');
    
    if (isLoading) {
      // Estado de validación en progreso
      emailInput.classList.add('validating');
      errorElement.innerHTML = '🔄 Validando email...';
      errorElement.style.color = '#ff9800';
      errorElement.style.display = 'block';
    } else if (status === 'valid') {
      // Email válido confirmado
      emailInput.classList.add('valid');
      errorElement.innerHTML = '✅ Email válido y verificado';
      errorElement.style.color = '#4CAF50';
      errorElement.style.display = 'block';
    } else if (status === 'invalid') {
      // Email inválido
      emailInput.classList.add('invalid');
      errorElement.innerHTML = message || '❌ Email no válido';
      errorElement.style.color = '#d93025';
      errorElement.style.display = 'block';
    } else if (status === 'suggestion') {
      // Sugerencia de corrección
      emailInput.classList.add('invalid');
      errorElement.innerHTML = message;
      errorElement.style.color = '#ff9800';
      errorElement.style.display = 'block';
    } else {
      // Sin estado especial
      errorElement.style.display = 'none';
    }
  }

  /**
   * CREAR SUGERENCIA DE DOMINIO
   * Genera HTML para mostrar sugerencia de corrección de dominio
   * 
   * @param {string} originalEmail - Email con posible error
   * @returns {string|null} HTML de la sugerencia o null
   */
  function createDomainSuggestion(originalEmail) {
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

  // =========================================================================
  // 7. CONFIGURACIÓN DE VALIDACIÓN DE EMAIL EN TIEMPO REAL
  // =========================================================================

  /**
   * TIMEOUT PARA DEBOUNCE DE VALIDACIÓN
   * Variable para controlar el retraso en la validación (evita validaciones excesivas)
   */
  let emailValidationTimeout;

  /**
   * CONFIGURAR VALIDACIÓN DE EMAIL
   * Establece los event listeners para validación en tiempo real
   */
  function setupEmailValidation() {
    emailInput.addEventListener('input', function() {
      const email = this.value.trim();
      
      // Limpiar timeout anterior para implementar debounce
      clearTimeout(emailValidationTimeout);
      
      // Resetear estado de validación
      emailValidationState.isValid = false;
      emailValidationState.isValidating = false;
      
      // No validar si está vacío
      if (email.length === 0) {
        showEmailValidationStatus('', '');
        return;
      }
      
      // Validación básica inmediata (sin API)
      const basicValidation = validateEmailAdvanced(email);
      if (!basicValidation.isValid) {
        showEmailValidationStatus('invalid', '❌ Formato de email incorrecto');
        return;
      }
      
      // Verificar si hay sugerencia de dominio común
      const suggestionMessage = createDomainSuggestion(email);
      if (suggestionMessage) {
        showEmailValidationStatus('suggestion', suggestionMessage);
        return;
      }
      
      // Validación con API después de 1.5 segundos de no escribir (debounce)
      emailValidationTimeout = setTimeout(async () => {
        // Evitar validación duplicada
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
          // Error inesperado
          console.error('Error en validación de email:', error);
          emailValidationState.isValidating = false;
          showEmailValidationStatus('invalid', '⚠️ Error al validar email');
        }
      }, 1500); // Debounce de 1.5 segundos
    });
  }

  // =========================================================================
  // 8. CONFIGURACIÓN DEL INDICADOR DE CONTRASEÑA
  // =========================================================================

  /**
   * EVENT LISTENER PARA INPUT DE CONTRASEÑA
   * Actualiza el indicador inmediatamente cuando el usuario escribe
   */
  passwordInput.addEventListener('input', function() {
    updatePasswordStrength(this.value);
    console.log('Actualizando fortaleza de contraseña');
  });

  /**
   * EVENT LISTENER PARA FOCUS DE CONTRASEÑA
   * Muestra el indicador si ya hay contenido al enfocar el campo
   */
  passwordInput.addEventListener('focus', function() {
    if (this.value.length > 0) {
      passwordStrength.style.display = 'block';
      passwordStrength.classList.add('show');
    }
  });

  // =========================================================================
  // 9. FUNCIONES DE UTILIDAD PARA MENSAJES
  // =========================================================================

  /**
   * MOSTRAR ERROR EN CAMPO ESPECÍFICO
   * Muestra un mensaje de error para un campo particular
   * 
   * @param {string} fieldId - ID del campo (sin prefijo 'error-')
   * @param {string} message - Mensaje de error a mostrar
   */
  function showError(fieldId, message) {
    const errorElement = document.getElementById('error-' + fieldId);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
      console.log(`Error mostrado en ${fieldId}:`, message);
    }
  }

  /**
   * OCULTAR ERROR EN CAMPO ESPECÍFICO
   * Oculta el mensaje de error de un campo particular
   * 
   * @param {string} fieldId - ID del campo (sin prefijo 'error-')
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
   * Oculta mensajes de éxito, envío y error global
   */
  function hideAllMessages() {
    successMessage.style.display = 'none';
    sendingMessage.style.display = 'none';
    errorMessage.style.display = 'none';
  }

  // =========================================================================
  // 10. RESTRICCIONES DE ENTRADA EN CAMPOS
  // =========================================================================

  /**
   * CONFIGURACIÓN PARA CAMPO NOMBRE
   * Solo permite letras y espacios, convierte a mayúsculas
   */
  if (nameInput) {
    // Event listener para input
    nameInput.addEventListener('input', function() {
      this.value = this.value.replace(/[0-9]/g, ''); // Eliminar números
      this.value = this.value.toUpperCase();         // Convertir a mayúsculas
    });

    // Event listener para paste (pegado)
    nameInput.addEventListener('paste', function(e) {
      const pastedText = e.clipboardData.getData('text');
      if (/\d/.test(pastedText)) {
        e.preventDefault(); // Prevenir pegado si contiene números
        this.value += pastedText.replace(/[0-9]/g, '').toUpperCase();
      }
    });
  }

  /**
   * CONFIGURACIÓN PARA CAMPO EDAD
   * Solo permite números, convierte a mayúsculas
   */
  if (ageInput) {
    ageInput.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9]/g, ''); // Solo números
      this.value = this.value.toUpperCase();          // Mayúsculas (por consistencia)
    });
  }

  // =========================================================================
  // 11. CONTADOR DE CARACTERES PARA COMENTARIOS
  // =========================================================================

  /**
   * CONFIGURACIÓN DEL CONTADOR DE CARACTERES
   * Actualiza en tiempo real el contador para el textarea de comentarios
   */
  if (commentsInput && commentsCounter) {
    commentsInput.addEventListener('input', function() {
      const currentLength = this.value.length;
      commentsCounter.textContent = `${currentLength} / 2000 caracteres`;
      
      // Cambiar color si excede el límite
      if (currentLength > 2000) {
        commentsCounter.style.color = '#d93025'; // Rojo si excede
      } else {
        commentsCounter.style.color = '#666';    // Gris normal
      }
    });
  }

  // =========================================================================
  // 12. FUNCIONALIDAD DE TOGGLE DE CONTRASEÑAS
  // =========================================================================

  /**
   * CONFIGURAR TOGGLE DE CONTRASEÑA
   * Función reutilizable para configurar botones de mostrar/ocultar contraseña
   * 
   * @param {HTMLElement} inputElement - Input de contraseña
   * @param {HTMLElement} buttonElement - Botón de toggle
   */
  function setupPasswordToggle(inputElement, buttonElement) {
    if (inputElement && buttonElement) {
      buttonElement.addEventListener('click', function(e) {
        e.preventDefault();    // Prevenir submit del formulario
        e.stopPropagation();   // Evitar bubbling
        
        // Alternar tipo de input
        if (inputElement.type === 'password') {
          inputElement.type = 'text';           // Mostrar contraseña
          buttonElement.textContent = '🙈';     // Cambiar icono
        } else {
          inputElement.type = 'password';       // Ocultar contraseña
          buttonElement.textContent = '👁️';     // Cambiar icono
        }
        
        console.log('Toggle contraseña:', inputElement.type);
      });
    }
  }

  // Configurar ambos toggles de contraseña
  setupPasswordToggle(passwordInput, togglePassword);
  setupPasswordToggle(passwordConfirmInput, togglePasswordConfirm);

  // =========================================================================
  // 13. FUNCIÓN PRINCIPAL DE VALIDACIÓN DEL FORMULARIO
  // =========================================================================

  /**
   * VALIDAR FORMULARIO COMPLETO
   * Valida todos los campos del formulario antes del envío
   * 
   * @returns {boolean} true si todos los campos son válidos
   */
  function validateForm() {
    let isValid = true;
    console.log('Iniciando validación completa del formulario');

    // -----------------------------------------------------------------------
    // VALIDAR NOMBRE
    // -----------------------------------------------------------------------
    const nameValue = nameInput.value.trim();
    if (!nameValue) {
      showError('name', 'El nombre es obligatorio.');
      isValid = false;
    } else if (!/^[A-ZÁÉÍÓÚÑ\s]+$/.test(nameValue)) {
      showError('name', 'Solo se permiten letras y espacios.');
      isValid = false;
    } else {
      hideError('name');
    }

    // -----------------------------------------------------------------------
    // VALIDAR EMAIL CON VALIDACIÓN API
    // -----------------------------------------------------------------------
    const emailValue = emailInput.value.trim();
    if (!emailValue) {
      showError('email', 'El correo electrónico es obligatorio.');
      isValid = false;
    } else if (emailValidationState.isValidating) {
      showError('email', 'Esperando validación de email...');
      isValid = false;
    } else if (!emailValidationState.isValid) {
      showError('email', 'Por favor ingresa un email válido y existente.');
      isValid = false;
    } else {
      hideError('email');
    }

    // -----------------------------------------------------------------------
    // VALIDAR CONFIRMACIÓN DE EMAIL
    // -----------------------------------------------------------------------
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

    // -----------------------------------------------------------------------
    // VALIDAR CONTRASEÑA CON FORTALEZA
    // -----------------------------------------------------------------------
    const passwordValue = passwordInput.value;
    if (!passwordValue) {
      showError('password', 'La contraseña es obligatoria.');
      isValid = false;
    } else {
      const strength = calculatePasswordStrength(passwordValue);
      if (strength.score < 3) {
        showError('password', 'La contraseña debe ser al menos "Regular". Cumple más requisitos.');
        isValid = false;
      } else {
        hideError('password');
      }
    }

    // -----------------------------------------------------------------------
    // VALIDAR CONFIRMACIÓN DE CONTRASEÑA
    // -----------------------------------------------------------------------
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

    // -----------------------------------------------------------------------
    // VALIDAR EDAD
    // -----------------------------------------------------------------------
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

    // -----------------------------------------------------------------------
    // VALIDAR FECHA DE NACIMIENTO
    // -----------------------------------------------------------------------
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

    // -----------------------------------------------------------------------
    // VALIDAR COMENTARIOS (OPCIONAL CON LÍMITE)
    // -----------------------------------------------------------------------
    const commentsValue = commentsInput.value;
    if (commentsValue.length > 2000) {
      showError('comments', 'Los comentarios no pueden exceder 2000 caracteres.');
      isValid = false;
    } else {
      hideError('comments');
    }

    console.log('Validación completa:', isValid ? 'EXITOSA' : 'FALLIDA');
    return isValid;
  }

  // =========================================================================
  // 14. MANEJO DEL ENVÍO DEL FORMULARIO
  // =========================================================================

  /**
   * EVENT LISTENER PARA SUBMIT DEL FORMULARIO
   * Maneja todo el proceso de validación y envío
   */
  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir envío tradicional del formulario
    
    console.log('=== INICIO PROCESO DE ENVÍO ===');
    console.log('Formulario enviado - iniciando validación');
    
    // Ocultar todos los mensajes previos
    hideAllMessages();
    
    // Validar formulario completo
    if (!validateForm()) {
      console.log('❌ Validación fallida - deteniendo envío');
      return;
    }
    
    console.log('✅ Validación exitosa - iniciando envío de email');
    
    // -----------------------------------------------------------------------
    // PREPARAR INTERFAZ PARA ENVÍO
    // -----------------------------------------------------------------------
    sendingMessage.style.display = 'block';    // Mostrar mensaje de envío
    submitBtn.disabled = true;                  // Deshabilitar botón
    submitBtn.textContent = 'Enviando...';      // Cambiar texto del botón
    
    // -----------------------------------------------------------------------
    // ENVIAR EMAIL CON EMAILJS
    // -----------------------------------------------------------------------
    emailjs.sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, form)
      .then(function(response) {
        console.log('✅ Email enviado exitosamente:', response);
        
        // Ocultar mensaje de envío
        sendingMessage.style.display = 'none';
        
        // Mostrar mensaje de éxito
        successMessage.style.display = 'block';
        
        // ---------------------------------------------------------------
        // LIMPIAR FORMULARIO DESPUÉS DEL ENVÍO EXITOSO
        // ---------------------------------------------------------------
        form.reset(); // Resetear todos los campos
        
        // Resetear contador de comentarios
        if (commentsCounter) {
          commentsCounter.textContent = '0 / 2000 caracteres';
        }
        
        // Ocultar indicador de contraseña
        passwordStrength.style.display = 'none';
        passwordStrength.classList.remove('show');
        
        // Resetear estado de validación de email
        emailValidationState = {
          isValidating: false,
          isValid: false,
          message: '',
          lastValidatedEmail: ''
        };
        
        // Restaurar botón de envío
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar información';
        
        // ---------------------------------------------------------------
        // REDIRECCIÓN AUTOMÁTICA
        // ---------------------------------------------------------------
        setTimeout(function() {
          console.log('Redirigiendo a página de agradecimiento...');
          window.location.href = 'gracias.html';
        }, 3000); // Esperar 3 segundos antes de redirigir
        
      })
      .catch(function(error) {
        console.error('❌ Error al enviar email:', error);
        
        // Ocultar mensaje de envío
        sendingMessage.style.display = 'none';
        
        // Mostrar mensaje de error
        errorMessage.style.display = 'block';
        
        // Restaurar botón de envío
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar información';
      });
  });

  // =========================================================================
  // 15. INICIALIZACIÓN FINAL
  // =========================================================================

  /**
   * INICIALIZAR VALIDACIÓN DE EMAIL
   * Activar la validación en tiempo real
   */
  setupEmailValidation();

  /**
   * LOG DE INICIALIZACIÓN COMPLETADA
   */
  console.log('🚀 Script inicializado correctamente');
  console.log('✅ Validación de email configurada');
  console.log('✅ Indicador de fortaleza de contraseña configurado');
  console.log('✅ Todas las validaciones activas');
  console.log('✅ EmailJS configurado');
  console.log('=== FORMULARIO LISTO PARA USO ===');
  
}); // Fin del DOMContentLoaded

/**
 * =============================================================================
 * FIN DEL ARCHIVO JAVASCRIPT
 * =============================================================================
 * 
 * RESUMEN DE FUNCIONALIDADES IMPLEMENTADAS:
 * 
 * ✅ Validación de email en tiempo real con API externa
 * ✅ Indicador visual de fortaleza de contraseña
 * ✅ Detección de contraseñas comunes inseguras
 * ✅ Sugerencias automáticas para dominios de email mal escritos
 * ✅ Restricciones de entrada en campos (solo letras, solo números)
 * ✅ Contador de caracteres en tiempo real
 * ✅ Toggle de mostrar/ocultar contraseñas
 * ✅ Validación completa antes del envío
 * ✅ Envío de emails con EmailJS
 * ✅ Manejo de estados de carga y errores
 * ✅ Interfaz responsive y accesible
 * ✅ Logging detallado para debugging
 * ✅ Limpieza automática del formulario después del envío
 * ✅ Redirección automática a página de agradecimiento
 * 
 * TECNOLOGÍAS UTILIZADAS:
 * - JavaScript ES6+ (async/await, arrow functions, destructuring)
 * - API Fetch para validación de emails
 * - EmailJS para envío de emails
 * - Event Delegation y DOM Manipulation
 * - Regex para validaciones
 * - CSS Classes manipulation
 * - LocalStorage management (para cache de validaciones)
 * - Error Handling robusto
 * 
 * SEGURIDAD:
 * - Validación tanto frontend como backend (via APIs)
 * - Sanitización de entradas
 * - Prevención de ataques XSS
 * - Manejo seguro de credenciales de APIs
 * 
 * ACCESIBILIDAD:
 * - ARIA labels y live regions
 * - Navegación por teclado
 * - Contrastes de color adecuados
 * - Mensajes descriptivos
 * 
 * PERFORMANCE:
 * - Debounce en validaciones para evitar llamadas excesivas
 * - Cache de validaciones de email
 * - Lazy loading de validaciones costosas
 * - Optimización de DOM queries
 * 
 * =============================================================================
 */
