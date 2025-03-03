document.addEventListener('DOMContentLoaded', function () {
    // Selección de elementos del DOM
    const menu = document.querySelector('.menu'); // Contenedor del menú de navegación
    const menuToggle = menu.querySelector('.menu-toggle'); // Botón para abrir/cerrar el menú en móviles
    const searchInput = document.getElementById('searchInput'); // Campo de búsqueda
    const searchButton = document.getElementById('searchButton'); // Botón de búsqueda
    const content = document.getElementById('content'); // Contenedor donde se buscará el texto

    /* ================================
       1️⃣ Manejo del Menú en Móviles
       ================================ */
    menuToggle.addEventListener('click', function () {
        menu.classList.toggle('active'); // Agrega o quita la clase 'active' para mostrar/ocultar el menú
    });

    /* ================================
       2️⃣ Función para Resaltar Texto
       ================================ */
    function highlightText(text) {
        // Eliminar resaltados previos
        const highlightedElements = content.querySelectorAll('.highlight');
        highlightedElements.forEach(function (element) {
            const parent = element.parentNode;
            parent.replaceChild(document.createTextNode(element.textContent), element);
            parent.normalize(); // Normaliza el nodo para evitar fragmentaciones
        });

        // Si el texto está vacío, no hace nada
        if (text === '') {
            return;
        }

        // Expresión regular para encontrar el término de búsqueda (sin distinción entre mayúsculas y minúsculas)
        const regex = new RegExp(`(${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

        // Creación de un TreeWalker para recorrer solo nodos de texto dentro del contenido
        const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];

        while (walker.nextNode()) {
            textNodes.push(walker.currentNode); // Almacena todos los nodos de texto en un array
        }

        // Reemplazo del texto encontrado con una versión resaltada
        textNodes.forEach(function (node) {
            if (regex.test(node.nodeValue)) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = node.nodeValue.replace(regex, '<span class="highlight">$1</span>'); // Agrega la clase de resaltado
                const fragment = document.createDocumentFragment();
                Array.from(tempDiv.childNodes).forEach(function (child) {
                    fragment.appendChild(child);
                });
                node.parentNode.replaceChild(fragment, node); // Reemplaza el nodo de texto con la nueva versión resaltada
            }
        });
    }

    /* ================================
       3️⃣ Función para Manejar la Búsqueda
       ================================ */
    function handleSearch() {
        const searchTerm = searchInput.value.trim(); // Obtiene el valor del campo de búsqueda
        highlightText(searchTerm); // Llama a la función que resalta el texto

        // Desplazar la página al primer resultado resaltado
        const firstMatch = content.querySelector('.highlight');
        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    /* ================================
       4️⃣ Eventos para Ejecutar la Búsqueda
       ================================ */
    searchButton.addEventListener('click', handleSearch); // Cuando se hace clic en el botón de búsqueda

    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') { // Si el usuario presiona la tecla "Enter"
            handleSearch(); // Ejecuta la búsqueda
        }
    });
});

