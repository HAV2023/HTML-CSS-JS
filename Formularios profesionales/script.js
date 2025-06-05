/**
 * ===============================================================================
 * SCRIPT.JS — VALIDACIÓN AVANZADA DE FORMULARIO PROFESIONAL
 * ===============================================================================
 * 
 * Autor: Hector Arciniega
 * Proyecto: Formulario de Registro Profesional con Envío por Email
 * Versión: 2.0
 * Fecha de creación: 26/05/2025
 * Fecha última actualización: 04/06/2025
 * 
 * DESCRIPCIÓN GENERAL:
 * -------------------
 * Este script implementa un sistema completo de validación de formularios
 * del lado del cliente (front-end) con las siguientes características:
 * 
 * ✅ FUNCIONALIDADES PRINCIPALES:
 * - Validación en tiempo real de todos los campos del formulario
 * - Transformación automática de texto a mayúsculas en campos específicos
 * - Restricciones de entrada para evitar caracteres no deseados
 * - Toggle de visibilidad para campos de contraseña
 * - Contador de caracteres en tiempo real para textarea
 * - Mensajes de error personalizados y accesibles
 * - Envío seguro del formulario a través de FormSubmit
 * - Compatibilidad con tecnologías de asistencia (aria-*)
 * 
 * ✅ CAMPOS VALIDADOS:
 * - Nombre completo (solo letras, sin números)
 * - Correo electrónico (formato válido + confirmación)
 * - Contraseña (complejidad + confirmación)
 * - Edad (rango numérico válido)
 * - Fecha de nacimiento (no futura)
 * - Comentarios (límite de caracteres)
 * 
 * ✅ TECNOLOGÍAS UTILIZADAS:
 * - JavaScript ES6+ (const, let, arrow functions, template literals)
 * - DOM API (querySelector, addEventListener, etc.)
 * - HTML5 Validation API (checkValidity)
 * - ARIA para accesibilidad
 * - Regular Expressions para validación de patrones
 * 
 * ===============================================================================
 */

// ===============================================================================
// PUNTO DE ENTRADA: EVENTO DOM CONTENT LOADED
// ===============================================================================

/**
 * Event Listener principal que se ejecuta cuando todo el DOM ha sido cargado.
 * 
 * ¿Por qué usar DOMContentLoaded?
 * - Garantiza que todos los elementos HTML estén disponibles antes de ejecutar JS
 * - Es más rápido que window.onload (no espera imágenes, CSS externos, etc.)
 * - Evita errores de "elemento no encontrado" si el script se ejecuta antes del HTML
 * 
 * SINTAXIS: document.addEventListener('DOMContentLoaded', callback)
 * PARÁMETROS: 
 * - 'DOMContentLoaded': string - Nombre del evento a escuchar
 * - () => {...}: función arrow - Callback que se ejecuta cuando el evento ocurre
 */
document.addEventListener('DOMContentLoaded', () => {

  // ===============================================================================
  // SECCIÓN 1: CAPTURA DE REFERENCIAS A ELEMENTOS DEL DOM
  // ===============================================================================

  /**
   * SUBSECCIÓN 1.1: ELEMENTOS PRINCIPALES DEL FORMULARIO
   * ---------------------------------------------------
   * Almacenamos referencias a los elementos más importantes del formulario
   * para evitar consultas repetidas al DOM (mejora el rendimiento).
   */

  /**
   * Referencia al elemento <form> principal
   * getElementById() busca un elemento por su atributo id único
   * Es más rápido que querySelector() para IDs específicos
   */
  const form = document.getElementById('professionalForm');

  /**
   * Referencia al contenedor del mensaje de éxito
   * Se muestra/oculta dinámicamente según el resultado de la validación
   */
  const success = document.getElementById('successMessage');

  /**
   * SUBSECCIÓN 1.2: CAMPOS DE ENTRADA (INPUTS)
   * ------------------------------------------
   * Cada const almacena la referencia a un campo específico del formulario.
   * Usar const previene reasignación accidental de estas referencias críticas.
   */

  /**
   * Campo: Nombre completo
   * Restricciones aplicadas: Solo letras, sin números, transformación a mayúsculas
   */
  const nameIn = document.getElementById('name');

  /**
   * Campo: Correo electrónico principal
   * Validaciones: Formato de email válido según RFC 5322
   */
  const emailIn = document.getElementById('email');

  /**
   * Campo: Confirmación de correo electrónico
   * Validaciones: Debe coincidir exactamente con emailIn
   */
  const emailC = document.getElementById('emailConfirm');

  /**
   * Campo: Contraseña principal
   * Validaciones: Mínimo 8 caracteres, al menos 1 mayúscula y 1 minúscula
   */
  const passIn = document.getElementById('password');

  /**
   * Campo: Confirmación de contraseña
   * Validaciones: Debe coincidir exactamente con passIn
   */
  const passC = document.getElementById('passwordConfirm');

  /**
   * Campo: Edad
   * Restricciones: Solo números, rango entre 1 y 120
   */
  const ageIn = document.getElementById('age');

  /**
   * Campo: Fecha de nacimiento
   * Restricciones: No puede ser fecha futura, formato de fecha válido
   */
  const birthIn = document.getElementById('birthdate');

  /**
   * Campo: Comentarios (textarea)
   * Restricciones: Máximo 2000 caracteres
   */
  const commIn = document.getElementById('comments');

  /**
   * Elemento: Contador de caracteres para comentarios
   * Muestra dinámicamente: "X / 2000 caracteres"
   */
  const commCnt = document.getElementById('commentsCounter');

  /**
   * SUBSECCIÓN 1.3: BOTONES DE TOGGLE PARA CONTRASEÑAS
   * --------------------------------------------------
   * Estos botones alternan la visibilidad de las contraseñas (👁️ / 🙈)
   */

  /**
   * Botón toggle para mostrar/ocultar contraseña principal
   */
  const togP = document.getElementById('togglePassword');

  /**
   * Botón toggle para mostrar/ocultar confirmación de contraseña
   */
  const togPC = document.getElementById('togglePasswordConfirm');

  // ===============================================================================
  // SECCIÓN 2: CONFIGURACIÓN INICIAL Y RESTRICCIONES DE INTERFAZ
  // ===============================================================================

  /**
   * SUBSECCIÓN 2.1: CONFIGURACIÓN DE FECHA MÁXIMA
   * ---------------------------------------------
   * Establece la fecha máxima permitida para el campo de fecha de nacimiento.
   * Previene que los usuarios seleccionen fechas futuras.
   */

  if (birthIn) {
    /**
     * new Date() - Crea objeto Date con la fecha/hora actual
     * .toISOString() - Convierte a formato ISO: "2025-06-04T15:30:00.000Z"
     * .split('T')[0] - Separa por 'T' y toma solo la parte de fecha: "2025-06-04"
     * .max - Atributo HTML que establece la fecha máxima seleccionable
     */
    birthIn.max = new Date().toISOString().split('T')[0];
  }

  /**
   * SUBSECCIÓN 2.2: TRANSFORMACIÓN AUTOMÁTICA A MAYÚSCULAS
   * ------------------------------------------------------
   * Convierte automáticamente el texto a mayúsculas mientras el usuario escribe
   * en campos de tipo "text" (nombre, edad se maneja por separado).
   */

  /**
   * form.querySelectorAll() - Busca TODOS los elementos que coincidan con el selector
   * 'input[type="text"]' - Selector CSS que encuentra inputs con type="text"
   * .forEach() - Itera sobre cada elemento encontrado
   * inp - Parámetro que representa cada input individual en la iteración
   */
  form.querySelectorAll('input[type="text"]').forEach(inp => {
    /**
     * addEventListener('input', callback) - Escucha el evento 'input'
     * Evento 'input' se dispara cada vez que el valor del campo cambia
     * (escribir, borrar, pegar, etc.)
     */
    inp.addEventListener('input', () => {
      /**
       * inp.value - Obtiene el valor actual del campo
       * .toUpperCase() - Convierte todo el texto a mayúsculas
       * inp.value = - Asigna el nuevo valor transformado de vuelta al campo
       */
      inp.value = inp.value.toUpperCase();
    });
  });

  /**
   * SUBSECCIÓN 2.3: CONTADOR DE CARACTERES DINÁMICO
   * -----------------------------------------------
   * Actualiza en tiempo real el contador "X / 2000 caracteres" del textarea
   */

  /**
   * Verificación de existencia: Previene errores si los elementos no existen
   * Uso del operador && (AND lógico): Solo ejecuta si ambos elementos existen
   */
  if (commIn && commCnt) {
    /**
     * Evento 'input' en textarea: Se dispara cada vez que el contenido cambia
     */
    commIn.addEventListener('input', () => {
      /**
       * Template literal (${}) - Sintaxis ES6 para interpolación de variables
       * commIn.value.length - Obtiene la longitud actual del texto
       * .textContent - Establece el contenido de texto (sin HTML)
       */
      commCnt.textContent = `${commIn.value.length} / 2000 caracteres`;
    });
  }

  /**
   * SUBSECCIÓN 2.4: FUNCIONALIDAD DE TOGGLE DE CONTRASEÑAS
   * ------------------------------------------------------
   * Implementa la funcionalidad de mostrar/ocultar contraseñas con iconos
   */

  /**
   * FUNCIÓN: toggleVisibility
   * -------------------------
   * Función pura que alterna entre mostrar y ocultar la contraseña
   * 
   * PARÁMETROS:
   * @param {HTMLInputElement} inputField - El campo de contraseña a modificar
   * @param {HTMLButtonElement} button - El botón que contiene el icono
   * 
   * LÓGICA:
   * - Si type="password" → cambia a type="text" (muestra contraseña) + icono 🙈
   * - Si type="text" → cambia a type="password" (oculta contraseña) + icono 👁️
   */
  function toggleVisibility(inputField, button) {
    /**
     * Condicional: Verifica el tipo actual del input
     */
    if (inputField.type === 'password') {
      /**
       * RAMA 1: Mostrar contraseña
       * inputField.type = 'text' - Cambia el tipo para mostrar el contenido
       * button.textContent = '🙈' - Cambia el icono a "no mirar"
       */
      inputField.type = 'text';
      button.textContent = '🙈'; // Icono: "Ocultar contraseña"
    } else {
      /**
       * RAMA 2: Ocultar contraseña
       * inputField.type = 'password' - Cambia el tipo para ocultar el contenido
       * button.textContent = '👁️' - Cambia el icono a "mirar"
       */
      inputField.type = 'password';
      button.textContent = '👁️'; // Icono: "Mostrar contraseña"
    }
  }

  /**
   * Event Listeners para los botones de toggle
   * Uso de arrow functions para llamar a toggleVisibility con parámetros específicos
   */
  togP.addEventListener('click', () => toggleVisibility(passIn, togP));
  togPC.addEventListener('click', () => toggleVisibility(passC, togPC));

  /**
   * SUBSECCIÓN 2.5: RESTRICCIÓN NUMÉRICA PARA CAMPO EDAD
   * ----------------------------------------------------
   * Permite solo dígitos en el campo edad, eliminando cualquier otro carácter
   */

  if (ageIn) {
    /**
     * Evento 'input': Se ejecuta cada vez que el valor cambia
     */
    ageIn.addEventListener('input', () => {
      /**
       * EXPRESIÓN REGULAR: /\D/g
       * - \D: Coincide con cualquier carácter que NO sea un dígito (0-9)
       * - g: Bandera global, reemplaza TODAS las ocurrencias, no solo la primera
       * .replace(/\D/g, '') - Reemplaza todos los no-dígitos con cadena vacía
       */
      ageIn.value = ageIn.value.replace(/\D/g, '');
    });
  }

  /**
   * SUBSECCIÓN 2.6: RESTRICCIÓN ANTI-NÚMEROS PARA CAMPO NOMBRE
   * ----------------------------------------------------------
   * Previene la entrada de números en el campo nombre, tanto al escribir como al pegar
   */

  if (nameIn) {
    /**
     * RESTRICCIÓN 1: Al escribir
     * Elimina números en tiempo real mientras el usuario escribe
     */
    nameIn.addEventListener('input', () => {
      /**
       * EXPRESIÓN REGULAR: /[0-9]/g
       * - [0-9]: Clase de caracteres que coincide con cualquier dígito
       * - g: Bandera global para reemplazar todas las ocurrencias
       */
      nameIn.value = nameIn.value.replace(/[0-9]/g, '');
    });

    /**
     * RESTRICCIÓN 2: Al pegar contenido
     * Maneja el caso específico cuando el usuario pega texto con Ctrl+V
     */
    nameIn.addEventListener('paste', (e) => {
      /**
       * e.clipboardData.getData('text') - Obtiene el texto del portapapeles
       * Se ejecuta ANTES de que el texto se pegue en el campo
       */
      const pasted = e.clipboardData.getData('text');

      /**
       * EXPRESIÓN REGULAR: /\d/
       * - \d: Coincide con cualquier dígito (equivalente a [0-9])
       * .test() - Método que devuelve true si encuentra al menos una coincidencia
       */
      if (/\d/.test(pasted)) {
        /**
         * e.preventDefault() - Cancela el evento de pegado por defecto
         * Previene que el texto original (con números) se pegue
         */
        e.preventDefault();

        /**
         * += - Operador de concatenación
         * Añade al valor actual solo la parte del texto pegado SIN números
         */
        nameIn.value += pasted.replace(/[0-9]/g, '');
      }
    });
  }

  // ===============================================================================
  // SECCIÓN 3: SISTEMA DE VALIDACIÓN Y ENVÍO DEL FORMULARIO
  // ===============================================================================

  /**
   * EVENTO PRINCIPAL: SUBMIT DEL FORMULARIO
   * ---------------------------------------
   * Se ejecuta cuando el usuario presiona el botón "Enviar información"
   * o cuando se activa el envío por otros medios (Enter, etc.)
   */
  form.addEventListener('submit', e => {
    /**
     * e.preventDefault() - Previene el comportamiento por defecto del formulario
     * ¿Por qué? Para ejecutar nuestras validaciones ANTES del envío real
     * Si las validaciones fallan, el formulario no se enviará
     */
    e.preventDefault();

    /**
     * Variable de control de validación
     * let (no const) porque su valor puede cambiar durante las validaciones
     * Inicializada como true (optimista): asume que todo estará bien
     */
    let valid = true;

    /**
     * SUBSECCIÓN 3.1: FUNCIONES AUXILIARES PARA MANEJO DE ERRORES
     * -----------------------------------------------------------
     * Estas funciones centralizan la lógica de mostrar/ocultar mensajes de error
     */

    /**
     * FUNCIÓN: showErr
     * ----------------
     * Muestra un mensaje de error específico bajo un campo
     * 
     * @param {string} id - ID del elemento contenedor del mensaje de error
     * @param {string} msg - Texto del mensaje a mostrar
     */
    const showErr = (id, msg) => {
      /**
       * Busca el elemento contenedor del error por su ID
       */
      const el = document.getElementById(id);
      
      /**
       * .textContent - Establece el texto del mensaje (escapa HTML automáticamente)
       * Más seguro que .innerHTML para texto plano
       */
      el.textContent = msg;
      
      /**
       * .style.display = 'block' - Hace visible el elemento
       * Por CSS, los mensajes están display: none por defecto
       */
      el.style.display = 'block';
    };

    /**
     * FUNCIÓN: hideErr
     * ----------------
     * Oculta un mensaje de error y limpia su contenido
     * 
     * @param {string} id - ID del elemento contenedor del mensaje de error
     */
    const hideErr = id => {
      /**
       * Obtiene referencia al elemento de error
       */
      const el = document.getElementById(id);
      
      /**
       * Oculta el elemento estableciendo display: none
       */
      el.style.display = 'none';
      
      /**
       * Limpia el contenido de texto para la próxima validación
       */
      el.textContent = '';
    };

    /**
     * SUBSECCIÓN 3.2: VALIDACIONES INDIVIDUALES POR CAMPO
     * ---------------------------------------------------
     * Cada bloque valida un campo específico siguiendo el mismo patrón:
     * 1. Aplicar regla de validación
     * 2. Si falla: marcar como inválido, mostrar error, establecer aria-invalid
     * 3. Si pasa: ocultar error, quitar aria-invalid
     */

    /**
     * VALIDACIÓN 1: NOMBRE COMPLETO
     * -----------------------------
     * Reglas: Solo letras (incluye acentos españoles y Ñ) y espacios
     */
    
    /**
     * EXPRESIÓN REGULAR: /^[A-ZÁÉÍÓÚÑ\s]+$/
     * - ^: Inicio de cadena (debe comenzar con caracteres válidos)
     * - [A-ZÁÉÍÓÚÑ\s]: Clase de caracteres permitidos
     *   - A-Z: Letras mayúsculas básicas
     *   - ÁÉÍÓÚÑ: Acentos y Ñ españoles
     *   - \s: Espacios en blanco
     * - +: Uno o más caracteres de la clase anterior
     * - $: Final de cadena (debe terminar con caracteres válidos)
     * 
     * nameIn.value.trim() - Elimina espacios al inicio y final
     * .test() - Retorna true si la cadena coincide completamente con el patrón
     * ! - Operador NOT, invierte el resultado (true si NO coincide)
     */
    if (!/^[A-ZÁÉÍÓÚÑ\s]+$/.test(nameIn.value.trim())) {
      valid = false; // Marca el formulario como inválido
      showErr('error-name', 'Sólo letras y espacios.'); // Muestra mensaje específico
      nameIn.setAttribute('aria-invalid', 'true'); // Accesibilidad: marca campo como inválido
    } else {
      hideErr('error-name'); // Oculta mensaje de error
      nameIn.removeAttribute('aria-invalid'); // Accesibilidad: marca campo como válido
    }

    /**
     * VALIDACIÓN 2: CORREO ELECTRÓNICO
     * --------------------------------
     * Utiliza la validación nativa del navegador para type="email"
     */
    
    /**
     * Doble verificación:
     * 1. !emailIn.value - Verifica que no esté vacío
     * 2. !emailIn.checkValidity() - Usa la API nativa de validación HTML5
     * 
     * checkValidity() valida según:
     * - El type="email" del input
     * - El atributo required
     * - Cualquier patrón adicional definido
     */
    if (!emailIn.value || !emailIn.checkValidity()) {
      valid = false;
      showErr('error-email', 'Correo inválido.');
      emailIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-email');
      emailIn.removeAttribute('aria-invalid');
    }

    /**
     * VALIDACIÓN 3: CONFIRMACIÓN DE CORREO
     * ------------------------------------
     * Regla: Debe coincidir exactamente con el correo principal
     */
    
    /**
     * Comparación estricta (===) de valores de ambos campos
     * !== - Operador "no estrictamente igual"
     */
    if (emailC.value !== emailIn.value) {
      valid = false;
      showErr('error-emailConfirm', 'Los correos no coinciden.');
      emailC.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-emailConfirm');
      emailC.removeAttribute('aria-invalid');
    }

    /**
     * VALIDACIÓN 4: CONTRASEÑA PRINCIPAL
     * ----------------------------------
     * Reglas: Mínimo 8 caracteres, al menos 1 mayúscula Y 1 minúscula
     */
    
    /**
     * Variable auxiliar que evalúa múltiples condiciones:
     * 
     * CONDICIÓN 1: passIn.value.length >= 8
     * - Verifica longitud mínima de 8 caracteres
     * 
     * CONDICIÓN 2: /[a-z]/.test(passIn.value)
     * - Regex [a-z]: Coincide con al menos una letra minúscula
     * - .test(): Retorna true si encuentra al menos una coincidencia
     * 
     * CONDICIÓN 3: /[A-Z]/.test(passIn.value)
     * - Regex [A-Z]: Coincide con al menos una letra mayúscula
     * 
     * Operador &&: TODAS las condiciones deben ser true para que passOK sea true
     */
    const passOK =
      passIn.value.length >= 8 &&
      /[a-z]/.test(passIn.value) &&
      /[A-Z]/.test(passIn.value);

    /**
     * Si cualquier condición falla, passOK será false
     */
    if (!passOK) {
      valid = false;
      showErr('error-password', 'Mín. 8 caracteres, mayúsculas y minúsculas.');
      passIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-password');
      passIn.removeAttribute('aria-invalid');
    }

    /**
     * VALIDACIÓN 5: CONFIRMACIÓN DE CONTRASEÑA
     * ----------------------------------------
     * Regla: Debe coincidir exactamente con la contraseña principal
     */
    if (passC.value !== passIn.value) {
      valid = false;
      showErr('error-passwordConfirm', 'Las contraseñas no coinciden.');
      passC.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-passwordConfirm');
      passC.removeAttribute('aria-invalid');
    }

    /**
     * VALIDACIÓN 6: EDAD
     * ------------------
     * Reglas: Debe ser un número válido entre 1 y 120
     */
    
    /**
     * Number(ageIn.value) - Convierte el string a número
     * Si el string no es numérico, retorna NaN (Not a Number)
     */
    const ageVal = Number(ageIn.value);
    
    /**
     * Triple verificación:
     * 1. !ageVal - Verifica que no sea 0, NaN, null, undefined, o string vacío
     * 2. ageVal < 1 - Verifica que no sea menor a 1
     * 3. ageVal > 120 - Verifica que no sea mayor a 120
     * 
     * Operador || - Si CUALQUIERA de las condiciones es true, la validación falla
     */
    if (!ageVal || ageVal < 1 || ageVal > 120) {
      valid = false;
      showErr('error-age', 'Edad entre 1 y 120.');
      ageIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-age');
      ageIn.removeAttribute('aria-invalid');
    }

    /**
     * VALIDACIÓN 7: FECHA DE NACIMIENTO
     * ---------------------------------
     * Reglas: No puede estar vacía y no puede ser fecha futura
     */
    
    /**
     * Doble verificación:
     * 1. !birthIn.value - Verifica que no esté vacío
     * 2. new Date(birthIn.value) > new Date() - Compara fechas
     * 
     * new Date(birthIn.value) - Crea objeto Date desde string "YYYY-MM-DD"
     * new Date() - Crea objeto Date con fecha/hora actual
     * > - Operador de comparación entre fechas
     */
    if (!birthIn.value || new Date(birthIn.value) > new Date()) {
      valid = false;
      showErr('error-birthdate', 'Fecha inválida.');
      birthIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-birthdate');
      birthIn.removeAttribute('aria-invalid');
    }

    /**
     * VALIDACIÓN 8: COMENTARIOS
     * -------------------------
     * Regla: Máximo 2000 caracteres (campo opcional, pero con límite)
     */
    
    /**
     * .length - Propiedad que retorna el número de caracteres en el string
     * > 2000 - Verifica si excede el límite establecido
     */
    if (commIn.value.length > 2000) {
      valid = false;
      showErr('error-comments', 'Máx. 2000 caracteres.');
      commIn.setAttribute('aria-invalid', 'true');
    } else {
      hideErr('error-comments');
      commIn.removeAttribute('aria-invalid');
    }

    /**
     * SUBSECCIÓN 3.3: LÓGICA DE ENVÍO FINAL
     * -------------------------------------
     * Decide si enviar el formulario o mantener los errores visibles
     */

    /**
     * Verificación final: Si todas las validaciones pasaron (valid === true)
     */
    if (valid) {
      /**
       * PASO 1: Ocultar mensaje de éxito local
       * (FormSubmit manejará la confirmación después del envío)
       */
      success.style.display = 'none';
      
      /**
       * PASO 2: Remover el event listener para evitar bucle infinito
       * arguments.callee - Referencia a la función actual (este event listener)
       * Esta técnica previene que se ejecute nuevamente la validación al enviar
       */
      form.removeEventListener('submit', arguments.callee);
      
      /**
       * PASO 3: Enviar el formulario a FormSubmit
       * .submit() - Método nativo que envía el formulario usando la action URL
       * En este punto, el navegador enviará los datos a https://formsubmit.co/email
       */
      form.submit();
    } else {
      /**
       * Si hay errores: Mantener oculto el mensaje de éxito
       * Los mensajes de error específicos ya están visibles por las validaciones anteriores
       */
      success.style.display = 'none';
    }
  });

  /**
   * ===============================================================================
   * FIN DEL EVENT LISTENER PRINCIPAL (DOMContentLoaded)
   * ===============================================================================
   */
});

/**
 * ===============================================================================
 * DOCUMENTACIÓN ADICIONAL: CONCEPTOS TÉCNICOS UTILIZADOS
 * ===============================================================================
 * 
 * 🔍 PATRONES DE DISEÑO IMPLEMENTADOS:
 * 
 * 1. EVENT-DRIVEN PROGRAMMING:
 *    - Todo el código responde a eventos del usuario (input, click, submit)
 *    - Permite una interfaz reactiva y en tiempo real
 * 
 * 2. SEPARATION OF CONCERNS:
 *    - Validación separada de presentación
 *    - Funciones auxiliares para tareas específicas
 *    - Lógica de UI separada de lógica de negocio
 * 
 * 3. PROGRESSIVE ENHANCEMENT:
 *    - Funciona sin JavaScript (formulario básico)
 *    - JavaScript añade mejoras (validación, UX)
 *    - Degradación elegante en navegadores antiguos
 * 
 * 🔧 TÉCNICAS DE OPTIMIZACIÓN:
 * 
 * 1. DOM CACHING:
 *    - Referencias almacenadas en constantes
 *    - Evita consultas repetidas al DOM
 *    - Mejora significativa de rendimiento
 * 
 * 2. EVENT DELEGATION:
 *    - Un solo listener para múltiples inputs de texto
 *    - Reduce memoria y mejora mantenibilidad
 * 
 * 3. LAZY EVALUATION:
 *    - Validaciones solo cuando es necesario
 *    - Verificaciones de existencia antes de usar elementos
 * 
 * 🛡️ SEGURIDAD Y ACCESIBILIDAD:
 * 
 * 1. VALIDACIÓN DUAL:
 *    - Cliente (este script) + Servidor (recomendado)
 *    - Nunca confiar solo en validación del cliente
 * 
 * 2. ARIA ATTRIBUTES:
 *    - aria-invalid para tecnologías de asistencia
 *    - aria-live para anuncios dinámicos
 *    - Mejora accesibilidad para usuarios con discapacidades
 * 
 * 3. SANITIZACIÓN:
 *    - textContent en lugar de innerHTML
 *    - Previene inyección de código malicioso
 * 
 * 📱 COMPATIBILIDAD:
 * 
 * - ES6+ (Soportado en navegadores modernos desde 2017)
 * - HTML5 Validation API (Soporte universal)
 * - CSS3 Selectors (Soporte universal)
 * - FormData API (Para envío de formularios)
 * 
 * 🔄 FLUJO DE EJECUCIÓN:
 * 
 * 1. Usuario carga página → DOMContentLoaded se dispara
 * 2. Script captura referencias y configura listeners
