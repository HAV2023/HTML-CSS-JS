// DEFINICIÓN DE LA FUNCIÓN PRINCIPAL
// Esta función se ejecuta cuando el usuario hace clic en el botón "Calcular"
function calcularTotal() {
    
    // OBTENCIÓN DE ELEMENTOS DEL DOM
    // Buscamos los elementos en el HTML por su ID para poder leer o modificar su valor
    var precioInput = document.getElementById('precio').value;
    var impuestoInput = document.getElementById('impuesto').value;
    var resultadoDiv = document.getElementById('resultado');

    // VALIDACIÓN DE DATOS
    // Verificamos que los campos no estén vacíos antes de hacer cálculos
    if (precioInput === "" || impuestoInput === "") {
        // Si falta algún dato, mostramos un mensaje de error en el div de resultado
        resultadoDiv.innerHTML = "Por favor, ingrese ambos valores.";
        
        // Cambiamos el color del texto a rojo para indicar error
        resultadoDiv.style.color = "red";
        
        // 'return' detiene la función aquí para que no ejecute el código de abajo
        return;
    }

    // CONVERSIÓN DE TIPOS DE DATO
    // Los valores de los inputs vienen como texto, debemos convertirlos a números
    var precio = parseFloat(precioInput);
    var impuesto = parseFloat(impuestoInput);

    // LÓGICA DE CÁLCULO
    // Calculamos cuánto dinero representa el porcentaje de impuesto
    var montoImpuesto = precio * (impuesto / 100);
    
    // Sumamos el precio original más el monto del impuesto
    var precioTotal = precio + montoImpuesto;

    // MOSTRAR RESULTADO EN PANTALLA
    // Insertamos el texto calculado dentro del div de resultado
    // .toFixed(2) asegura que siempre se muestren 2 decimales (ej: 120.50)
    resultadoDiv.innerHTML = "Precio Final: $" + precioTotal.toFixed(2);
    
    // Cambiamos el color del texto a verde para indicar éxito
    resultadoDiv.style.color = "green";
}
