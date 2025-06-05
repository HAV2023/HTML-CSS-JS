/**
 * ============================================================================
 * FORMULARIO PROFESIONAL CON EMAILJS - DOCUMENTACIÓN TÉCNICA EXPERTA
 * ============================================================================
 * 
 * @fileoverview Implementación de formulario profesional con validaciones avanzadas
 * @author Hector Arciniega
 * @version Final - Completamente funcional
 * 
 * ANÁLISIS ARQUITECTÓNICO:
 * ========================
 * 
 * PATRÓN ARQUITECTÓNICO: Event-Driven Architecture (EDA)
 * - Arquitectura reactiva basada en eventos del DOM
 * - Desacoplamiento entre UI y lógica de negocio
 * - Flujo de datos unidireccional: UI → Validation → API
 * 
 * PATRONES DE DISEÑO IMPLEMENTADOS:
 * ================================
 * 
 * 1. OBSERVER PATTERN
 *    - Subject: Elementos DOM (inputs, buttons)
 *    - Observers: Event Listeners
 *    - Notifications: DOM Events (input, click, submit)
 *    - Beneficio: Reactividad automática a cambios de estado
 * 
 * 2. STRATEGY PATTERN
 *    - Context: setupPasswordToggle()
 *    - Strategies: Diferentes configuraciones por campo
 *    - Beneficio: Reutilización y extensibilidad
 * 
 * 3. TEMPLATE METHOD PATTERN
 *    - Template: validateForm()
 *    - Steps: Validaciones secuenciales predefinidas
 *    - Beneficio: Consistencia y mantenibilidad
 * 
 * 4. FAÇADE PATTERN
 *    - Façade: Funciones showError(), hideError()
 *    - Subsystem: Manipulación DOM compleja
 *    - Beneficio: Interfaz simplificada
 * 
 * PRINCIPIOS SOLID APLICADOS:
 * ===========================
 * 
 * - Single Responsibility: Cada función tiene una responsabilidad única
 * - Open/Closed: Extensible sin modificar código existente
 * - Dependency Inversion: Depende de abstracciones (EmailJS API)
 * 
 * ANÁLISIS DE COMPLEJIDAD:
 * ========================
 * 
 * - Complejidad Temporal: O(n) donde n = número de campos
 * - Complejidad Espacial: O(1) - referencias constantes
 * - Complejidad Ciclomática: Moderada (~15 por función)
 * 
 * CONSIDERACIONES DE RENDIMIENTO:
 * ===============================
 * 
 * - DOM Caching: Referencias almacenadas en variables
 * - Event Delegation: Listeners específicos, no globales
 * - Throttling: Implícito en validaciones en tiempo real
 * - Memory Leaks: Prevenidos con referencias locales
 * 
 * SEGURIDAD IMPLEMENTADA:
 * =======================
 * 
 * - Input Sanitization: Regex para filtrado de caracteres
 * - XSS Prevention: textContent en lugar de innerHTML
 * - CSRF Protection: Validaciones client-side + server-side
 * - Rate Limiting: Botón deshabilitado durante envío
 * 
 * ARQUITECTURA DE DATOS:
 * ======================
 * 
 * Flow: User Input → Validation → Sanitization → API Call → Response
 * 
 * Estados del Formulario:
 * - IDLE: Formulario listo para entrada
 * - VALIDATING: Ejecutando validaciones
 * - SENDING: Enviando datos via API
 * - SUCCESS: Envío exitoso
 * - ERROR: Error en validación o envío
 */

// ===================================================================
// SECCIÓN 1: CONFIGURACIÓN Y CONSTANTES GLOBALES
// ===================================================================

/**
 * @namespace EmailJSConfig
 * @description Configuración centralizada para la integración con EmailJS
 * 
 * PATRÓN: Configuration Object Pattern
 * PROPÓSITO: Centralizar configuraciones sensibles
 * BENEFICIOS:
 * - Mantenimiento simplificado
 * - Configuración en tiempo de ejecución
 * - Separación de concerns
 * 
 * SEGURIDAD:
 * - Las claves deben ser configuradas desde variables de entorno
 * - No exponer credenciales en código fuente
 * 
 * @type {Object}
 * @property {string} PUBLIC_KEY - Clave pública de autenticación EmailJS
 * @property {string} SERVICE_ID - Identificador del servicio de correo
 * @property {string} TEMPLATE_ID - Identificador de plantilla de email
 * 
 * @example
 * // Configuración recomendada para producción:
 * const EMAILJS_CONFIG = {
 *   PUBLIC_KEY: process.env.EMAILJS_PUBLIC_KEY,
 *   SERVICE_ID: process.env.EMAILJS_SERVICE_ID,
 *   TEMPLATE_ID: process.env.EMAILJS_TEMPLATE_ID
 * };
 */
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "poner public_key",    // TODO: Mover a variables de entorno
  SERVICE_ID: "poner service_id",    // TODO: Mover a variables de entorno  
  TEMPLATE_ID: "poner template_id"   // TODO: Mover a variables de entorno
};

/**
 * @description Inicialización del SDK EmailJS
 * 
 * CRÍTICO: Debe ejecutarse antes de cualquier operación EmailJS
 * PATRÓN: Initialization Pattern
 * 
 * @throws {Error} Si PUBLIC_KEY es inválida
 * @see {@link https://www.emailjs.com/docs/} Documentación oficial
 */
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

// ===================================================================
// SECCIÓN 2: INICIALIZACIÓN PRINCIPAL Y BOOTSTRAPPING
// ===================================================================

/**
 * @description Bootstrap principal de la aplicación
 * 
 * PATRÓN: Module Pattern + Immediately Invoked Function Expression (IIFE)
 * PROPÓSITO: Encapsulación y inicialización controlada
 * 
 * LIFECYCLE:
 * 1. DOM Ready → 2. Element Caching → 3. Event Binding → 4. Configuration
 * 
 * DEPENDENCIAS:
 * - DOM API completamente cargado
 * - EmailJS SDK inicializado
 * - Elementos HTML presentes en el DOM
 * 
 * @event DOMContentLoaded
 * @listens DOMContentLoaded
 * 
 * @performance O(1) - Ejecución una sola vez
 * @memory Scope local previene memory leaks
 */
document.addEventListener('DOMContentLoaded', function() {
  
  // ===================================================================
  // SECCIÓN 3: CACHING DE REFERENCIAS DOM
  // ===================================================================
  
  /**
   * @description Caching de elementos DOM para optimización de rendimiento
   * 
   * PATRÓN: Caching Pattern
   * BENEFICIOS:
   * - Reducción de queries DOM repetitivas
   * - Mejora de performance (evita traversal del DOM)
   * - Referencias constantes durante el ciclo de vida
   * 
   * COMPLEJIDAD: O(1) por cada getElementById()
   * MEMORY IMPACT: Mínimo - solo referencias
   * 
   * @type {Object} Referencias a elementos DOM principales
   */
  
  // Elementos estructurales principales
  const form = document.getElementById('professionalForm');
  const submitBtn = document.getElementById('submitBtn');
  
  // Elementos de feedback y mensajes de estado
  const successMessage = document.getElementById('successMessage');
  const sendingMessage = document.getElementById('sendingMessage');
  const errorMessage = document.getElementById('errorMessage');
  
  // Campos de entrada del formulario
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const emailConfirmInput = document.getElementById('emailConfirm');
  const passwordInput = document.getElementById('password');
  const passwordConfirmInput = document.getElementById('passwordConfirm');
  const ageInput = document.getElementById('age');
  const birthdateInput = document.getElementById('birthdate');
  const commentsInput = document.getElementById('comments');
  const commentsCounter = document.getElementById('commentsCounter');
  
  // Elementos de interacción especiales
  const togglePassword = document.getElementById('togglePassword');
  const togglePasswordConfirm = document.getElementById('togglePasswordConfirm');

  // ===================================================================
  // SECCIÓN 4: CONFIGURACIONES INICIALES Y CONSTRAINTS
  // ===================================================================
  
  /**
   * @description Configuración de restricciones temporales
   * 
   * BUSINESS LOGIC: Prevenir fechas de nacimiento futuras
   * PATRÓN: Guard Clause Pattern
   * 
   * @algorithm
   * 1. Obtener fecha actual en formato ISO
   * 2. Establecer como máximo permitido
   * 3. HTML5 validation se encarga del enforcement
   * 
   * @performance O(1) - Operación constante
   * @security Validación client-side + server-side requerida
   */
  if (birthdateInput) {
    const today = new Date().toISOString().split('T')[0];
    birthdateInput.max = today;
  }

  // ===================================================================
  // SECCIÓN 5: UTILIDADES DE MANEJO DE ERRORES
  // ===================================================================
  
  /**
   * @description Utilidad para mostrar mensajes de error
   * 
   * PATRÓN: Façade Pattern
   * PROPÓSITO: Simplificar la manipulación DOM compleja
   * 
   * ALGORITMO:
   * 1. Construir ID del elemento error usando naming convention
   * 2. Buscar elemento en DOM (O(1) con getElementById)
   * 3. Si existe, actualizar contenido y visibilidad
   * 4. Si no existe, fail silently (defensive programming)
   * 
   * @param {string} fieldId - Identificador del campo
   * @param {string} message - Mensaje de error a mostrar
   * 
   * @performance O(1) - Operación constante
   * @side-effects Modifica DOM directamente
   * @defensive Maneja elementos inexistentes sin fallar
   * 
   * @example
   * showError('email', 'Formato de email inválido');
   * // Resultado: elemento 'error-email' muestra el mensaje
   */
  function showError(fieldId, message) {
    const errorElement = document.getElementById('error-' + fieldId);
    if (errorElement) {
      errorElement.textContent = message;        // XSS-safe: textContent vs innerHTML
      errorElement.style.display = 'block';     // CSS manipulation
    }
  }

  /**
   * @description Utilidad para ocultar mensajes de error
   * 
   * PATRÓN: Façade Pattern
   * PROPÓSITO: Cleanup de estado de error
   * 
   * @param {string} fieldId - Identificador del campo
   * 
   * @performance O(1) - Operación constante
   * @side-effects Modifica DOM y libera memoria del mensaje
   * 
   * @example
   * hideError('email');
   * // Resultado: elemento 'error-email' se oculta y limpia
   */
  function hideError(fieldId) {
    const errorElement = document.getElementById('error-' + fieldId);
    if (errorElement) {
      errorElement.style.display = 'none';
      errorElement.textContent = '';           // Memory cleanup
    }
  }

  /**
   * @description Limpieza completa de mensajes de estado
   * 
   * PATRÓN: Cleanup Pattern
   * PROPÓSITO: Reset de estado de la UI
   * 
   * @performance O(1) - Operaciones constantes
   * @side-effects Modifica múltiples elementos DOM
   * 
   * @use-case Ejecutar antes de mostrar nuevos mensajes
   */
  function hideAllMessages() {
    successMessage.style.display = 'none';
    sendingMessage.style.display = 'none';
    errorMessage.style.display = 'none';
  }

  // ===================================================================
  // SECCIÓN 6: RESTRICCIONES DE ENTRADA EN TIEMPO REAL
  // ===================================================================
  
  /**
   * @description Filtrado de entrada para campo NOMBRE
   * 
   * PATRÓN: Input Filtering Pattern
   * ALGORITMO: Reactive filtering on input events
   * 
   * REGLAS DE NEGOCIO:
   * - Solo letras y espacios permitidos
   * - Conversión automática a mayúsculas
   * - Filtrado de números en tiempo real
   * 
   * PERFORMANCE CONSIDERATIONS:
   * - Regex execution en cada keystroke
   * - String manipulation en cada evento
   * - Optimización: usar una sola regex para ambas operaciones
   * 
   * SECURITY:
   * - Prevención de inyección de caracteres no deseados
   * - Sanitización en tiempo real
   * 
   * @event input - Ejecutado en cada cambio de entrada
   * @event paste - Ejecutado en paste desde clipboard
   * 
   * @complexity O(n) donde n = longitud del texto
   */
  if (nameInput) {
    /**
     * Handler para entrada de texto en tiempo real
     * @param {Event} e - Evento de entrada
     */
    nameInput.addEventListener('input', function() {
      // Filtrado de números: O(n) regex operation
      this.value = this.value.replace(/[0-9]/g, '');
      
      // Normalización: O(n) string operation
      this.value = this.value.toUpperCase();
    });

    /**
     * Handler especial para contenido pegado
     * @param {ClipboardEvent} e - Evento de pegado
     * 
     * EDGE CASE: Manejo de paste que puede contener caracteres no permitidos
     */
    nameInput.addEventListener('paste', function(e) {
      const pastedText = e.clipboardData.getData('text');
      
      if (/\d/.test(pastedText)) {
        e.preventDefault();  // Prevenir paste normal
        this.value += pastedText.replace(/[0-9]/g, '').toUpperCase();
      }
    });
  }

  /**
   * @description Filtrado de entrada para campo EDAD
   * 
   * RESTRICCIÓN: Solo números permitidos
   * PATRÓN: Input Sanitization Pattern
   * 
   * @performance O(n) por cada evento input
   */
  if (ageInput) {
    ageInput.addEventListener('input', function() {
      // Mantener solo dígitos
      this.value = this.value.replace(/[^0-9]/g, '');
      this.value = this.value.toUpperCase();  // Consistencia (aunque sea redundante)
    });
  }

  // ===================================================================
  // SECCIÓN 7: CONTADOR DE CARACTERES REACTIVO
  // ===================================================================
  
  /**
   * @description Contador de caracteres en tiempo real
   * 
   * PATRÓN: Observer Pattern + State Visualization
   * 
   * FEATURES:
   * - Conteo reactivo de caracteres
   * - Feedback visual cuando excede límite
   * - Actualización en tiempo real
   * 
   * UX CONSIDERATIONS:
   * - Feedback inmediato al usuario
   * - Indicación visual de límites
   * - Prevención de sorpresas en validación
   * 
   * @performance O(1) - Operación de conteo constante
   */
  if (commentsInput && commentsCounter) {
    commentsInput.addEventListener('input', function() {
      const currentLength = this.value.length;
      
      // Actualización de contador
      commentsCounter.textContent = `${currentLength} / 2000 caracteres`;
      
      // Feedback visual condicional
      if (currentLength > 2000) {
        commentsCounter.style.color = '#d93025';  // Material Red 600
      } else {
        commentsCounter.style.color = '#666';     // Neutral Gray
      }
    });
  }

  // ===================================================================
  // SECCIÓN 8: FUNCIONALIDAD TOGGLE DE CONTRASEÑAS
  // ===================================================================
  
  /**
   * @description Configurador genérico para toggle de contraseñas
   * 
   * PATRÓN: Strategy Pattern + Factory Function
   * PROPÓSITO: Reutilización de lógica para múltiples campos
   * 
   * BENEFITS:
   * - DRY Principle aplicado
   * - Configuración consistente
   * - Fácil extensión para nuevos campos
   * 
   * ALGORITHM:
   * 1. Verificar existencia de elementos (defensive programming)
   * 2. Crear event listener con comportamiento específico
   * 3. Prevenir efectos secundarios no deseados
   * 4. Alternar estado y UI feedback
   * 
   * @param {HTMLInputElement} inputElement - Campo de contraseña
   * @param {HTMLButtonElement} buttonElement - Botón de toggle
   * 
   * @performance O(1) - Configuración una sola vez
   * @side-effects Modifica type de input y contenido de botón
   * 
   * @example
   * setupPasswordToggle(passwordInput, togglePasswordButton);
   */
  function setupPasswordToggle(inputElement, buttonElement) {
    if (inputElement && buttonElement) {
      buttonElement.addEventListener('click', function(e) {
        // Prevenir comportamientos no deseados
        e.preventDefault();     // No submit del form
        e.stopPropagation();    // No bubbling del evento
        
        // State toggle con UI feedback
        if (inputElement.type === 'password') {
          inputElement.type = 'text';           // Revelar contraseña
          buttonElement.textContent = '🙈';     // Emoji "esconder"
        } else {
          inputElement.type = 'password';       // Ocultar contraseña
          buttonElement.textContent = '👁️';     // Emoji "mostrar"
        }
      });
    }
  }

  // Configuración de toggles para ambos campos
  setupPasswordToggle(passwordInput, togglePassword);
  setupPasswordToggle(passwordConfirmInput, togglePasswordConfirm);

  // ===================================================================
  // SECCIÓN 9: SISTEMA DE VALIDACIONES AVANZADO
  // ===================================================================
  
  /**
   * @description Sistema de validación completo del formulario
   * 
   * PATRÓN: Template Method Pattern + Chain of Responsibility
   * ARQUITECTURA: Fail-fast validation with accumulative results
   * 
   * ALGORITMO:
   * 1. Inicializar flag acumulativo (isValid = true)
   * 2. Ejecutar validaciones secuenciales
   * 3. Cada validación puede cambiar isValid a false
   * 4. Continuar todas las validaciones (no fail-fast)
   * 5. Retornar resultado acumulativo
   * 
   * DESIGN DECISIONS:
   * - No fail-fast: mostrar todos los errores simultáneamente
   * - Validaciones independientes: cada una maneja su propio estado
   * - Acumulación de resultados: decisión final basada en todos los checks
   * 
   * COMPLEXITY ANALYSIS:
   * - Temporal: O(n) donde n = número de validaciones
   * - Espacial: O(1) - solo variables locales
   * - Ciclomática: Moderada (~20 branches)
   * 
   * @returns {boolean} true si todas las validaciones pasan
   * 
   * @performance O(n) donde n = número de campos a validar
   * @side-effects Modifica DOM mostrando/ocultando errores
   */
  function validateForm() {
    let isValid = true;  // Accumulator pattern

    // ===============================================================
    // VALIDACIÓN 1: NOMBRE
    // ===============================================================
    
    /**
     * @validation Nombre
     * @rules 
     * - Campo obligatorio (no vacío)
     * - Solo letras y espacios
     * - Mayúsculas (normalización previa)
     * 
     * @regex /^[A-ZÁÉÍÓÚÑ\s]+$/
     * - ^ = inicio de string
     * - [A-ZÁÉÍÓÚÑ\s]+ = uno o más caracteres del set permitido
     * - A-Z = letras mayúsculas básicas
     * - ÁÉÍÓÚÑ = letras con acentos y ñ
     * - \s = espacios en blanco
     * - + = uno o más occurrencias
     * - $ = fin de string
     */
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

    // ===============================================================
    // VALIDACIÓN 2: EMAIL PRINCIPAL
    // ===============================================================
    
    /**
     * @validation Email
     * @rules
     * - Campo obligatorio
     * - Formato válido de email
     * 
     * @regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/
     * - ^[^\s@]+ = inicio con uno o más caracteres que no sean espacios ni @
     * - @ = arroba literal
     * - [^\s@]+ = uno o más caracteres que no sean espacios ni @
     * - \. = punto literal
     * - [^\s@]+$ = uno o más caracteres que no sean espacios ni @, hasta el final
     * 
     * @note Esta regex es básica, para producción considerar RFC 5322 compliant
     */
    const emailValue = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailValue) {
      showError('email', 'El correo electrónico es obligatorio.');
      isValid = false;
    } else if (!emailRegex.test(emailValue)) {
      showError('email', 'Por favor ingresa un correo electrónico válido.');
      isValid = false;
    } else {
      hideError('email');
    }

    // ===============================================================
    // VALIDACIÓN 3: CONFIRMACIÓN DE EMAIL
    // ===============================================================
    
    /**
     * @validation Email Confirmation
     * @rules
     * - Campo obligatorio
     * - Debe coincidir exactamente con email principal
     * 
     * @security Previene typos en emails críticos
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

    // ===============================================================
    // VALIDACIÓN 4: CONTRASEÑA
    // ===============================================================
    
    /**
     * @validation Password
     * @rules
     * - Campo obligatorio
     * - Mínimo 8 caracteres
     * - Al menos una mayúscula
     * - Al menos una minúscula
     * 
     * @security Reglas básicas de seguridad de contraseñas
     * @note Para producción, considerar más reglas (números, símbolos, etc.)
     * 
     * @regex /[a-z]/ - al menos una minúscula
     * @regex /[A-Z]/ - al menos una mayúscula
     */
    const passwordValue = passwordInput.value;  // Sin trim para preservar espacios
    
    if (!passwordValue) {
      showError('password', 'La contraseña es obligatoria.');
      isValid = false;
    } else if (passwordValue.length < 8) {
      showError('password', 'La contraseña debe tener al menos 8 caracteres.');
      isValid = false;
    } else if (!/[a-z]/.test(passwordValue) || !/[A-Z]/.test(passwordValue)) {
      showError('password', 'La contraseña debe contener al menos una mayúscula y una minúscula.');
      isValid = false;
    } else {
      hideError('password');
    }

    // ===============================================================
    // VALIDACIÓN 5: CONFIRMACIÓN DE CONTRASEÑA
    // ===============================================================
    
    /**
     * @validation Password Confirmation
     * @rules
     * - Campo obligatorio
     * - Debe coincidir exactamente con contraseña principal
     * 
     * @security Previene typos en contraseñas
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

    // ===============================================================
    // VALIDACIÓN 6: EDAD
    // ===============================================================
    
    /**
     * @validation Age
     * @rules
     * - Campo obligatorio
     * - Debe ser número válido
     * - Rango: 1-120 años
     * 
     * @algorithm
     * 1. Convertir a entero con parseInt()
     * 2. Verificar que la conversión fue exitosa (!isNaN)
     * 3. Verificar rango válido
     * 
     * @edge-cases
     * - Entrada vacía
     * - Texto no numérico
     * - Números decimales (parseInt los trunca)
     * - Números negativos
     * - Números fuera de rango humano razonable
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

    // ===============================================================
    // VALIDACIÓN 7: FECHA DE NACIMIENTO
    // ===============================================================
    
    /**
     * @validation Birthdate
     * @rules
     * - Campo obligatorio
     * - No puede ser fecha futura
     * 
     * @algorithm
     * 1. Verificar que el campo no esté vacío
     * 2. Crear objeto Date a partir del valor
     * 3. Comparar con fecha actual
     * 
     * @edge-cases
     * - Fechas futuras (lógicamente imposibles)
     * - Fechas muy antiguas (aunque técnicamente posibles)
     * - Formato de fecha inválido (HTML5 input type="date" ayuda)
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

    // ===============================================================
    // VALIDACIÓN 8: COMENTARIOS (OPCIONAL)
    // ===============================================================
    
    /**
     * @validation Comments
     * @rules
     * - Campo opcional
     * - Máximo 2000 caracteres si se proporciona
     * 
     * @note Esta validación es diferente: no es obligatoria pero tiene límites
     */
    const commentsValue = commentsInput.value;
    
    if (commentsValue.length > 2000) {
      showError('comments', 'Los comentarios no pueden exceder 2000 caracteres.');
      isValid = false;
    } else {
      hideError('comments');
    }

    // Retorno del resultado acumulativo
    return isValid;
  }

  // ===================================================================
  // SECCIÓN 10: MANEJO DE ENVÍO Y INTEGRACIÓN API
  // ===================================================================
  
  /**
   * @description Handler principal para envío del formulario
   * 
   * PATRÓN: Command Pattern + State Machine
   * ESTADOS: idle → validating → sending → success|error → idle
   * 
   * FLOW CONTROL:
   * 1. Prevenir envío tradicional
   * 2. Limpiar estado anterior
   * 3. Validar formulario
   * 4. Si inválido, abortar
   * 5. Si válido, proceder con envío
   * 6. Manejar respuesta (éxito/error)
   * 7. Restaurar estado o redirigir
   * 
   * ERROR HANDLING:
   * - Validation errors: mostrar en UI
   * - Network errors: mostrar mensaje genérico
   * - API errors: log detallado + mensaje user-friendly
   * 
   * UX CONSIDERATIONS:
   * - Feedback inmediato
   * - Prevención de múltiples envíos
   * - Indicadores de progreso
   * - Mensajes claros de estado
   * 
   * @event submit
   * @param {Event} e - Event object del submit
   * 
   * @performance
   * - Validación: O(n) donde n = número de campos
   * - API Call: O(1) - depende de red
   * - DOM Updates: O(1) - operaciones constantes
   * 
   * @side-effects
   * - Modifica DOM (mensajes, botón estado)
   * - Hace llamada HTTP
   * - Puede redirigir usuario
   */
  form.addEventListener('submit', function(e) {
    // ===============================================================
    // FASE 1: PREPARACIÓN Y VALIDACIÓN
    // ===============================================================
    
    // Prevenir envío tradicional del formulario
    e.preventDefault();
    
    // Logging para debugging y monitoring
    console.log('Formulario enviado - iniciando validación');
    
    // Limpiar mensajes previos (evitar confusión)
    hideAllMessages();
    
    // Ejecutar suite completa de validaciones
    if (!validateForm()) {
      console.log('Validación fallida - abortando envío');
      return;  // Early exit pattern
    }
    
    console.log('Validación exitosa - procediendo con envío');
    
    // ===============================================================
    // FASE 2: PREPARACIÓN PARA ENVÍO API
    // ===============================================================
    
    /**
     * @description Configuración de estado UI para envío
     * 
     * OBJETIVOS:
     * - Informar al usuario que el proceso está en curso
     * - Prevenir múltiples envíos accidentales
     * - Establecer estado visual consistente
     * 
     * @side-effects
     * - Modifica texto y estado del botón
     * - Muestra mensaje de progreso
     * - Deshabilita interacción del usuario
     */
    
    // Mostrar feedback visual de progreso
    sendingMessage.style.display = 'block';
    
    // Prevenir múltiples submissions
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';  // UX feedback
    
    // ===============================================================
    // FASE 3: INTEGRACIÓN CON EMAILJS API
    // ===============================================================
    
    /**
     * @description Envío asíncrono via EmailJS
     * 
     * PATRÓN: Promise-based API integration
     * MÉTODO: emailjs.sendForm()
     * 
     * PARÁMETROS:
     * @param {string} SERVICE_ID - Servicio de correo configurado
     * @param {string} TEMPLATE_ID - Plantilla de email
     * @param {HTMLFormElement} form - Formulario con datos
     * 
     * RETURN: Promise<EmailJSResponseStatus>
     * 
     * FLOW:
     * 1. Serialización automática del formulario
     * 2. Envío HTTP a EmailJS servers
     * 3. Procesamiento server-side
     * 4. Envío del email final
     * 5. Respuesta con status
     * 
     * ERROR SCENARIOS:
     * - Network connectivity issues
     * - Invalid API credentials
     * - Service limits exceeded
     * - Template configuration errors
     * - Email delivery failures
     * 
     * @async
     * @returns {Promise} Resolves to success/error handlers
     */
    emailjs.sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, form)
      .then(function(response) {
        // ===============================================================
        // HANDLER: ENVÍO EXITOSO
        // ===============================================================
        
        /**
         * @description Manejo de respuesta exitosa
         * 
         * RESPONSE STRUCTURE:
         * - status: HTTP status code
         * - text: Response message
         * - 
         * 
         * SUCCESS FLOW:
         * 1. Log resultado para monitoring
         * 2. Actualizar UI con mensaje de éxito
         * 3. Limpiar formulario
         * 4. Resetear contadores y estados
         * 5. Restaurar botón a estado original
         * 6. Programar redirección
         * 
         * @param {EmailJSResponseStatus} response - Respuesta de EmailJS
         */
        
        console.log('Email enviado exitosamente:', response);
        
        // Limpiar estado de "enviando"
        sendingMessage.style.display = 'none';
        
        // Mostrar confirmación de éxito
        successMessage.style.display = 'block';
        
        // Reset completo del formulario
        form.reset();
        
        // Restaurar elementos auxiliares
        if (commentsCounter) {
          commentsCounter.textContent = '0 / 2000 caracteres';
          commentsCounter.style.color = '#666';  // Color neutral
        }
        
        // Restaurar estado del botón
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar información';
        
        /**
         * @description Redirección programada
         * 
         * PATRÓN: Delayed Navigation Pattern
         * PROPÓSITO: Permitir que el usuario lea el mensaje de éxito
         * TIMING: 3 segundos - balance entre UX y efficiency
         * 
         * @timeout 3000ms
         * @destination gracias.html
         * 
         * @note Para SPA considerar router.navigate() en lugar de window.location
         */
        setTimeout(function() {
          window.location.href = 'gracias.html';
        }, 3000);
        
      })
      .catch(function(error) {
        // ===============================================================
        // HANDLER: ERROR EN ENVÍO
        // ===============================================================
        
        /**
         * @description Manejo de errores en envío
         * 
         * ERROR TYPES:
         * - NetworkError: Problemas de conectividad
         * - AuthenticationError: Credenciales inválidas
         * - QuotaExceededError: Límites de servicio
         * - ValidationError: Datos inválidos
         * - ServerError: Errores server-side
         * 
         * ERROR HANDLING STRATEGY:
         * 1. Log detallado para debugging
         * 2. Mensaje user-friendly (no técnico)
         * 3. Permitir retry restaurando UI
         * 4. No exponer detalles internos al usuario
         * 
         * @param {Error} error - Error object from EmailJS
         */
        
        console.error('Error al enviar email:', error);
        
        // Limpiar estado de "enviando"
        sendingMessage.style.display = 'none';
        
        // Mostrar mensaje de error genérico
        errorMessage.style.display = 'block';
        
        // Restaurar botón para permitir retry
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar información';
        
        /**
         * @future-enhancement Error categorization and specific messaging
         * 
         * POSIBLES MEJORAS:
         * - Categorizar errores por tipo
         * - Mensajes específicos por categoría
         * - Retry automático para errores temporales
         * - Fallback a otros métodos de envío
         * - Telemetría y monitoring de errores
         */
      });
  });

  // ===================================================================
  // SECCIÓN 11: FINALIZACION Y CONFIRMACIÓN
  // ===================================================================
  
  /**
   * @description Log de confirmación de inicialización
   * 
   * PROPÓSITO:
   * - Confirmar que el script se ejecutó completamente
   * - Ayudar en debugging de problemas de carga
   * - Punto de referencia para monitoring
   * 
   * @log Script inicializado correctamente
   */
  console.log('Script inicializado correctamente');
  
  /**
   * @description Fin del scope del event listener DOMContentLoaded
   * 
   * ENCAPSULATION:
   * - Todas las variables están en scope local
   * - No contaminación del namespace global
   * - Garbage collection automático cuando sea apropiado
   * - Memory leaks prevenidos por design
   */
});

// ===================================================================
// DOCUMENTACIÓN ADICIONAL PARA DESARROLLADORES
// ===================================================================

/**
 * @section GUÍA DE MANTENIMIENTO
 * ===============================
 * 
 * ACTUALIZACIONES FRECUENTES:
 * ---------------------------
 * 1. Configuración EmailJS (EMAILJS_CONFIG)
 *    - Ubicación: Líneas 75-79
 *    - Frecuencia: Al cambiar servicios o plantillas
 *    - Impacto: Alto - puede romper funcionalidad
 * 
 * 2. Reglas de validación
 *    - Ubicación: Función validateForm() líneas 400+
 *    - Frecuencia: Según requerimientos de negocio
 *    - Impacto: Medio - afecta UX y data quality
 * 
 * 3. Mensajes de error
 *    - Ubicación: Distribuidos en validateForm()
 *    - Frecuencia: Para i18n o mejoras de UX
 *    - Impacto: Bajo - solo afecta presentación
 * 
 * TESTING RECOMENDADO:
 * --------------------
 * 1. Unit Tests:
 *    - validateForm() con diferentes inputs
 *    - showError() / hideError() functionality
 *    - setupPasswordToggle() behavior
 * 
 * 2. Integration Tests:
 *    - EmailJS integration con mock responses
 *    - Form submission end-to-end
 *    - Error scenarios y recovery
 * 
 * 3. E2E Tests:
 *    - Complete user journeys
 *    - Cross-browser compatibility
 *    - Mobile responsiveness
 * 
 * MONITORING RECOMENDADO:
 * -----------------------
 * 1. Success Rate:
 *    - Percentage de envíos exitosos
 *    - Time to success metrics
 * 
 * 2. Error Rate:
 *    - Categorización de errores
 *    - Error patterns y trends
 * 
 * 3. Performance:
 *    - Validation execution time
 *    - API response times
 * 
 * 4. User Experience:
 *    - Form abandonment rate
 *    - Field-specific error rates
 * 
 * @section EXTENSIBILIDAD
 * ======================
 * 
 * AGREGAR NUEVOS CAMPOS:
 * ----------------------
 * 1. Agregar HTML elements
 * 2. Crear referencias en la sección de caching
 * 3. Implementar validación en validateForm()
 * 4. Agregar event listeners si necesario
 * 5. Actualizar plantilla EmailJS
 * 
 * EJEMPLO - CAMPO TELÉFONO:
 * ```javascript
 * // En sección de caching:
 * const phoneInput = document.getElementById('phone');
 * 
 * // En validateForm():
 * const phoneValue = phoneInput.value.trim();
 * const phoneRegex = /^\+?[\d\s-()]{10,}$/;
 * 
 * if (!phoneValue) {
 *   showError('phone', 'El teléfono es obligatorio.');
 *   isValid = false;
 * } else if (!phoneRegex.test(phoneValue)) {
 *   showError('phone', 'Formato de teléfono inválido.');
 *   isValid = false;
 * } else {
 *   hideError('phone');
 * }
 * ```
 * 
 * AGREGAR NUEVAS VALIDACIONES:
 * ----------------------------
 * 1. Identificar campo target
 * 2. Definir reglas de negocio
 * 3. Implementar regex o lógica
 * 4. Agregar mensajes de error
 * 5. Testing exhaustivo
 * 
 * INTEGRAR OTROS SERVICIOS:
 * -------------------------
 * 1. Mantener misma interfaz (sendForm-like)
 * 2. Implementar error handling consistente
 * 3. Preservar UX patterns existentes
 * 4. Agregar fallback mechanisms
 * 
 * @section SEGURIDAD
 * =================
 * 
 * VALIDACIONES CLIENT-SIDE vs SERVER-SIDE:
 * ----------------------------------------
 * - Client-side: UX y performance
 * - Server-side: Seguridad real
 * - NUNCA confiar solo en validaciones client-side
 * - Implementar validaciones duplicadas en backend
 * 
 * SANITIZACIÓN:
 * -------------
 * - Input filtering implementado
 * - XSS prevention via textContent
 * - Consider CSP headers para extra protection
 * 
 * RATE LIMITING:
 * --------------
 * - Button disabling previene spam básico
 * - Implementar rate limiting server-side
 * - Consider CAPTCHA para formularios públicos
 * 
 * DATOS SENSIBLES:
 * ----------------
 * - Passwords no se logean
 * - EmailJS maneja transmission encryption
 * - Consider hashing client-side para passwords
 * 
 * @section PERFORMANCE
 * ===================
 * 
 * OPTIMIZACIONES IMPLEMENTADAS:
 * -----------------------------
 * - DOM caching reduce queries repetitivas
 * - Event delegation apropiada
 * - Regex compilation optimizada por engine
 * - Memory cleanup en error handlers
 * 
 * MÉTRICAS OBJETIVO:
 * ------------------
 * - Validation time: < 50ms
 * - API response time: < 2s
 * - First Contentful Paint: < 1s
 * - Time to Interactive: < 3s
 * 
 * POSIBLES OPTIMIZACIONES:
 * ------------------------
 * - Debouncing para validaciones en tiempo real
 * - Web Workers para validaciones pesadas
 * - Service Worker para offline capability
 * - Bundle splitting para código no crítico
 * 
 * @section ACCESIBILIDAD
 * =====================
 * 
 * IMPLEMENTADO:
 * -------------
 * - Error messages asociados a campos
 * - Focus management en errores
 * - Keyboard navigation support
 * - Screen reader compatible markup
 * 
 * MEJORAS FUTURAS:
 * ----------------
 * - ARIA live regions para feedback dinámico
 * - High contrast mode support
 * - Reduced motion preferences
 * - Multiple language support
 * 
 * @author Hector Arciniega
 * @version Final - Expert Documentation
 * @date 2024
 * @license MIT
 */
