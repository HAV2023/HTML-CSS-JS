/* 
 * ==========================================================================
 * ARCHIVO: script.js - Lógica de la Calculadora de Precio Final
 * PROPÓSITO: Manejar la interacción del usuario, validar datos y mostrar resultados
 * ==========================================================================
 */

/* 
 * -------------------------------------------------------------------------
 * DECLARACIÓN DE FUNCIÓN
 * -------------------------------------------------------------------------
 * 'function': Palabra reservada que define un bloque de código reutilizable
 * 'calcularTotal': Nombre/identificador de la función (se llama desde el HTML)
 * '()': Paréntesis para parámetros (vacíos aquí porque leemos directamente del DOM)
 * '{': Llave de apertura que marca el INICIO del cuerpo de la función
 */
function calcularTotal() { // <- Esta función se ejecuta al hacer clic en el botón
    
    /* 
     * ---------------------------------------------------------------------
     * ACCESO AL DOM (Document Object Model)
     * ---------------------------------------------------------------------
     */
    
    // 'var': Declara una variable con ámbito de función (podría usarse 'let' para ámbito de bloque)
    // 'precioInput': Nombre que le damos a esta variable para almacenar el valor del precio
    // '=': Operador de asignación (guarda el resultado de la derecha en la variable de la izquierda)
    // 'document': Objeto global que representa toda la página HTML cargada en el navegador
    // '.': Operador de acceso a propiedad/método (conecta objetos con sus funciones)
    // 'getElementById()': Método que busca un elemento HTML usando su atributo 'id'
    // 'precio': Cadena de texto que debe coincidir EXACTAMENTE con el id en el HTML (case-sensitive)
    // '.value': Propiedad que extrae el contenido escrito por el usuario en el <input>
    // IMPORTANTE: .value SIEMPRE devuelve texto (string), incluso si el usuario escribió números
    // ';': Punto y coma que marca el FIN de esta instrucción (buena práctica aunque sea opcional en JS)
    var precioInput = document.getElementById('precio').value; // <- Obtiene texto del input precio
    
    // Mismo proceso anterior, pero para el campo de impuesto
    // 'impuestoInput': Variable distinta para almacenar el valor del segundo campo
    // 'impuesto': ID que debe coincidir con <input id="impuesto"> en el HTML
    var impuestoInput = document.getElementById('impuesto').value; // <- Obtiene texto del input impuesto
    
    // Aquí NO usamos '.value' porque queremos el ELEMENTO completo, no solo su valor
    // Necesitamos el objeto completo para poder modificar su contenido (.innerHTML) y estilo (.style) después
    // 'resultadoDiv': Variable que almacena la REFERENCIA al elemento <div id="resultado">
    var resultadoDiv = document.getElementById('resultado'); // <- Guarda referencia al div de resultado


    /* 
     * ---------------------------------------------------------------------
     * VALIDACIÓN DE DATOS (Control de flujo condicional)
     * ---------------------------------------------------------------------
     */
    
    // 'if': Estructura de control que evalúa una condición booleana (true/false)
    // '(': Inicia la expresión condicional que debe resolverse
    // 'precioInput': Variable que contiene el texto del primer input
    // '===': Operador de comparación ESTRICTA (verifica valor Y tipo de dato)
    //       Diferente de '==' porque no hace conversión automática de tipos
    // '""': Cadena de texto vacía (lo que devuelve un input cuando el usuario no escribe nada)
    // '||': Operador lógico O (OR) - la condición es verdadera si CUALQUIERA de los lados es true
    // 'impuestoInput === ""': Segunda condición que verifica si el campo de impuesto está vacío
    // ')': Cierra la expresión condicional
    // '{': Abre el bloque de código que se ejecuta SOLO si la condición es verdadera
    if (precioInput === "" || impuestoInput === "") { // <- ¿Está vacío alguno de los dos campos?
        
        // 'resultadoDiv': Accedemos a la variable que guarda la referencia al elemento HTML
        // '.innerHTML': Propiedad que permite insertar o modificar código HTML dentro de un elemento
        // '=': Asignamos una nueva cadena de texto que se mostrará al usuario
        // "Por favor, ingrese ambos valores.": Mensaje literal entre comillas (string)
        resultadoDiv.innerHTML = "Por favor, ingrese ambos valores."; // <- Muestra mensaje de error
        
        // '.style': Acceso al objeto de estilos CSS en línea del elemento
        // '.color': Propiedad CSS que controla el color del texto (equivalente a CSS 'color')
        // '"red"': Valor de color en formato nombre (también podría ser '#ff0000' o 'rgb(255,0,0)')
        resultadoDiv.style.color = "red"; // <- Cambia el color del texto a rojo para indicar error
        
        // 'return': Palabra reservada que FINALIZA inmediatamente la ejecución de la función
        // Todo el código que esté DESPUÉS de este return NO se ejecutará si entramos en este if
        // Es crucial para evitar que se hagan cálculos con datos inválidos
        return; // <- Detiene la función aquí mismo si hay campos vacíos
        
    // '}': Cierra el bloque del if. Si la condición fue falsa (campos llenos), el código continúa aquí
    }


    /* 
     * ---------------------------------------------------------------------
     * CONVERSIÓN DE TIPOS DE DATO (Type Casting)
     * ---------------------------------------------------------------------
     */
    
    // PROBLEMA: Los valores de los inputs vienen como TEXTO (ej: "100")
    // Si sumamos "100" + "21" en JS, el resultado sería "10021" (concatenación), no 121 (suma matemática)
    // SOLUCIÓN: Convertir explícitamente las cadenas a números
    
    // 'parseFloat()': Función nativa de JS que convierte una cadena a número de punto flotante (con decimales)
    //               Si la cadena no es un número válido, devuelve NaN (Not a Number)
    // 'precioInput': Variable que contiene el texto del usuario (ej: "100.50")
    // 'precio': Nueva variable que almacenará el valor YA CONVERTIDO a número (ej: 100.5)
    var precio = parseFloat(precioInput); // <- Convierte texto "100" a número 100
    
    // Mismo proceso para el impuesto
    // 'impuesto': Variable numérica que almacenará el porcentaje (ej: 21 para 21%)
    var impuesto = parseFloat(impuestoInput); // <- Convierte texto "21" a número 21


    /* 
     * ---------------------------------------------------------------------
     * LÓGICA MATEMÁTICA DEL CÁLCULO
     * ---------------------------------------------------------------------
     */
    
    // FÓRMULA: montoImpuesto = precio * (porcentaje / 100)
    // Ejemplo: 100 * (21 / 100) = 100 * 0.21 = 21
    
    // 'montoImpuesto': Variable que almacenará el resultado del cálculo del impuesto
    // 'precio': Variable numérica con el valor base (ej: 100)
    // '*': Operador de multiplicación aritmética
    // '(': Paréntesis que fuerza el orden de evaluación (primero se hace la división)
    // 'impuesto': Variable con el porcentaje (ej: 21)
    // '/': Operador de división aritmética
    // '100': Literal numérico para convertir porcentaje a decimal (21% -> 0.21)
    // ')': Cierra el paréntesis
    var montoImpuesto = precio * (impuesto / 100); // <- Calcula el valor monetario del impuesto
    
    // 'precioTotal': Variable que almacenará la suma final
    // 'precio + montoImpuesto': Operador '+' realiza suma matemática porque ambas variables son números
    var precioTotal = precio + montoImpuesto; // <- Suma precio base + impuesto = total


    /* 
     * ---------------------------------------------------------------------
     * PRESENTACIÓN DEL RESULTADO AL USUARIO
     * ---------------------------------------------------------------------
     */
    
    // 'resultadoDiv.innerHTML': Volvemos a acceder a la propiedad de contenido HTML del div
    // '=': Asignamos el nuevo texto que queremos mostrar
    // '"Precio Final: $"': Cadena de texto literal que se mostrará tal cual
    // '+': Operador de concatenación (une texto con valores)
    // 'precioTotal': Variable numérica con el resultado (ej: 121)
    // '.toFixed(2)': Método de números que formatea el valor con exactamente 2 decimales
    //                Devuelve una CADENA DE TEXTO, no un número (ej: 121 -> "121.00")
    //                Esencial para mostrar precios en formato monetario correcto
    resultadoDiv.innerHTML = "Precio Final: $" + precioTotal.toFixed(2); // <- Muestra resultado formateado
    
    // '.style.color': Volvemos a modificar el estilo CSS en línea del elemento
    // '"green"': Cambiamos a color verde para indicar visualmente que el cálculo fue exitoso
    resultadoDiv.style.color = "green"; // <- Feedback visual de éxito para el usuario

// '}': Llave de cierre que marca el FIN de la función calcularTotal
}
