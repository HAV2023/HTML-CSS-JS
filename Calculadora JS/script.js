// ============================================================================
// 1. DEFINICIÓN DE FUNCIÓN
// ============================================================================

// 'function' es una palabra reservada que declara un bloque de código reutilizable.
// 'calcularTotal' es el identificador (nombre) de la función.
// '()' indica que esta función no recibe parámetros externos; leerá directamente del DOM.
function calcularTotal() {

    // ==========================================================================
    // 2. OBTENCIÓN DE REFERENCIAS DEL DOM
    // ==========================================================================

    // document: Objeto global que representa toda la página HTML cargada.
    // getElementById('precio'): Busca en el árbol DOM el elemento con id="precio".
    // .value: Propiedad que lee el contenido actual del input (siempre devuelve STRING).
    // Se almacena en la variable 'precioInput' para usarla después.
    var precioInput = document.getElementById('precio').value;

    // Mismo proceso para el campo de impuesto.
    // Nota: El valor viene como texto, ej: "10" no como número 10.
    var impuestoInput = document.getElementById('impuesto').value;

    // Aquí no usamos .value porque queremos modificar el CONTENIDO del div,
    // no lo que el usuario escribe (un div no tiene valor de entrada).
    // Guardamos la referencia al elemento para modificar su HTML después.
    var resultadoDiv = document.getElementById('resultado');

    // ==========================================================================
    // 3. VALIDACIÓN DE DATOS (CONTROL DE FLUJO)
    // ==========================================================================

    // Operador lógico OR (||): La condición es verdadera si AL MENOS UNA de las dos es true.
    // === es comparación estricta: verifica valor Y tipo de dato.
    // Comparamos con "" (string vacío) para detectar si el usuario no escribió nada.
    if (precioInput === "" || impuestoInput === "") {
        
        // .innerHTML: Propiedad que permite insertar código HTML como texto dentro del elemento.
        // Asignamos un string que se mostrará visible en la página.
        resultadoDiv.innerHTML = "Por favor, ingrese ambos valores.";
        
        // .style: Objeto que permite modificar propiedades CSS desde JavaScript.
        // .color: Equivalente a la propiedad CSS 'color'.
        // Cambiamos a rojo para señal visual de error.
        resultadoDiv.style.color = "red";
        
        // return: Palabra reservada que TERMINA la ejecución de la función inmediatamente.
        // El código que está debajo NO se ejecutará si entramos en este bloque.
        // Esto evita que hagamos cálculos con datos inválidos.
        return;
    }

    // ==========================================================================
    // 4. CONVERSIÓN DE TIPOS (TYPE COERCION)
    // ==========================================================================

    // parseFloat(): Función nativa que toma un STRING y devuelve un NUMBER con decimales.
    // Es necesario porque "100" + "50" en texto da "10050", no 150.
    // Necesitamos números reales para operar matemáticamente.
    var precio = parseFloat(precioInput);

    // Mismo proceso para el impuesto.
    // Si el texto no es un número válido, parseFloat devolverá NaN (Not a Number).
    var impuesto = parseFloat(impuestoInput);

    // ==========================================================================
    // 5. LÓGICA DE CÁLCULO MATEMÁTICO
    // ==========================================================================

    // Operación aritmética:
    // 1. (impuesto / 100): Convierte el porcentaje a decimal (ej: 21 / 100 = 0.21)
    // 2. precio * 0.21: Calcula cuánto dinero representa ese porcentaje.
    // 3. El resultado se guarda en la variable 'montoImpuesto' en memoria.
    var montoImpuesto = precio * (impuesto / 100);

    // Suma simple: Precio base más el impuesto calculado.
    // El resultado se almacena en 'precioTotal'.
    var precioTotal = precio + montoImpuesto;

    // ==========================================================================
    // 6. MOSTRAR RESULTADO EN PANTALLA (RENDERIZADO)
    // ==========================================================================

    // .toFixed(2): Método de los números que devuelve un STRING con 2 decimales fijos.
    // Ej: 120.5 se convierte en "120.50" (importante para mostrar moneda).
    // Concatenamos strings con '+' para formar el mensaje final.
    resultadoDiv.innerHTML = "Precio Final: $" + precioTotal.toFixed(2);

    // Cambiamos el color a verde para indicar éxito visualmente.
    // Esto modifica el CSS en línea del elemento en el DOM.
    resultadoDiv.style.color = "green";
}
