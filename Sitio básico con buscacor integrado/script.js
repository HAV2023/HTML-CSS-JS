// Espera a que el contenido del DOM se cargue completamente antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function () {
    // Selecciona el elemento con la clase 'menu'
    const menu = document.querySelector('.menu');

    // Dentro del menú, selecciona el botón que lo abre/cierra
    const menuToggle = menu.querySelector('.menu-toggle');

    // Selecciona la barra de búsqueda por su ID
    const searchInput = document.getElementById('searchInput');

    // Selecciona el botón de búsqueda por su ID
    const searchButton = document.getElementById('searchButton');

    // Selecciona el contenedor donde se encuentra el contenido a buscar
    const content = document.getElementById('content');

    /* ==========================
       Mostrar/ocultar menú en dispositivos móviles
       ========================== */
    menuToggle.addEventListener('click', function () {
        menu.classList.toggle('active'); // Agrega o quita la clase 'active' para mostrar/ocultar el menú
    });

    /* ==========================
       Función para resaltar texto dentro del contenido
       ========================== */
    function highlightText(text) {
        // Eliminar cualquier resaltado previo
        const highlightedElements = content.querySelectorAll('.highlight');
        highlightedElements.forEach(function (element) {
            const parent = element.parentNode;
            // Reemplaza los elementos resaltados con su texto original
            parent.replaceChild(document.createTextNode(element.textContent), element);
            parent.normalize(); // Normaliza el contenido del nodo para evitar fragmentación de texto
        });

        // Si el término de búsqueda está vacío, salir de la función
        if (text === '') {
            return;
        }

        // Crear una expresión regular para buscar el texto ingresado (sin afectar caracteres especiales)
        const regex = new RegExp(`(${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

        // Crea un TreeWalker para recorrer solo los nodos de texto dentro del contenido
        const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];

        // Recopila todos los nodos de texto dentro del contenido
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        // Recorre cada nodo de texto y reemplaza las coincidencias con la versión resaltada
        textNodes.forEach(function (node) {
            if (regex.test(node.nodeValue)) { // Si el texto contiene la búsqueda
                const tempDiv = document.createElement('div');
                // Envuelve el texto coincidente en un `<span>` con la clase "highlight"
                tempDiv.innerHTML = node.nodeValue.replace(regex, '<span class="highlight">$1</span>');
                
                const fragment = document.createDocumentFragment();
                // Convierte los nuevos nodos en un fragmento de documento para insertarlos correctamente
                Array.from(tempDiv.childNodes).forEach(function (child) {
                    fragment.appendChild(child);
                });

                // Reemplaza el nodo de texto original con el fragmento modificado
                node.parentNode.replaceChild(fragment, node);
            }
        });
    }

    /* ==========================
       Manejar la búsqueda y desplazarse al primer resultado
       ========================== */
    function handleSearch() {
        const searchTerm = searchInput.value.trim(); // Obtiene el texto ingresado sin espacios extra
        highlightText(searchTerm); // Llama a la función para resaltar coincidencias

        // Encuentra el primer resultado resaltado y desplaza la pantalla hacia él
        const firstMatch = content.querySelector('.highlight');
        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Desplazamiento suave
        }
    }

    /* ==========================
       Eventos del buscador
       ========================== */
    // Ejecuta la búsqueda cuando el usuario hace clic en el botón de búsqueda
    searchButton.addEventListener('click', handleSearch);

    // Ejecuta la búsqueda cuando el usuario presiona "Enter" en el campo de búsqueda
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
});
