
// ============================================================================
// SECCIÓN 1: DATOS INICIALES
// ============================================================================

// DECLARACIÓN DE VARIABLE GLOBAL
// 'let' permite modificar el arreglo después. 'ventas' es accesible desde cualquier función
let ventas = [

    // OBJETO 1: PRIMERA VENTA
    // Cada objeto representa una venta con propiedades: id, producto, precio, cantidad, vendedor
    { id: 1, producto: "Laptop", precio: 1200, cantidad: 2, vendedor: "Carlos" },
    
    // OBJETO 2: SEGUNDA VENTA
    // 'id' es único para cada venta, permite identificarla para eliminarla después
    { id: 2, producto: "Mouse", precio: 25, cantidad: 10, vendedor: "Ana" },
    
    // OBJETO 3: TERCERA VENTA
    // 'precio' es el valor unitario del producto
    { id: 3, producto: "Teclado", precio: 75, cantidad: 5, vendedor: "Carlos" },
    
    // OBJETO 4: CUARTA VENTA
    // 'cantidad' es el número de unidades vendidas en esa transacción
    { id: 4, producto: "Monitor", precio: 300, cantidad: 3, vendedor: "Luis" },
    
    // OBJETO 5: QUINTA VENTA
    // 'vendedor' es el nombre de la persona que realizó la venta
    { id: 5, producto: "Laptop", precio: 1200, cantidad: 1, vendedor: "Ana" }
];

// ============================================================================
// SECCIÓN 2: FUNCIÓN PARA CALCULAR INGRESO TOTAL
// ============================================================================

// DECLARACIÓN DE FUNCIÓN
// 'function' define una función llamada 'calcularIngresoTotal' que recibe un parámetro 'datos'
function calcularIngresoTotal(datos) {
    
    // MÉTODO REDUCE
    // 'reduce' recorre todo el arreglo y acumula un solo valor resultante
    // 'acc' es el acumulador (va guardando la suma), 'item' es cada elemento del arreglo
    return datos.reduce((acc, item) => {
        
        // CÁLCULO DEL TOTAL POR VENTA
        // Multiplica precio por cantidad para obtener el total de esa venta específica
        // Luego lo suma al acumulador 'acc'
        return acc + (item.precio * item.cantidad);
        
    }, 0); // Valor inicial del acumulador es 0 (empieza la suma desde cero)
}

// ============================================================================
// SECCIÓN 3: FUNCIÓN PARA FILTRAR VENTAS ALTAS
// ============================================================================

// DECLARACIÓN DE FUNCIÓN
// 'function' define una función llamada 'filtrarVentasAltas' que recibe un parámetro 'datos'
function filtrarVentasAltas(datos) {
    
    // MÉTODO FILTER
    // 'filter' crea un nuevo arreglo solo con los elementos que cumplan la condición
    // 'item' representa cada venta que está siendo evaluada
    return datos.filter(item => {
        
        // CONDICIÓN DE FILTRO
        // Calcula el total de la venta (precio × cantidad) y verifica si es mayor a 500
        // Solo las ventas que retornen 'true' se incluyen en el nuevo arreglo
        return (item.precio * item.cantidad) > 500;
    });
}

// ============================================================================
// SECCIÓN 4: FUNCIÓN PARA ENCONTRAR PRODUCTO MÁS VENDIDO
// ============================================================================

// DECLARACIÓN DE FUNCIÓN
// 'function' define una función llamada 'encontrarProductoMasVendido' que recibe un parámetro 'datos'
function encontrarProductoMasVendido(datos) {
    
    // DECLARACIÓN DE OBJETO VACÍO
    // 'cantidades' servirá para almacenar la suma de unidades por cada nombre de producto
    // Ejemplo: { "Laptop": 3, "Mouse": 10 }
    const cantidades = {};
    
    // MÉTODO FOREACH
    // 'forEach' recorre cada elemento del arreglo 'datos' sin retornar nada
    // 'item' es cada venta individual en la iteración
    datos.forEach(item => {
        
        // CONDICIÓN IF
        // Verifica si el producto ya existe como propiedad en el objeto 'cantidades'
        if (cantidades[item.producto]) {
            
            // SUMA DE CANTIDAD
            // Si el producto ya existe, suma la cantidad actual a la que ya tenía guardada
            cantidades[item.producto] += item.cantidad;
        } else {
            
            // CREACIÓN DE PROPIEDAD
            // Si el producto no existe, lo crea y asigna la cantidad actual como valor inicial
            cantidades[item.producto] = item.cantidad;
        }
    });
    
    // DECLARACIÓN DE VARIABLE PARA EL NOMBRE
    // 'productoMax' guardará el nombre del producto con más unidades vendidas
    let productoMax = "";
    
    // DECLARACIÓN DE VARIABLE PARA LA CANTIDAD
    // 'cantidadMax' guardará el número máximo de unidades encontradas (inicia en 0)
    let cantidadMax = 0;
    
    // BUCLE FOR...IN
    // Recorre todas las propiedades (nombres de productos) del objeto 'cantidades'
    for (const producto in cantidades) {
        
        // CONDICIÓN DE COMPARACIÓN
        // Verifica si la cantidad del producto actual es mayor que la cantidad máxima guardada
        if (cantidades[producto] > cantidadMax) {
            
            // ACTUALIZACIÓN DEL MÁXIMO
            // Guarda la nueva cantidad máxima encontrada
            cantidadMax = cantidades[producto];
            
            // ACTUALIZACIÓN DEL NOMBRE
            // Guarda el nombre del producto que tiene esa cantidad máxima
            productoMax = producto;
        }
    }
    
    // RETORNO DE OBJETO
    // Devuelve un objeto con dos propiedades: el nombre del producto y su cantidad total
    return { producto: productoMax, cantidad: cantidadMax };
}

// ============================================================================
// SECCIÓN 5: FUNCIÓN PARA RENDERIZAR LA INTERFAZ
// ============================================================================

// DECLARACIÓN DE FUNCIÓN
// 'function' define una función llamada 'render' que no recibe parámetros
// Esta función actualiza todo el HTML con los datos actuales
function render() {
    
    // LLAMADA A FUNCIÓN 1
    // Ejecuta 'calcularIngresoTotal' pasando el arreglo 'ventas' y guarda el resultado en 'total'
    const total = calcularIngresoTotal(ventas);
    
    // LLAMADA A FUNCIÓN 2
    // Ejecuta 'filtrarVentasAltas' pasando el arreglo 'ventas' y guarda el resultado en 'ventasAltas'
    const ventasAltas = filtrarVentasAltas(ventas);
    
    // LLAMADA A FUNCIÓN 3
    // Ejecuta 'encontrarProductoMasVendido' pasando el arreglo 'ventas' y guarda el resultado en 'masVendido'
    const masVendido = encontrarProductoMasVendido(ventas);
    
    // ----------------------------------------------------------------------------
    // ACTUALIZACIÓN DE TARJETAS DE RESULTADOS
    // ----------------------------------------------------------------------------
    
    // SELECCIÓN DE ELEMENTO HTML
    // 'getElementById' busca el elemento con id 'total-ingreso' en el HTML
    // '.textContent' cambia el texto dentro de ese elemento
    document.getElementById('total-ingreso').textContent = `$${total.toFixed(2)}`;
    // 'toFixed(2)' asegura que el número siempre muestre 2 decimales (ej: 10.00)
    
    // CONDICIÓN IF
    // Verifica si existe un producto destacado (si 'producto' no está vacío)
    if (masVendido.producto) {
        
        // ACTUALIZACIÓN DEL NOMBRE DEL PRODUCTO
        // Busca el elemento con id 'producto-destacado' y coloca el nombre del producto
        document.getElementById('producto-destacado').textContent = masVendido.producto;
        
        // ACTUALIZACIÓN DE LA CANTIDAD
        // Busca el elemento con id 'cantidad-vendida' y coloca la cantidad con el texto 'unidades'
        document.getElementById('cantidad-vendida').textContent = `${masVendido.cantidad} unidades`;
    } else {
        
        // VALOR POR DEFECTO (PRODUCTO)
        // Si no hay producto, muestra un guion "-"
        document.getElementById('producto-destacado').textContent = "-";
        
        // VALOR POR DEFECTO (CANTIDAD)
        // Si no hay producto, muestra "0 unidades"
        document.getElementById('cantidad-vendida').textContent = "0 unidades";
    }
    
    // ----------------------------------------------------------------------------
    // ACTUALIZACIÓN DE LA TABLA
    // ----------------------------------------------------------------------------
    
    // SELECCIÓN DE ELEMENTO CON QUERYSELECTOR
    // 'querySelector' busca el elemento 'tbody' dentro del elemento con id 'tabla-ventas'
    // Usamos '#tabla-ventas tbody' para ser más específicos en la selección
    const tbody = document.querySelector('#tabla-ventas tbody');
    
    // SELECCIÓN DE ELEMENTO HTML
    // Busca el elemento con id 'mensaje-vacio' para mostrar/ocultar según haya datos
    const mensajeVacio = document.getElementById('mensaje-vacio');
    
    // LIMPIEZA DEL CONTENIDO
    // 'innerHTML = ""' borra todo el contenido actual del tbody (filas anteriores)
    tbody.innerHTML = '';
    
    // CONDICIÓN IF
    // Verifica si el arreglo 'ventasAltas' tiene longitud 0 (no hay ventas que mostrar)
    if (ventasAltas.length === 0) {
        
        // MOSTRAR MENSAJE
        // Cambia el estilo CSS 'display' a 'block' para hacer visible el mensaje de vacío
        mensajeVacio.style.display = 'block';
    } else {
        
        // OCULTAR MENSAJE
        // Cambia el estilo CSS 'display' a 'none' para ocultar el mensaje de vacío
        mensajeVacio.style.display = 'none';
        
        // MÉTODO FOREACH EN VENTAS ALTAS
        // Recorre cada venta del arreglo filtrado 'ventasAltas'
        ventasAltas.forEach(venta => {
            
            // CREACIÓN DE ELEMENTO HTML
            // 'createElement' crea una nueva etiqueta <tr> (fila de tabla) en memoria
            const row = document.createElement('tr');
            
            // CÁLCULO DEL TOTAL DE LA VENTA
            // Multiplica precio por cantidad para mostrar el total en la tabla
            const totalVenta = venta.precio * venta.cantidad;
            
            // INSERCIÓN DE HTML EN LA FILA
            // 'innerHTML' define el contenido de la fila con 5 celdas <td>
            // Los símbolos ${} permiten insertar variables dentro del string (template literals)
            row.innerHTML = `
                <td>${venta.producto}</td>
                <td>${venta.vendedor}</td>
                <td>${venta.cantidad}</td>
                <td>$${totalVenta.toFixed(2)}</td>
                <td><button class="btn-delete" onclick="eliminarVenta(${venta.id})">Eliminar</button></td>
            `;
            // La última celda incluye un botón que llama a la función 'eliminarVenta' con el ID
            
            // AGREGAR FILA A LA TABLA
            // 'appendChild' inserta la fila creada dentro del elemento 'tbody'
            tbody.appendChild(row);
        });
    }
}

// ============================================================================
// SECCIÓN 6: EVENTO PARA AGREGAR NUEVA VENTA
// ============================================================================

// SELECCIÓN DE ELEMENTO HTML
// Busca el formulario con id 'formulario-venta' en el documento
document.getElementById('formulario-venta')

// AGREGAR EVENT LISTENER
// 'addEventListener' escucha un evento específico en el elemento seleccionado
// 'submit' es el evento que se dispara cuando se envía el formulario
.addEventListener('submit', function(e) {
    
    // PREVENIR COMPORTAMIENTO POR DEFECTO
    // 'e.preventDefault()' evita que la página se recargue al enviar el formulario
    e.preventDefault();
    
    // CAPTURA DE VALOR (PRODUCTO)
    // Obtiene el texto escrito en el input con id 'producto'
    const producto = document.getElementById('producto').value;
    
    // CAPTURA DE VALOR (VENDEDOR)
    // Obtiene el texto escrito en el input con id 'vendedor'
    const vendedor = document.getElementById('vendedor').value;
    
    // CAPTURA DE VALOR (PRECIO)
    // Obtiene el valor del input y 'parseFloat' lo convierte a número con decimales
    const precio = parseFloat(document.getElementById('precio').value);
    
    // CAPTURA DE VALOR (CANTIDAD)
    // Obtiene el valor del input y 'parseInt' lo convierte a número entero
    const cantidad = parseInt(document.getElementById('cantidad').value);
    
    // CREACIÓN DE NUEVO OBJETO
    // Define un nuevo objeto 'nuevaVenta' con las propiedades requeridas
    const nuevaVenta = {
        id: Date.now(), // Genera un ID único usando la fecha y hora actual en milisegundos
        producto: producto, // Asigna el valor capturado del input producto
        vendedor: vendedor, // Asigna el valor capturado del input vendedor
        precio: precio, // Asigna el valor capturado del input precio
        cantidad: cantidad // Asigna el valor capturado del input cantidad
    };
    
    // AGREGAR AL ARREGLO
    // 'push' añade el nuevo objeto al final del arreglo global 'ventas'
    ventas.push(nuevaVenta);
    
    // LLAMADA A FUNCIÓN RENDER
    // Ejecuta 'render()' para actualizar la interfaz con los nuevos datos
    render();
    
    // LIMPIAR FORMULARIO
    // 'this.reset()' limpia todos los campos del formulario para dejarlos vacíos
    this.reset();
});

// ============================================================================
// SECCIÓN 7: FUNCIÓN GLOBAL PARA ELIMINAR VENTA
// ============================================================================

// ASIGNACIÓN A OBJETO WINDOW
// 'window.eliminarVenta' hace la función accesible desde el HTML (onclick)
// Sin esto, el botón no podría llamar a la función desde el HTML generado dinámicamente
window.eliminarVenta = function(id) {
    
    // CONFIRMACIÓN DE USUARIO
    // 'confirm' muestra una ventana emergente con Acceptar/Cancelar
    // Solo continúa si el usuario presiona 'Aceptar' (retorna true)
    if(confirm('¿Estás seguro de eliminar este registro?')) {
        
        // FILTRAR ARREGLO
        // 'filter' crea un nuevo arreglo excluyendo la venta con el ID coincidente
        // 'venta => venta.id !== id' mantiene solo las ventas cuyo ID sea diferente
        ventas = ventas.filter(venta => venta.id !== id);
        
        // LLAMADA A FUNCIÓN RENDER
        // Ejecuta 'render()' para actualizar la interfaz sin la venta eliminada
        render();
    }
};

// ============================================================================
// SECCIÓN 8: INICIALIZACIÓN DEL PROGRAMA
// ============================================================================

// AGREGAR EVENT LISTENER AL DOCUMENTO
// 'document.addEventListener' escucha eventos en todo el documento HTML
// 'DOMContentLoaded' es el evento que se dispara cuando el HTML terminó de cargarse
document.addEventListener('DOMContentLoaded', render);
// Cuando el evento ocurre, ejecuta la función 'render' para mostrar los datos iniciales
