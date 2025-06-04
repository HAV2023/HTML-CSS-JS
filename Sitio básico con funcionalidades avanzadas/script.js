/* ===============================================
   INICIALIZACIÓN Y CONFIGURACIÓN PRINCIPAL
   =============================================== */

// Event listener que espera a que el DOM esté completamente cargado antes de ejecutar el código
// Esto garantiza que todos los elementos HTML estén disponibles para manipulación
document.addEventListener('DOMContentLoaded', function () {
    
    /* ===============================================
       SELECCIÓN DE ELEMENTOS DEL DOM
       =============================================== */
    
    // Selecciona el contenedor principal del menú de navegación
    const menu = document.querySelector('.menu');
    
    // Selecciona el botón hamburguesa para menú móvil (dentro del menú)
    const menuToggle = menu.querySelector('.menu-toggle');
    
    // Selecciona el campo de entrada de texto para búsquedas
    const searchInput = document.getElementById('searchInput');
    
    // Selecciona el botón de búsqueda
    const searchButton = document.getElementById('searchButton');
    
    // Selecciona el contenedor donde se mostrarán las sugerencias de búsqueda
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    // Selecciona el área de contenido principal donde se aplicará el resaltado de texto
    const content = document.getElementById('content');

    /* ===============================================
       BASE DE DATOS DE SUGERENCIAS SIMULADA
       =============================================== */
    
    // Array que contiene todas las sugerencias disponibles para el buscador
    // Cada objeto representa una sugerencia con texto, categoría e icono
    const suggestionDatabase = [
        { text: 'Tecnología', category: 'General', icon: 'fas fa-microchip' },          // Tecnología general
        { text: 'Software', category: 'Productos', icon: 'fas fa-code' },               // Productos de software
        { text: 'Hardware', category: 'Productos', icon: 'fas fa-desktop' },            // Productos de hardware
        { text: 'Accesorios', category: 'Productos', icon: 'fas fa-plug' },             // Accesorios tecnológicos
        { text: 'Consultoría', category: 'Servicios', icon: 'fas fa-handshake' },       // Servicios de consultoría
        { text: 'Soporte', category: 'Servicios', icon: 'fas fa-tools' },               // Servicios de soporte técnico
        { text: 'Noticias', category: 'Información', icon: 'fas fa-newspaper' },        // Sección de noticias
        { text: 'Contacto', category: 'Información', icon: 'fas fa-envelope' },         // Información de contacto
        { text: 'Inteligencia Artificial', category: 'Tecnología', icon: 'fas fa-robot' }, // IA y machine learning
        { text: 'Desarrollo Web', category: 'Software', icon: 'fas fa-globe' },         // Desarrollo web
        { text: 'Ciberseguridad', category: 'Servicios', icon: 'fas fa-shield-alt' },   // Servicios de seguridad
        { text: 'Cloud Computing', category: 'Servicios', icon: 'fas fa-cloud' },       // Servicios en la nube
        { text: 'Programación', category: 'Software', icon: 'fas fa-laptop-code' },     // Servicios de programación
        { text: 'Redes', category: 'Hardware', icon: 'fas fa-network-wired' }           // Hardware de redes
    ];

    /* ===============================================
       VARIABLES DE ESTADO GLOBAL
       =============================================== */
    
    // Variable que rastrea qué sugerencia está actualmente seleccionada mediante teclado
    // -1 significa que ninguna sugerencia está seleccionada
    let selectedSuggestionIndex = -1;

    /* ===============================================
       FUNCIONALIDAD DEL MENÚ MÓVIL
       =============================================== */
    
    // Verifica si existe el botón de menú móvil antes de agregar el event listener
    if (menuToggle) {
        // Agrega funcionalidad de toggle (abrir/cerrar) para el menú en dispositivos móviles
        menuToggle.addEventListener('click', function () {
            // Alterna la clase 'active' que controla la visibilidad del menú móvil
            menu.classList.toggle('active');
        });
    }

    /* ===============================================
       FUNCIÓN DE RESALTADO DE TEXTO
       =============================================== */
    
    /**
     * Función que resalta texto específico dentro del contenido de la página
     * @param {string} text - El texto que se desea resaltar
     */
    function highlightText(text) {
        
        // PASO 1: Limpiar resaltados previos
        // Busca todos los elementos con clase 'highlight' y los reemplaza por texto plano
        document.querySelectorAll('.highlight').forEach(el => {
            const parent = el.parentNode;  // Obtiene el elemento padre
            // Reemplaza el elemento highlight con un nodo de texto plano
            parent.replaceChild(document.createTextNode(el.textContent), el);
            // Normaliza el nodo padre para combinar nodos de texto adyacentes
            parent.normalize();
        });

        // Si no hay texto para buscar, termina la función
        if (text === '') return;

        // PASO 2: Crear expresión regular para búsqueda
        // Escapa caracteres especiales de regex y crea patrón case-insensitive
        const regex = new RegExp(`(${text.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')})`, 'gi');
        
        // PASO 3: Crear TreeWalker para recorrer solo nodos de texto
        // TreeWalker es más eficiente que getElementsByTagName para este propósito
        const walker = document.createTreeWalker(
            content,                    // Elemento raíz donde buscar
            NodeFilter.SHOW_TEXT,       // Solo mostrar nodos de texto
            null,                       // Sin filtro adicional
            false                       // No expandir referencias de entidad
        );
        
        // Array para almacenar todos los nodos de texto encontrados
        const textNodes = [];

        // PASO 4: Recopilar todos los nodos de texto
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        // PASO 5: Procesar cada nodo de texto para aplicar resaltado
        textNodes.forEach(node => {
            // Verifica si el nodo contiene el texto buscado
            if (regex.test(node.nodeValue)) {
                // Crea un elemento span para contener el texto resaltado
                const span = document.createElement('span');
                span.className = 'highlight';
                // Reemplaza el texto coincidente con etiquetas <mark>
                span.innerHTML = node.nodeValue.replace(regex, '<mark>$1</mark>');
                // Reemplaza el nodo de texto original con el span resaltado
                node.parentNode.replaceChild(span, node);
            }
        });
    }

    /* ===============================================
       FUNCIONES DE GESTIÓN DE SUGERENCIAS
       =============================================== */
    
    /**
     * Función que muestra las sugerencias filtradas basadas en la consulta del usuario
     * @param {string} query - El texto ingresado por el usuario para filtrar sugerencias
     */
    function showSuggestions(query) {
        // Si la consulta está vacía o solo contiene espacios, oculta las sugerencias
        if (!query.trim()) {
            hideSuggestions();
            return;
        }

        // PASO 1: Filtrar sugerencias basadas en la consulta
        // Busca coincidencias parciales en el texto de las sugerencias (case-insensitive)
        const filteredSuggestions = suggestionDatabase.filter(item =>
            item.text.toLowerCase().includes(query.toLowerCase())
        );

        // PASO 2: Generar HTML para mostrar las sugerencias
        if (filteredSuggestions.length === 0) {
            // Si no hay coincidencias, muestra mensaje informativo
            searchSuggestions.innerHTML = '<div class="no-suggestions">No se encontraron sugerencias</div>';
        } else {
            // Genera HTML para cada sugerencia encontrada
            searchSuggestions.innerHTML = filteredSuggestions.map((item, index) => `
                <div class="suggestion-item" data-index="${index}" data-text="${item.text}">
                    <i class="${item.icon}"></i>
                    <span class="suggestion-text">${item.text}</span>
                    <span class="suggestion-category">${item.category}</span>
                </div>
            `).join('');
        }

        // PASO 3: Mostrar el dropdown de sugerencias
        searchSuggestions.classList.add('show');  // Agrega clase para mostrar con animación
        selectedSuggestionIndex = -1;             // Resetea la selección por teclado
    }

    /**
     * Función que oculta el dropdown de sugerencias
     */
    function hideSuggestions() {
        searchSuggestions.classList.remove('show');  // Remueve clase de visibilidad
        selectedSuggestionIndex = -1;                // Resetea índice de selección
    }

    /* ===============================================
       FUNCIONES DE BÚSQUEDA
       =============================================== */
    
    /**
     * Función que ejecuta la búsqueda y aplica el resaltado de texto
     * @param {string|null} searchTerm - Término específico a buscar (opcional)
     */
    function executeSearch(searchTerm = null) {
        // Usa el término proporcionado o el valor actual del input, eliminando espacios
        const query = searchTerm || searchInput.value.trim();
        
        if (query) {
            highlightText(query);    // Aplica resaltado al texto encontrado
            hideSuggestions();       // Oculta el dropdown de sugerencias
        }
    }

    /**
     * Función que selecciona una sugerencia específica y ejecuta la búsqueda
     * @param {string} text - El texto de la sugerencia seleccionada
     */
    function selectSuggestion(text) {
        searchInput.value = text;    // Coloca el texto en el campo de búsqueda
        executeSearch(text);         // Ejecuta la búsqueda con ese término
    }

    /* ===============================================
       EVENT LISTENERS PARA EL CAMPO DE BÚSQUEDA
       =============================================== */
    
    // Verifica que el campo de búsqueda exista antes de agregar event listeners
    if (searchInput) {
        
        // EVENT LISTENER: Input en tiempo real
        // Se ejecuta cada vez que el usuario escribe en el campo de búsqueda
        searchInput.addEventListener('input', function() {
            showSuggestions(this.value);  // Muestra sugerencias basadas en el texto actual
        });

        // EVENT LISTENER: Navegación por teclado
        // Maneja las teclas especiales para navegación y selección
        searchInput.addEventListener('keydown', function(e) {
            // Obtiene todos los elementos de sugerencia visibles actualmente
            const suggestionItems = searchSuggestions.querySelectorAll('.suggestion-item');
            
            // Switch para manejar diferentes teclas
            switch(e.key) {
                case 'ArrowDown':
                    // FLECHA ABAJO: Navega hacia la siguiente sugerencia
                    e.preventDefault();  // Previene comportamiento por defecto del navegador
                    // Incrementa el índice sin exceder el número de sugerencias
                    selectedSuggestionIndex = Math.min(selectedSuggestionIndex + 1, suggestionItems.length - 1);
                    updateSelectedSuggestion(suggestionItems);  // Actualiza visualización
                    break;
                    
                case 'ArrowUp':
                    // FLECHA ARRIBA: Navega hacia la sugerencia anterior
                    e.preventDefault();
                    // Decrementa el índice sin bajar de -1 (ninguna selección)
                    selectedSuggestionIndex = Math.max(selectedSuggestionIndex - 1, -1);
                    updateSelectedSuggestion(suggestionItems);
                    break;
                    
                case 'Enter':
                    // ENTER: Selecciona la sugerencia actual o ejecuta búsqueda libre
                    e.preventDefault();
                    if (selectedSuggestionIndex >= 0 && suggestionItems[selectedSuggestionIndex]) {
                        // Si hay una sugerencia seleccionada, la usa
                        const selectedText = suggestionItems[selectedSuggestionIndex].dataset.text;
                        selectSuggestion(selectedText);
                    } else {
                        // Si no hay sugerencia seleccionada, ejecuta búsqueda con texto actual
                        executeSearch();
                    }
                    break;
                    
                case 'Escape':
                    // ESCAPE: Cierra el dropdown de sugerencias
                    hideSuggestions();
                    break;
            }
        });

        // EVENT LISTENER: Pérdida de foco (blur)
        // Se ejecuta cuando el usuario hace clic fuera del campo de búsqueda
        searchInput.addEventListener('blur', function() {
            // Delay de 200ms para permitir que se ejecuten clicks en sugerencias
            // Sin este delay, el dropdown se cerraría antes de procesar el click
            setTimeout(hideSuggestions, 200);
        });

        // EVENT LISTENER: Obtención de foco (focus)
        // Se ejecuta cuando el usuario hace clic o navega al campo de búsqueda
        searchInput.addEventListener('focus', function() {
            // Si ya hay texto en el campo, muestra las sugerencias correspondientes
            if (this.value.trim()) {
                showSuggestions(this.value);
            }
        });
    }

    /* ===============================================
       FUNCIONES AUXILIARES PARA NAVEGACIÓN POR TECLADO
       =============================================== */
    
    /**
     * Función que actualiza visualmente qué sugerencia está seleccionada
     * @param {NodeList} suggestionItems - Lista de elementos de sugerencia del DOM
     */
    function updateSelectedSuggestion(suggestionItems) {
        // Itera sobre todos los elementos de sugerencia
        suggestionItems.forEach((item, index) => {
            // Agrega o remueve la clase 'selected' basándose en si el índice coincide
            item.classList.toggle('selected', index === selectedSuggestionIndex);
        });
    }

    /* ===============================================
       EVENT LISTENERS PARA INTERACCIÓN CON SUGERENCIAS
       =============================================== */
    
    // EVENT LISTENER: Clicks en sugerencias
    // Utiliza event delegation para manejar clicks en elementos dinámicos
    searchSuggestions.addEventListener('click', function(e) {
        // Busca el elemento de sugerencia más cercano al elemento clickeado
        const suggestionItem = e.target.closest('.suggestion-item');
        
        if (suggestionItem) {
            // Obtiene el texto de la sugerencia desde el atributo data-text
            const text = suggestionItem.dataset.text;
            selectSuggestion(text);  // Selecciona la sugerencia clickeada
        }
    });

    /* ===============================================
       EVENT LISTENERS PARA EL BOTÓN DE BÚSQUEDA
       =============================================== */
    
    // Verifica que el botón de búsqueda exista antes de agregar event listener
    if (searchButton) {
        // EVENT LISTENER: Click en botón de búsqueda
        // Ejecuta la búsqueda cuando se hace clic en el botón
        searchButton.addEventListener('click', executeSearch);
    }

    /* ===============================================
       EVENT LISTENERS GLOBALES
       =============================================== */
    
    // EVENT LISTENER: Clicks fuera del área de búsqueda
    // Cierra las sugerencias cuando se hace clic en cualquier parte fuera del componente
    document.addEventListener('click', function(e) {
        // Verifica si el click NO fue dentro del contenedor de búsqueda
        if (!e.target.closest('.search-container')) {
            hideSuggestions();  // Oculta las sugerencias
        }
    });

    /* ===============================================
       FIN DEL EVENT LISTENER DOMContentLoaded
       =============================================== */
});
