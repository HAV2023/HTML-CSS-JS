/**
 * FORMULARIO PROFESIONAL CON EMAILJS
 * Autor: Hector Arciniega
 * Versión: Final - Completamente funcional
 * 
 * DESCRIPCIÓN GENERAL:
 * Este archivo implementa un formulario profesional con validaciones avanzadas
 * y envío automático de correos electrónicos usando la librería EmailJS.
 * Incluye validaciones en tiempo real, restricciones de entrada, toggle de contraseñas
 * y manejo completo de estados de envío.
 */

// ===================================================================
// SECCIÓN 1: CONFIGURACIÓN EMAILJS
// ===================================================================

/**
 * Objeto de configuración para EmailJS
 * Contiene todas las credenciales necesarias para el envío de correos
 * 
 * @type {Object}
 * @property {string} PUBLIC_KEY - Clave pública de la cuenta EmailJS
 * @property {string} SERVICE_ID - Identificador del servicio de correo configurado
 * @property {string} TEMPLATE_ID - Identificador de la plantilla de correo a utilizar
 */
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "poner public_key",    // Clave pública para autenticación
  SERVICE_ID: "poner service_id",       // Servicio de correo (Gmail, Outlook, etc.)
  TEMPLATE_ID: "poner template_id"      // Plantilla con formato del correo
};

/**
 * Inicialización de la librería EmailJS
 * Debe ejecutarse antes de usar cualquier función de EmailJS
 * Establece la clave pública para todas las operaciones posteriores
 */
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

// ===================================================================
// SECCIÓN 2: INICIALIZACIÓN PRINCIPAL
// ===================================================================

/**
 * Event Listener principal que se ejecuta cuando el DOM está completamente cargado
 * Garantiza que todos los elementos HTML estén disponibles antes de manipularlos
 * 
 * @event DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', function() {
  
  // ===================================================================
  // SECCIÓN 3: REFERENCIAS A ELEMENTOS DEL DOM
  // ===================================================================
  
  /**
   * Referencias a elementos principales del formulario
   * Estas constantes almacenan referencias directas a elementos HTML
   * para evitar búsquedas repetitivas en el DOM
   */
  
  // Elemento formulario principal
  const form = document.getElementById('professionalForm');
  
  // Botón de envío del formulario
  const submitBtn = document.getElementById('submitBtn');
  
  // Elementos de mensajes de estado
  const successMessage = document.getElementById('successMessage');    // Mensaje de éxito
  const sendingMessage = document.getElementById('sendingMessage');    // Mensaje de envío en progreso
  const errorMessage = document.getElementById('errorMessage');        // Mensaje de error
  
  /**
   * Referencias a campos de entrada del formulario
   * Cada constante representa un campo específico del formulario
   */
  const nameInput = document.getElementById('name');                   // Campo nombre
  const emailInput = document.getElementById('email');                 // Campo email principal
  const emailConfirmInput = document.getElementById('emailConfirm');   // Campo confirmación email
  const passwordInput = document.getElementById('password');           // Campo contraseña
  const passwordConfirmInput = document.getElementById('passwordConfirm'); // Campo confirmación contraseña
  const ageInput = document.getElementById('age');                     // Campo edad
  const birthdateInput = document.getElementById('birthdate');         // Campo fecha nacimiento
  const commentsInput = document.getElementById('comments');           // Campo comentarios
  const commentsCounter = document.getElementById('commentsCounter');  // Contador de caracteres
  
  /**
   * Referencias a botones de toggle para contraseñas
   * Permiten mostrar/ocultar el contenido de los campos de contraseña
   */
  const togglePassword = document.getElementById('togglePassword');           // Toggle contraseña principal
  const togglePasswordConfirm = document.getElementById('togglePasswordConfirm'); // Toggle confirmación

  // ===================================================================
  // SECCIÓN 4: CONFIGURACIONES INICIALES
  // ===================================================================
  
  /**
   * Configuración de fecha máxima para el campo de fecha de nacimiento
   * Previene que los usuarios seleccionen fechas futuras
   */
  if (birthdateInput) {
    // Obtener fecha actual en formato ISO (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    
    // Establecer fecha máxima permitida (hoy)
    birthdateInput.max = today;
  }

  // ===================================================================
  // SECCIÓN 5: FUNCIONES DE UTILIDAD PARA MANEJO DE ERRORES
  // ===================================================================
  
  /**
   * Muestra un mensaje de error para un campo específico
   * 
   * @param {string} fieldId - ID del campo al que pertenece el error
   * @param {string} message - Mensaje de error a mostrar
   * 
   * Funcionamiento:
   * 1. Busca el elemento de error usando convención 'error-{fieldId}'
   * 2. Si existe, establece el mensaje y lo hace visible
   * 3. Si no existe, no hace nada (previene errores)
   */
  function showError(fieldId, message) {
    const errorElement = document.getElementById('error-' + fieldId);
    if (errorElement) {
      errorElement.textContent = message;        // Establecer texto del error
      errorElement.style.display = 'block';     // Hacer visible el error
    }
  }

  /**
   * Oculta el mensaje de error para un campo específico
   * 
   * @param {string} fieldId - ID del campo cuyo error se debe ocultar
   * 
   * Funcionamiento:
   * 1. Busca el elemento de error correspondiente
   * 2. Si existe, lo oculta y limpia su contenido
   * 3. Previene errores si el elemento no existe
   */
  function hideError(fieldId) {
    const errorElement = document.getElementById('error-' + fieldId);
    if (errorElement) {
      errorElement.style.display = 'none';     // Ocultar elemento
      errorElement.textContent = '';           // Limpiar contenido
    }
  }

  /**
   * Oculta todos los mensajes de estado del formulario
   * 
   * Se usa para limpiar la interfaz antes de mostrar nuevos mensajes
   * Evita que se muestren múltiples mensajes simultáneamente
   */
  function hideAllMessages() {
    successMessage.style.display = 'none';    // Ocultar mensaje de éxito
    sendingMessage.style.display = 'none';    // Ocultar mensaje de envío
    errorMessage.style.display = 'none';      // Ocultar mensaje de error
  }

  // ===================================================================
  // SECCIÓN 6: RESTRICCIONES DE ENTRADA EN TIEMPO REAL
  // ===================================================================
  
  /**
   * Configuración de restricciones para el campo NOMBRE
   * Permite solo letras y espacios, convierte a mayúsculas automáticamente
   */
  if (nameInput) {
    /**
     * Event listener para entrada de texto en tiempo real
     * Se ejecuta cada vez que el usuario escribe en el campo
     */
    nameInput.addEventListener('input', function() {
      // Remover todos los números del texto ingresado
      this.value = this.value.replace(/[0-9]/g, '');
      
      // Convertir todo el texto a mayúsculas
      this.value = this.value.toUpperCase();
    });

    /**
     * Event listener para texto pegado
     * Maneja el caso especial cuando el usuario pega texto desde el portapapeles
     */
    nameInput.addEventListener('paste', function(e) {
      // Obtener el texto que se está pegando
      const pastedText = e.clipboardData.getData('text');
      
      // Si el texto contiene números
      if (/\d/.test(pastedText)) {
        e.preventDefault();  // Prevenir el pegado normal
        
        // Pegar solo la parte sin números y en mayúsculas
        this.value += pastedText.replace(/[0-9]/g, '').toUpperCase();
      }
    });
  }

  /**
   * Configuración de restricciones para el campo EDAD
   * Permite solo números
   */
  if (ageInput) {
    /**
     * Event listener para entrada de texto en el campo edad
     * Filtra todo excepto números
     */
    ageInput.addEventListener('input', function() {
      // Mantener solo números, remover letras y símbolos
      this.value = this.value.replace(/[^0-9]/g, '');
      
      // Convertir a mayúsculas (aunque solo sean números, por consistencia)
      this.value = this.value.toUpperCase();
    });
  }

  // ===================================================================
  // SECCIÓN 7: CONTADOR DE CARACTERES PARA COMENTARIOS
  // ===================================================================
  
  /**
   * Funcionalidad del contador de caracteres para el campo de comentarios
   * Muestra en tiempo real cuántos caracteres ha escrito el usuario
   */
  if (commentsInput && commentsCounter) {
    /**
     * Event listener que actualiza el contador mientras el usuario escribe
     */
    commentsInput.addEventListener('input', function() {
      // Obtener la longitud actual del texto
      const currentLength = this.value.length;
      
      // Actualizar el texto del contador
      commentsCounter.textContent = `${currentLength} / 2000 caracteres`;
      
      // Cambiar color si excede el límite
      if (currentLength > 2000) {
        commentsCounter.style.color = '#d93025';  // Rojo para advertencia
      } else {
        commentsCounter.style.color = '#666';     // Gris normal
      }
    });
  }

  // ===================================================================
  // SECCIÓN 8: FUNCIONALIDAD TOGGLE PARA CONTRASEÑAS
  // ===================================================================
  
  /**
   * Función genérica para configurar el toggle de visibilidad de contraseñas
   * 
   * @param {HTMLElement} inputElement - Campo de contraseña
   * @param {HTMLElement} buttonElement - Botón de toggle
   * 
   * Funcionamiento:
   * 1. Alterna entre type='password' y type='text'
   * 2. Cambia el emoji del botón según el estado
   * 3. Previene comportamientos no deseados del formulario
   */
  function setupPasswordToggle(inputElement, buttonElement) {
    if (inputElement && buttonElement) {
      buttonElement.addEventListener('click', function(e) {
        e.preventDefault();     // Prevenir envío del formulario
        e.stopPropagation();    // Prevenir propagación del evento
        
        // Alternar visibilidad de la contraseña
        if (inputElement.type === 'password') {
          inputElement.type = 'text';           // Mostrar contraseña
          buttonElement.textContent = '🙈';     // Emoji "no ver"
        } else {
          inputElement.type = 'password';       // Ocultar contraseña
          buttonElement.textContent = '👁️';     // Emoji "ojo"
        }
      });
    }
  }

  // Configurar toggle para ambos campos de contraseña
  setupPasswordToggle(passwordInput, togglePassword);
  setupPasswordToggle(passwordConfirmInput, togglePasswordConfirm);

  // ===================================================================
  // SECCIÓN 9: SISTEMA DE VALIDACIONES COMPLETO
  // ===================================================================
  
  /**
   * Función principal de validación del formulario
   * 
   * @returns {boolean} true si todas las validaciones pasan, false en caso contrario
   * 
   * Esta función ejecuta todas las validaciones de forma secuencial
   * y acumula el resultado en la variable isValid
   */
  function validateForm() {
    let isValid = true;  // Bandera acumulativa de validación

    // ===============================================================
    // VALIDACIÓN DE NOMBRE
    // ===============================================================
    const nameValue = nameInput.value.trim();  // Obtener valor sin espacios extra
    
    if (!nameValue) {
      // Caso: campo vacío
      showError('name', 'El nombre es obligatorio.');
      isValid = false;
    } else if (!/^[A-ZÁÉÍÓÚÑ\s]+$/.test(nameValue)) {
      // Caso: contiene caracteres no permitidos
      // Regex explica: solo letras mayúsculas (incluye acentos) y espacios
      showError('name', 'Solo se permiten letras y espacios.');
      isValid = false;
    } else {
      // Caso: validación exitosa
      hideError('name');
    }

    // ===============================================================
    // VALIDACIÓN DE EMAIL PRINCIPAL
    // ===============================================================
    const emailValue = emailInput.value.trim();
    
    // Regex para validar formato de email
    // Explica: texto@texto.texto (sin espacios ni caracteres especiales)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailValue) {
      // Caso: campo vacío
      showError('email', 'El correo electrónico es obligatorio.');
      isValid = false;
    } else if (!emailRegex.test(emailValue)) {
      // Caso: formato inválido
      showError('email', 'Por favor ingresa un correo electrónico válido.');
      isValid = false;
    } else {
      // Caso: validación exitosa
      hideError('email');
    }

    // ===============================================================
    // VALIDACIÓN DE CONFIRMACIÓN DE EMAIL
    // ===============================================================
    const emailConfirmValue = emailConfirmInput.value.trim();
    
    if (!emailConfirmValue) {
      // Caso: campo vacío
      showError('emailConfirm', 'La confirmación de correo es obligatoria.');
      isValid = false;
    } else if (emailConfirmValue !== emailValue) {
      // Caso: no coinciden los emails
      showError('emailConfirm', 'Los correos electrónicos no coinciden.');
      isValid = false;
    } else {
      // Caso: validación exitosa
      hideError('emailConfirm');
    }

    // ===============================================================
    // VALIDACIÓN DE CONTRASEÑA
    // ===============================================================
    const passwordValue = passwordInput.value;  // Sin trim para preservar espacios
    
    if (!passwordValue) {
      // Caso: campo vacío
      showError('password', 'La contraseña es obligatoria.');
      isValid = false;
    } else if (passwordValue.length < 8) {
      // Caso: muy corta
      showError('password', 'La contraseña debe tener al menos 8 caracteres.');
      isValid = false;
    } else if (!/[a-z]/.test(passwordValue) || !/[A-Z]/.test(passwordValue)) {
      // Caso: no cumple requisitos de mayúsculas/minúsculas
      // Regex explica: debe tener al menos una minúscula Y una mayúscula
      showError('password', 'La contraseña debe contener al menos una mayúscula y una minúscula.');
      isValid = false;
    } else {
      // Caso: validación exitosa
      hideError('password');
    }

    // ===============================================================
    // VALIDACIÓN DE CONFIRMACIÓN DE CONTRASEÑA
    // ===============================================================
    const passwordConfirmValue = passwordConfirmInput.value;
    
    if (!passwordConfirmValue) {
      // Caso: campo vacío
      showError('passwordConfirm', 'La confirmación de contraseña es obligatoria.');
      isValid = false;
    } else if (passwordConfirmValue !== passwordValue) {
      // Caso: no coinciden las contraseñas
      showError('passwordConfirm', 'Las contraseñas no coinciden.');
      isValid = false;
    } else {
      // Caso: validación exitosa
      hideError('passwordConfirm');
    }

    // ===============================================================
    // VALIDACIÓN DE EDAD
    // ===============================================================
    const ageValue = parseInt(ageInput.value);  // Convertir a número entero
    
    if (!ageInput.value) {
      // Caso: campo vacío
      showError('age', 'La edad es obligatoria.');
      isValid = false;
    } else if (isNaN(ageValue) || ageValue < 1 || ageValue > 120) {
      // Caso: no es número válido o fuera de rango
      // isNaN verifica si la conversión falló
      showError('age', 'La edad debe estar entre 1 y 120 años.');
      isValid = false;
    } else {
      // Caso: validación exitosa
      hideError('age');
    }

    // ===============================================================
    // VALIDACIÓN DE FECHA DE NACIMIENTO
    // ===============================================================
    const birthdateValue = birthdateInput.value;
    
    if (!birthdateValue) {
      // Caso: campo vacío
      showError('birthdate', 'La fecha de nacimiento es obligatoria.');
      isValid = false;
    } else {
      // Validar que no sea fecha futura
      const birthDate = new Date(birthdateValue);  // Crear objeto Date
      const today = new Date();                    // Fecha actual
      
      if (birthDate > today) {
        // Caso: fecha futura
        showError('birthdate', 'La fecha de nacimiento no puede ser futura.');
        isValid = false;
      } else {
        // Caso: validación exitosa
        hideError('birthdate');
      }
    }

    // ===============================================================
    // VALIDACIÓN DE COMENTARIOS (OPCIONAL PERO CON LÍMITE)
    // ===============================================================
    const commentsValue = commentsInput.value;
    
    if (commentsValue.length > 2000) {
      // Caso: excede límite de caracteres
      showError('comments', 'Los comentarios no pueden exceder 2000 caracteres.');
      isValid = false;
    } else {
      // Caso: validación exitosa (incluye campo vacío, que es válido)
      hideError('comments');
    }

    // Retornar resultado acumulativo de todas las validaciones
    return isValid;
  }

  // ===================================================================
  // SECCIÓN 10: MANEJO DEL ENVÍO DEL FORMULARIO
  // ===================================================================
  
  /**
   * Event listener para el envío del formulario
   * Maneja todo el proceso desde validación hasta envío y respuesta
   */
  form.addEventListener('submit', function(e) {
    // Prevenir envío tradicional del formulario
    e.preventDefault();
    
    // Log para debugging
    console.log('Formulario enviado - iniciando validación');
    
    // Limpiar mensajes previos para evitar confusión
    hideAllMessages();
    
    // Ejecutar validaciones completas
    if (!validateForm()) {
      console.log('Validación fallida');
      return;  // Detener proceso si hay errores
    }
    
    console.log('Validación exitosa - enviando email');
    
    // ===============================================================
    // FASE 1: PREPARACIÓN PARA ENVÍO
    // ===============================================================
    
    // Mostrar indicador de envío en progreso
    sendingMessage.style.display = 'block';
    
    // Deshabilitar botón para prevenir múltiples envíos
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';  // Cambiar texto del botón
    
    // ===============================================================
    // FASE 2: ENVÍO VÍA EMAILJS
    // ===============================================================
    
    /**
     * emailjs.sendForm() envía el formulario completo
     * Parámetros:
     * 1. SERVICE_ID: servicio de correo configurado
     * 2. TEMPLATE_ID: plantilla de correo a usar
     * 3. form: elemento formulario con todos los datos
     * 
     * Retorna una Promise que maneja éxito/error
     */
    emailjs.sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, form)
      .then(function(response) {
        // ===============================================================
        // MANEJO DE ENVÍO EXITOSO
        // ===============================================================
        
        console.log('Email enviado exitosamente:', response);
        
        // Ocultar mensaje de "enviando"
        sendingMessage.style.display = 'none';
        
        // Mostrar mensaje de éxito
        successMessage.style.display = 'block';
        
        // Limpiar formulario completamente
        form.reset();
        
        // Resetear contador de comentarios si existe
        if (commentsCounter) {
          commentsCounter.textContent = '0 / 2000 caracteres';
        }
        
        // Restaurar estado original del botón
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar información';
        
        // Redirigir a página de agradecimiento después de 3 segundos
        setTimeout(function() {
          window.location.href = 'gracias.html';
        }, 3000);
        
      })
      .catch(function(error) {
        // ===============================================================
        // MANEJO DE ERROR EN ENVÍO
        // ===============================================================
        
        console.error('Error al enviar email:', error);
        
        // Ocultar mensaje de "enviando"
        sendingMessage.style.display = 'none';
        
        // Mostrar mensaje de error
        errorMessage.style.display = 'block';
        
        // Restaurar estado original del botón para permitir reintento
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar información';
      });
  });

  // Log final para confirmar inicialización completa
  console.log('Script inicializado correctamente');
});
