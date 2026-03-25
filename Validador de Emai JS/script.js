/* ==========================================================================
   ARCHIVO: script.js
   PROPÓSITO: Lógica de validación de formulario con explicación sintáctica.
   OBJETIVO: Que el alumno entienda la función de cada token y estructura.
   Autor: Dr. Héctor Arciniega Valencia
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. DECLARACIÓN DE VARIABLES Y SELECCIÓN DEL DOM
   -------------------------------------------------------------------------- */

// TOKENS: const | form | = | document | . | getElementById | ( | 'loginForm' | ) | ;
// EXPLICACIÓN:
// 'const': Palabra reservada. Declara una variable de solo lectura (no se puede reasignar).
// 'form': Identificador. Nombre que le damos a la variable para usarla después.
// '=': Operador de asignación. Guarda el valor de la derecha en la variable de la izquierda.
// 'document': Objeto global. Representa toda la página web cargada en el navegador.
// '.': Operador de punto. Permite acceder a las propiedades o métodos dentro de 'document'.
// 'getElementById': Método. Función nativa para buscar un elemento por su atributo ID.
// '(': Abre paréntesis. Indica inicio de los argumentos para el método.
// ''loginForm'': String. Texto literal que debe coincidir exactamente con el ID en el HTML.
// ')': Cierra paréntesis. Indica fin de los argumentos.
// ';': Punto y coma. Marca el fin formal de la instrucción.
const form = document.getElementById('loginForm');

// TOKENS: const | emailInput | = | document | . | getElementById | ( | 'email' | ) | ;
// EXPLICACIÓN:
// Se repite la estructura anterior. Aquí guardamos la referencia al campo de texto del correo.
// Es importante guardar la referencia en una variable para no buscar el elemento cada vez.
const emailInput = document.getElementById('email');

// TOKENS: const | passwordInput | = | document | . | getElementById | ( | 'password' | ) | ;
// EXPLICACIÓN:
// Guardamos la referencia al campo de contraseña para poder leer su valor o cambiar su estilo.
const passwordInput = document.getElementById('password');

// TOKENS: const | emailError | = | document | . | getElementById | ( | 'emailError' | ) | ;
// EXPLICACIÓN:
// Guardamos la referencia al elemento <span> donde mostraremos el mensaje de error del email.
// Necesitamos esto para poder cambiar su estilo (mostrar/ocultar) desde JavaScript.
const emailError = document.getElementById('emailError');

// TOKENS: const | passwordError | = | document | . | getElementById | ( | 'passwordError' | ) | ;
// EXPLICACIÓN:
// Guardamos la referencia al elemento <span> para el error de contraseña.
const passwordError = document.getElementById('passwordError');

// TOKENS: const | successMessage | = | document | . | getElementById | ( | 'successMessage' | ) | ;
// EXPLICACIÓN:
// Guardamos la referencia al elemento <p> para el mensaje de éxito final.
const successMessage = document.getElementById('successMessage');


/* --------------------------------------------------------------------------
   2. FUNCIÓN DE VALIDACIÓN DE CORREO
   -------------------------------------------------------------------------- */

// TOKENS: function | validarEmail | ( | email | ) | {
// EXPLICACIÓN:
// 'function': Palabra reservada. Indica que vamos a definir un bloque de código reutilizable.
// 'validarEmail': Identificador. Nombre de la función. Debe ser descriptivo.
// '(': Abre paréntesis. Inicio de la lista de parámetros.
// 'email': Parámetro. Variable local que recibirá el valor cuando llamemos a la función.
// ')': Cierra paréntesis. Fin de la lista de parámetros.
// '{': Abre llave. Indica el inicio del cuerpo de la función.
function validarEmail(email) {

    // TOKENS: return | email | . | includes | ( | '@' | ) | && | email | . | includes | ( | '.' | ) | ;
    // EXPLICACIÓN:
    // 'return': Palabra reservada. Devuelve un valor y termina la función inmediatamente.
    // 'email': Variable. Usamos el valor recibido como parámetro.
    // '.': Operador de punto. Accede a los métodos del tipo String (texto).
    // 'includes': Método. Verifica si el texto contiene una subcadena específica. Devuelve true/false.
    // '(': Abre paréntesis del método.
    // ''@'': String. Caracter que buscamos dentro del texto.
    // ')': Cierra paréntesis del método.
    // '&&': Operador lógico Y (AND). Exige que ambas condiciones sean verdaderas.
    // 'email.includes('.')': Segunda condición. Verifica si hay un punto en el texto.
    // ';': Fin de la instrucción de retorno.
    // LÓGICA: Si hay arroba Y hay punto, devuelve true. Si no, devuelve false.
    return email.includes('@') && email.includes('.');
} 
// TOKENS: }
// EXPLICACIÓN:
// '}': Cierra llave. Indica el fin del cuerpo de la función.


/* --------------------------------------------------------------------------
   3. ESCUCHA DE EVENTOS (EVENT LISTENER)
   -------------------------------------------------------------------------- */

// TOKENS: form | . | addEventListener | ( | 'submit' | , | function | ( | e | ) | {
// EXPLICACIÓN:
// 'form': Variable. Usamos la referencia al formulario que guardamos al inicio.
// '.': Operador de punto. Accede a los métodos del elemento formulario.
// 'addEventListener': Método. Permite registrar una función para cuando ocurra un evento.
// '(': Abre paréntesis de los argumentos del método.
// ''submit'': String. Tipo de evento. 'submit' ocurre cuando se envía el formulario.
// ',': Coma. Separa los argumentos del método.
// 'function': Palabra reservada. Definimos una función anónima (sin nombre) aquí mismo.
// '(': Paréntesis de parámetros de la función anónima.
// 'e': Parámetro. Representa el objeto 'evento'. Contiene datos sobre lo que sucedió.
// ')': Cierra paréntesis de parámetros.
// '{': Abre llave. Inicio del bloque de código que se ejecuta al enviar el formulario.
form.addEventListener('submit', function(e) {

    /* ----------------------------------------------------------------------
       3.1. PREVENIR COMPORTAMIENTO POR DEFECTO
       ---------------------------------------------------------------------- */
    
    // TOKENS: e | . | preventDefault | ( | ) | ;
    // EXPLICACIÓN:
    // 'e': Variable. Objeto evento recibido como argumento.
    // '.': Operador de punto. Accede a los métodos del evento.
    // 'preventDefault': Método. Cancela la acción predeterminada del navegador.
    // '()': Paréntesis vacíos. Este método no requiere argumentos.
    // ';': Fin de instrucción.
    // RAZÓN: Por defecto, el formulario recarga la página. Esto lo evita para validar con JS.
    e.preventDefault();

    /* ----------------------------------------------------------------------
       3.2. INICIALIZAR VARIABLE DE ESTADO
       ---------------------------------------------------------------------- */

    // TOKENS: let | isValid | = | true | ;
    // EXPLICACIÓN:
    // 'let': Palabra reservada. Declara una variable que puede cambiar de valor.
    // 'isValid': Identificador. Nombre de la variable de control (bandera).
    // '=': Asignación.
    // 'true': Booleano. Valor verdadero. Asumimos que todo está bien al inicio.
    // ';': Fin de instrucción.
    // RAZÓN: Necesitamos un indicador para saber si hubo errores durante las validaciones.
    let isValid = true;

    /* ----------------------------------------------------------------------
       3.3. LIMPIEZA DE INTERFAZ (RESET)
       ---------------------------------------------------------------------- */

    // TOKENS: emailError | . | style | . | display | = | 'none' | ;
    // EXPLICACIÓN:
    // 'emailError': Variable. Referencia al elemento HTML del error.
    // '.style': Propiedad. Accede a los estilos CSS en línea del elemento.
    // '.display': Propiedad CSS. Controla si el elemento se muestra o no.
    // '=': Asignación.
    // ''none'': String. Valor CSS para ocultar el elemento completamente.
    // ';': Fin de instrucción.
    // RAZÓN: Ocultamos mensajes de errores anteriores antes de validar de nuevo.
    emailError.style.display = 'none';
    passwordError.style.display = 'none';
    successMessage.style.display = 'none';
    
    // TOKENS: emailInput | . | style | . | borderColor | = | '#ddd' | ;
    // EXPLICACIÓN:
    // '.borderColor': Propiedad CSS. Controla el color del borde del input.
    // ''#ddd'': String. Código hexadecimal para un color gris claro (estado normal).
    // RAZÓN: Resetear el color del borde para quitar indicaciones de error previas.
    emailInput.style.borderColor = '#ddd';
    passwordInput.style.borderColor = '#ddd';

    /* ----------------------------------------------------------------------
       3.4. VALIDACIÓN DEL CORREO ELECTRÓNICO
       ---------------------------------------------------------------------- */

    // TOKENS: const | emailValor | = | emailInput | . | value | . | trim | ( | ) | ;
    // EXPLICACIÓN:
    // 'emailInput.value': Propiedad. Obtiene el texto escrito dentro del input.
    // '.trim()': Método. Elimina espacios en blanco al inicio y al final del texto.
    // RAZÓN: Evitar que un usuario apruebe con solo espacios o espacios sobrando.
    const emailValor = emailInput.value.trim();

    // TOKENS: if | ( | ! | validarEmail | ( | emailValor | ) | ) | {
    // EXPLICACIÓN:
    // 'if': Palabra reservada. Inicia una condicional.
    // '(': Abre condición.
    // '!': Operador lógico NO (NOT). Invierte el valor booleano.
    // 'validarEmail(emailValor)': Llamada a la función. Devuelve true o false.
    // LÓGICA: Si la función devuelve true (válido), el '!' lo vuelve false (no entra).
    //         Si la función devuelve false (inválido), el '!' lo vuelve true (entra al if).
    // '{': Abre bloque que se ejecuta si la condición es verdadera (hay error).
    if (!validarEmail(emailValor)) {
        
        // TOKENS: emailError | . | style | . | display | = | 'block' | ;
        // EXPLICACIÓN:
        // ''block'': Valor CSS. Hace que el elemento sea visible como bloque.
        // RAZÓN: Mostramos el mensaje de error porque la validación falló.
        emailError.style.display = 'block';
        
        // TOKENS: emailInput | . | style | . | borderColor | = | '#dc3545' | ;
        // EXPLICACIÓN:
        // ''#dc3545'': Código hexadecimal para color rojo.
        // RAZÓN: Feedback visual inmediato al usuario sobre qué campo falla.
        emailInput.style.borderColor = '#dc3545';
        
        // TOKENS: isValid | = | false | ;
        // EXPLICACIÓN:
        // Actualizamos la variable de control. Marcamos que hay un error en el formulario.
        isValid = false;
    } 
    // TOKENS: }
    // EXPLICACIÓN: Fin del bloque condicional del email.

    /* ----------------------------------------------------------------------
       3.5. VALIDACIÓN DE LA CONTRASEÑA
       ---------------------------------------------------------------------- */

    // TOKENS: const | passwordValor | = | passwordInput | . | value | . | trim | ( | ) | ;
    // EXPLICACIÓN:
    // Obtenemos el valor de la contraseña y eliminamos espacios accidentales.
    const passwordValor = passwordInput.value.trim();

    // TOKENS: if | ( | passwordValor | . | length | < | 6 | ) | {
    // EXPLICACIÓN:
    // '.length': Propiedad. Devuelve el número de caracteres del texto.
    // '<': Operador de comparación "menor que".
    // '6': Número literal. Mínimo de caracteres requeridos.
    // LÓGICA: Si la longitud es menor a 6, entramos al bloque de error.
    if (passwordValor.length < 6) {
        
        // TOKENS: passwordError | . | style | . | display | = | 'block' | ;
        // EXPLICACIÓN: Mostramos el mensaje de error de contraseña.
        passwordError.style.display = 'block';
        
        // TOKENS: passwordInput | . | style | . | borderColor | = | '#dc3545' | ;
        // EXPLICACIÓN: Pintamos el borde del input de contraseña en rojo.
        passwordInput.style.borderColor = '#dc3545';
        
        // TOKENS: isValid | = | false | ;
        // EXPLICACIÓN: Marcamos la variable de control como falsa (hay error).
        isValid = false;
    } 
    // TOKENS: }
    // EXPLICACIÓN: Fin del bloque condicional de contraseña.

    /* ----------------------------------------------------------------------
       3.6. RESULTADO FINAL Y ENVÍO
       ---------------------------------------------------------------------- */

    // TOKENS: if | ( | isValid | ) | {
    // EXPLICACIÓN:
    // Verificamos la variable de control.
    // Si es 'true', significa que ningún bloque 'if' anterior la cambió a 'false'.
    // Por lo tanto, todos los datos son correctos.
    if (isValid) {
        
        // TOKENS: successMessage | . | style | . | display | = | 'block' | ;
        // EXPLICACIÓN: Mostramos el mensaje de éxito en verde.
        successMessage.style.display = 'block';
        
        // TOKENS: setTimeout | ( | ( | ) | => | { | ... | } | , | 500 | ) | ;
        // EXPLICACIÓN:
        // 'setTimeout': Método nativo. Ejecuta código después de un tiempo.
        // '() => { ... }': Función flecha (arrow function). Código a ejecutar.
        // '500': Número. Tiempo en milisegundos (0.5 segundos).
        // RAZÓN: Simular un proceso de carga o espera antes de confirmar.
        setTimeout(() => {
            
            // TOKENS: alert | ( | '...' | ) | ;
            // EXPLICACIÓN:
            // 'alert': Función nativa. Muestra una ventana emergente del navegador.
            // RAZÓN: Confirmación final para el alumno de que la lógica funcionó.
            alert('Datos validados correctamente.');
        }, 500);
    }
    // TOKENS: }
    // EXPLICACIÓN: Fin del bloque condicional de éxito.

}); 
// TOKENS: ) | ;
// EXPLICACIÓN:
// ')': Cierra el paréntesis de argumentos de 'addEventListener'.
// ';': Fin de la instrucción completa del escuchador de eventos.