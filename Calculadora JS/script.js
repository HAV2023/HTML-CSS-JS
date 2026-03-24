// ============================================================================
// 1. ESTRUCTURA DE DATOS
// ============================================================================

// 'let' permite reasignar la variable. Usamos un array literal [...] para almacenar objetos.
// Cada objeto {} representa un registro en memoria con claves específicas.
let ventas = [
    { id: 1, producto: "Laptop", precio: 1200, cantidad: 2, vendedor: "Carlos" },
    { id: 2, producto: "Mouse", precio: 25, cantidad: 10, vendedor: "Ana" },
    { id: 3, producto: "Teclado", precio: 75, cantidad: 5, vendedor: "Carlos" },
    { id: 4, producto: "Monitor", precio: 300, cantidad: 3, vendedor: "Luis" },
    { id: 5, producto: "Laptop", precio: 1200, cantidad: 1, vendedor: "Ana" }
];

// ============================================================================
// 2. LÓGICA DE PROCESAMIENTO
// ============================================================================

// Función que recibe una referencia al array 'datos'.
function calcularIngresoTotal(datos) {
    // 'reduce' ejecuta una función acumuladora por cada elemento del array.
    // (acc, item) => ... es una función flecha (arrow function).
    // 'acc' (acumulador): Guarda el resultado de la iteración anterior.
    // 'item' (valor actual): El objeto que se está procesando en este turno.
    return datos.reduce((acc, item) => {
        // 1. Calculamos subtotal: accede a propiedades del objeto con punto.
        const subtotal = item.precio * item.cantidad;
        // 2. Sumamos al acumulador y retornamos el nuevo valor para la siguiente vuelta.
        return acc + subtotal;
    }, 0); // El '0' inicializa el acumulador en la primera iteración.
}

// Función para filtrar elementos.
function filtrarVentasAltas(datos) {
    // 'filter' crea un NUEVO array. No modifica el original.
    return datos.filter(item => {
        // La función debe devolver true (se queda) o false (se descarta).
        // Calculamos el monto total de esta venta individual.
        const totalVenta = item.precio * item.cantidad;
        // Operador de comparación mayor que. Devuelve booleano.
        return totalVenta > 500;
    });
}

// Función para agrupar y contar datos dinámicamente.
function encontrarProductoMasVendido(datos) {
    // Creamos un objeto vacío. Servirá como mapa hash (diccionario).
    // En memoria se reserva espacio para almacenar pares clave-valor.
    const cantidades = {};

    // 'forEach' itera sobre el array pero no retorna nada (void).
    // Se usa aquí por efecto secundario (modificar el objeto 'cantidades').
    datos.forEach(item => {
        // ACCESO DINÁMICO A PROPIEDADES:
        // item.producto contiene un string (ej: "Laptop").
        // cantidades["Laptop"] accede a esa propiedad específica.
        
        // CONDICIONAL DE EXISTENCIA:
        // Si la propiedad ya existe, su valor será un número (truthy).
        if (cantidades[item.producto]) {
            // OPERADOR DE ASIGNACIÓN COMPUESTA (+=):
            // 1. Lee el valor actual en cantidades[item.producto].
            // 2. Le suma item.cantidad.
            // 3. Guarda el resultado en la misma propiedad.
            cantidades[item.producto] += item.cantidad;
        } else {
            // Si es la primera vez que vemos este producto, la propiedad es undefined.
            // Creamos la propiedad y le asignamos la cantidad inicial.
            cantidades[item.producto] = item.cantidad;
        }
    });

    // Variables locales para rastrear el máximo durante la búsqueda.
    let productoMax = "";
    let cantidadMax = 0;

    // Bucle for-in: Itera sobre las CLAVES (keys) de un objeto.
    for (const producto in cantidades) {
        // Accedemos al valor usando la clave actual 'producto'.
        if (cantidades[producto] > cantidadMax) {
            // Actualizamos el máximo encontrado hasta ahora.
            cantidadMax = cantidades[producto];
            productoMax = producto;
        }
    }

    // RETORNO DE OBJETO LITERAL:
    // Como necesitamos devolver dos datos, creamos un objeto nuevo al vuelo.
    // Clave 'producto' recibe el valor de la variable 'productoMax'.
    // Clave 'cantidad' recibe el valor de la variable 'cantidadMax'.
    return { producto: productoMax, cantidad: cantidadMax };
}

// ============================================================================
// 3. MANIPULACIÓN DEL DOM (DOCUMENT OBJECT MODEL)
// ============================================================================

function render() {
    // 1. Ejecutamos las funciones lógicas y guardamos resultados en variables locales.
    const total = calcularIngresoTotal(ventas);
    const ventasAltas = filtrarVentasAltas(ventas);
    const masVendido = encontrarProductoMasVendido(ventas);

    // 2. Selección de elementos del DOM.
    // getElementById busca en el árbol HTML el nodo con ese ID específico.
    // Devuelve un objeto Elemento HTML o null si no existe.
    document.getElementById('total-ingreso').textContent = `$${total.toFixed(2)}`;
    // .textContent es una propiedad que inserta texto plano dentro de la etiqueta.
    // .toFixed(2) convierte el número a string con 2 decimales.

    // Validación de existencia de datos antes de pintar.
    if (masVendido.producto) {
        document.getElementById('producto-destacado').textContent = masVendido.producto;
        document.getElementById('cantidad-vendida').textContent = `${masVendido.cantidad} unidades`;
    } else {
        document.getElementById('producto-destacado').textContent = "-";
        document.getElementById('cantidad-vendida').textContent = "0 unidades";
    }

    // 3. Renderizado de la tabla.
    // querySelector permite usar selectores CSS (ej: #id elemento).
    const tbody = document.querySelector('#tabla-ventas tbody');
    const mensajeVacio = document.getElementById('mensaje-vacio');
    
    // Limpieza previa: Eliminamos el HTML interno anterior para no duplicar filas.
    tbody.innerHTML = '';

    // Comprobamos longitud del array (número de elementos).
    if (ventasAltas.length === 0) {
        // Modificamos el estilo CSS en línea desde JS.
        mensajeVacio.style.display = 'block';
    } else {
        mensajeVacio.style.display = 'none';
        
        // Iteramos para crear elementos HTML dinámicamente.
        ventasAltas.forEach(venta => {
            const totalVenta = venta.precio * venta.cantidad;
            
            // createElement genera un nodo HTML en memoria (aún no visible en pantalla).
            const row = document.createElement('tr');
            
            // Template literals (backticks) permiten interpolar variables ${} dentro del string.
            // onclick="eliminarVenta(...)" inyecta código JS que se ejecutará al hacer clic.
            row.innerHTML = `
                <td>${venta.producto}</td>
                <td>${venta.vendedor}</td>
                <td>${venta.cantidad}</td>
                <td>$${totalVenta.toFixed(2)}</td>
                <td><button class="btn-delete" onclick="eliminarVenta(${venta.id})">Eliminar</button></td>
            `;
            
            // appendChild inserta el nodo creado dentro del nodo padre (tbody) en el DOM visible.
            tbody.appendChild(row);
        });
    }
}

// ============================================================================
// 4. GESTIÓN DE EVENTOS
// ============================================================================

// Seleccionamos el formulario y escuchamos el evento 'submit' (envío).
document.getElementById('formulario-venta').addEventListener('submit', function(e) {
    // e es el objeto Event. preventDefault() evita la recarga de página por defecto.
    e.preventDefault();

    // Captura de valores: .value lee el contenido actual del input.
    const producto = document.getElementById('producto').value;
    const vendedor = document.getElementById('vendedor').value;
    
    // Conversión de tipos: Los inputs devuelven string, necesitamos números.
    // parseFloat para decimales, parseInt para enteros.
    const precio = parseFloat(document.getElementById('precio').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);

    // Creación del nuevo objeto de datos.
    // Date.now() devuelve milisegundos desde 1970, útil para IDs únicos rápidos.
    const nuevaVenta = {
        id: Date.now(),
        producto: producto,
        vendedor: vendedor,
        precio: precio,
        cantidad: cantidad
    };

    // Mutación del array principal: push añade al final.
    ventas.push(nuevaVenta);
    
    // Refresco de la interfaz para mostrar los cambios.
    render();
    
    // 'this' se refiere al elemento que disparó el evento (el formulario).
    // reset() limpia todos los inputs a su valor original.
    this.reset();
});

// ============================================================================
// 5. ELIMINACIÓN DE DATOS
// ============================================================================

// Asignamos la función al objeto 'window' para hacerla global y accesible desde el HTML.
window.eliminarVenta = function(id) {
    // Confirmación nativa del navegador. Bloquea la ejecución hasta que el usuario responde.
    if(confirm('¿Estás seguro de eliminar este registro?')) {
        // Filtrado inverso: Creamos un nuevo array con todo LO QUE NO COINCIDA con el ID.
        // El operador !== es desigualdad estricta (valor y tipo).
        ventas = ventas.filter(venta => venta.id !== id);
        
        // Volvemos a pintar con el array actualizado (más corto).
        render();
    }
};

// ============================================================================
// 6. CICLO DE VIDA
// ============================================================================

// DOMContentLoaded se dispara cuando el HTML ha sido completamente cargado y parseado (convertido a un lenguaje que comprende la computadora).
// Esto asegura que los elementos existan antes de que JS intente buscarlos.
document.addEventListener('DOMContentLoaded', render);
