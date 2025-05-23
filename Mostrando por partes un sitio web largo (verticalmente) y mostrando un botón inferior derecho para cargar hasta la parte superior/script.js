/* Descripción granular del archivo script.js */

// Línea 1:
const toTopBtn = document.getElementById("toTop");
// Obtiene del DOM el elemento con id "toTop", que es el botón para ir hacia arriba.
// Guarda la referencia en la variable toTopBtn para manipularlo después.

// Línea 2:
const loadMoreBtn = document.getElementById("loadMore");
// Obtiene el botón con id "loadMore", que al hacer clic carga más texto en la página.
// Guarda esta referencia en loadMoreBtn para agregarle eventos.

// Línea 3:
const contentDiv = document.getElementById("content");
// Obtiene el contenedor principal del contenido (donde están los párrafos).
// Se usará para insertar contenido adicional dinámicamente.

// Línea 6-13: Evento para mostrar u ocultar el botón "Ir arriba" basado en scroll
window.addEventListener("scroll", () => {
    // Cada vez que se hace scroll en la ventana, se ejecuta esta función anónima.

    if (window.scrollY > 100) {
        // Si el desplazamiento vertical del scroll (scrollY) es mayor a 100 píxeles...

        toTopBtn.style.display = "block";
        // ...se cambia el estilo del botón para mostrarlo (display:block).

    } else {
        // Si el scroll está en 100px o menos...

        toTopBtn.style.display = "none";
        // ...se oculta el botón (display:none).
    }
});

// Línea 16-20: Evento que define la acción al hacer clic en el botón "Ir arriba"
toTopBtn.addEventListener("click", () => {
    // Cuando el usuario da clic en el botón "Ir arriba", se ejecuta esta función.

    window.scrollTo({
        top: 0,              // Posición vertical a la que se quiere ir: inicio (0px)
        behavior: "smooth"   // Efecto de desplazamiento suave (no brusco)
    });
});

// Línea 23-30: Evento para añadir más contenido al hacer clic en el botón "Más..."
loadMoreBtn.addEventListener("click", () => {
    // Al hacer clic en "Más...", ejecutamos esta función para agregar texto.

    for (let i = 0; i < 10; i++) {
        // Bucle que se repite 10 veces para crear 10 párrafos.

        const p = document.createElement("p");
        // Crea un nuevo elemento <p> en memoria.

        p.textContent = "Texto adicional para que la página sea más larga y aparezca el scroll. Esto permite probar el botón Ir arriba correctamente.";
        // Establece el texto que tendrá el nuevo párrafo.

        contentDiv.insertBefore(p, loadMoreBtn);
        // Inserta el nuevo párrafo dentro del contenedor 'content',
        // justo antes del botón "Más..." para mantener el botón al final.
    }
});
