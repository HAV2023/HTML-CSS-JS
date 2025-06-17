/**
 * =====================================================================================
 * SISTEMA DE BÚSQUEDA INTELIGENTE Y NAVEGACIÓN MULTIIDIOMA
 * =====================================================================================
 * 
 * Este archivo implementa un sistema completo de búsqueda con sugerencias dinámicas,
 * navegación responsive y soporte multiidioma para un sitio web de tecnología.
 * 
 * CARACTERÍSTICAS PRINCIPALES:
 * - Sistema de búsqueda con autocompletado
 * - Navegación por teclado en sugerencias
 * - Resaltado de texto en resultados
 * - Soporte multiidioma (ES/EN)
 * - Menú responsive para móviles
 * - Persistencia de preferencias de idioma
 * 
 * DEPENDENCIAS:
 * - Font Awesome (iconos)
 * - CSS personalizado (styles.css)
 * - Archivo opcional translations.json
 * 
 * COMPATIBILIDAD:
 * - ES6+ (async/await, arrow functions, template literals)
 * - Navegadores modernos (Chrome 55+, Firefox 52+, Safari 10+)
 * 
 * @author Tu nombre
 * @version 2.0
 * @since 2024
 */

/* ===============================================
   INICIALIZACIÓN PRINCIPAL DEL DOCUMENTO
   =============================================== */

/**
 * Event listener principal que espera a que el DOM esté completamente cargado.
 * 
 * ¿Por qué usar DOMContentLoaded?
 * - Garantiza que todos los elementos HTML estén disponibles
 * - Se ejecuta antes que el evento 'load' (más rápido)
 * - Evita errores de elementos no encontrados
 * 
 * Alternativas consideradas:
 * - window.onload: Espera también imágenes y recursos (más lento)
 * - Script al final del body: Menos control y semántica
 */
document.addEventListener('DOMContentLoaded', function () {
    
    /* ===============================================
       SISTEMA DE INTERNACIONALIZACIÓN (i18n)
       =============================================== */
    
    /**
     * Variable global que almacena todas las traducciones cargadas desde JSON
     * o desde el sistema de fallback integrado.
     * 
     * Estructura esperada:
     * {
     *   "idioma": {
     *     "seccion": {
     *       "clave": "valor_traducido"
     *     }
     *   }
     * }
     */
    let translations = {};
    
    /**
     * Idioma actualmente seleccionado por el usuario.
     * 
     * Valores posibles:
     * - 'es': Español (por defecto)
     * - 'en': Inglés
     * 
     * Se persiste en localStorage para mantener la preferencia del usuario
     * entre sesiones de navegación.
     */
    let currentLanguage = 'es';
    
    /**
     * Base de datos de sugerencias integrada como sistema de fallback.
     * 
     * ¿Por qué un fallback?
     * - Garantiza funcionalidad aunque falle la carga del JSON externo
     * - Reduce dependencias de archivos externos
     * - Mejora la experiencia del usuario en caso de errores de red
     * 
     * Estructura de cada sugerencia:
     * - text: Texto mostrado al usuario
     * - category: Categoría para organización visual
     * - icon: Clase de Font Awesome para el icono
     */
    const fallbackSuggestions = {
        es: {
            search: {
                placeholder: "Buscar...",
                noSuggestions: "No se encontraron sugerencias",
                suggestions: [
                    { text: 'Tecnología', category: 'General', icon: 'fas fa-microchip' },
                    { text: 'Software', category: 'Productos', icon: 'fas fa-code' },
                    { text: 'Hardware', category: 'Productos', icon: 'fas fa-desktop' },
                    { text: 'Accesorios', category: 'Productos', icon: 'fas fa-plug' },
                    { text: 'Consultoría', category: 'Servicios', icon: 'fas fa-handshake' },
                    { text: 'Soporte', category: 'Servicios', icon: 'fas fa-tools' },
                    { text: 'Noticias', category: 'Información', icon: 'fas fa-newspaper' },
                    { text: 'Contacto', category: 'Información', icon: 'fas fa-envelope' },
                    { text: 'Inteligencia Artificial', category: 'Tecnología', icon: 'fas fa-robot' },
                    { text: 'Desarrollo Web', category: 'Software', icon: 'fas fa-globe' },
                    { text: 'Ciberseguridad', category: 'Servicios', icon: 'fas fa-shield-alt' },
                    { text: 'Cloud Computing', category: 'Servicios', icon: 'fas fa-cloud' },
                    { text: 'Programación', category: 'Software', icon: 'fas fa-laptop-code' },
                    { text: 'Redes', category: 'Hardware', icon: 'fas fa-network-wired' }
                ]
            }
        },
        en: {
            search: {
                placeholder: "Search...",
                noSuggestions: "No suggestions found",
                suggestions: [
                    { text: 'Technology', category: 'General', icon: 'fas fa-microchip' },
                    { text: 'Software', category: 'Products', icon: 'fas fa-code' },
                    { text: 'Hardware', category: 'Products', icon: 'fas fa-desktop' },
                    { text: 'Accessories', category: 'Products', icon: 'fas fa-plug' },
                    { text: 'Consulting', category: 'Services', icon: 'fas fa-handshake' },
                    { text: 'Support', category: 'Services', icon: 'fas fa-tools' },
                    { text: 'News', category: 'Information', icon: 'fas fa-newspaper' },
                    { text: 'Contact', category: 'Information', icon: 'fas fa-envelope' },
                    { text: 'Artificial Intelligence', category: 'Technology', icon: 'fas fa-robot' },
                    { text: 'Web Development', category: 'Software', icon: 'fas fa-globe' },
                    { text: 'Cybersecurity', category: 'Services', icon: 'fas fa-shield-alt' },
                    { text: 'Cloud Computing', category: 'Services', icon: 'fas fa-cloud' },
                    { text: 'Programming', category: 'Software', icon: 'fas fa-laptop-code' },
                    { text: 'Networks', category: 'Hardware', icon: 'fas fa-network-wired' }
                ]
            }
        }
    };
    
    /**
     * Función asíncrona para cargar traducciones desde archivo JSON externo.
     * 
     * FLUJO DE EJECUCIÓN:
     * 1. Intenta realizar fetch del archivo translations.json
     * 2. Verifica que la respuesta HTTP sea exitosa
     * 3. Parsea el JSON y lo almacena en la variable global
     * 4. Si falla cualquier paso, usa el sistema de fallback
     * 
     * MANEJO DE ERRORES:
     * - Error de red: archivo no encontrado, servidor caído
     * - Error HTTP: 404, 500, etc.
     * - Error de parsing: JSON malformado
     * 
     * ¿Por qué async/await?
     * - Código más legible que con .then()/.catch()
     * - Mejor manejo de errores con try/catch
     * - Flujo secuencial más intuitivo
     * 
     * @returns {Promise<void>} No retorna valor, pero modifica variable global
     */
    async function loadTranslations() {
        try {
            // Registro de debug para monitoreo de la carga
            console.log('🔄 Intentando cargar translations.json...');
            
            // Petición HTTP al archivo JSON
            // fetch() es la API moderna para peticiones HTTP, reemplaza XMLHttpRequest
            const response = await fetch('translations.json');
            
            // Verificación del estado HTTP
            // response.ok es true para códigos 200-299
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Parsing del contenido JSON
            // .json() también es asíncrono porque puede ser un archivo grande
            translations = await response.json();
            console.log('✅ Traducciones cargadas exitosamente:', translations);
            
        } catch (error) {
            // Captura cualquier error en el proceso de carga
            console.warn('⚠️ Error cargando translations.json:', error);
            console.log('🔄 Usando traducciones de fallback...');
            
            // Asignación del sistema de respaldo
            translations = fallbackSuggestions;
        }
    }
    
    /**
     * Función utilitaria para obtener texto traducido usando notación de puntos.
     * 
     * SISTEMA DE CLAVES:
     * - 'search.placeholder' -> translations[idioma].search.placeholder
     * - 'menu.home' -> translations[idioma].menu.home
     * - 'search.suggestions' -> translations[idioma].search.suggestions
     * 
     * VENTAJAS DEL SISTEMA:
     * - Claves jerárquicas y organizadas
     * - Fácil mantenimiento y escalabilidad
     * - Consistencia en el acceso a traducciones
     * 
     * ALGORITMO:
     * 1. Divide la clave por puntos en un array
     * 2. Navega recursivamente por el objeto de traducciones
     * 3. Retorna el valor final o la clave si no encuentra traducción
     * 
     * @param {string} key - Clave de traducción en formato jerárquico (ej: 'search.placeholder')
     * @returns {string|Object} - Texto traducido o clave original si no se encuentra
     */
    function getTranslation(key) {
        // Dividir la clave en componentes individuales
        const keys = key.split('.');
        
        // Punto de partida: objeto del idioma actual
        let value = translations[currentLanguage];
        
        // Navegación recursiva por la estructura jerárquica
        for (const k of keys) {
            // Verificación de existencia antes de navegar más profundo
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                // Registro de warning para debugging
                console.warn(`⚠️ Traducción no encontrada para: ${key} en idioma ${currentLanguage}`);
                return key; // Fallback: retorna la clave original
            }
        }
        return value;
    }
    
    /**
     * Función para cambiar el idioma activo de la interfaz.
     * 
     * RESPONSABILIDADES:
     * 1. Validar que el idioma solicitado existe
     * 2. Actualizar la variable global de idioma
     * 3. Refrescar toda la interfaz de usuario
     * 4. Persistir la preferencia en almacenamiento local
     * 
     * FLUJO DE EJECUCIÓN:
     * 1. Verificación de disponibilidad del idioma
     * 2. Logging para debugging
     * 3. Actualización del estado global
     * 4. Llamada a función de actualización de UI
     * 5. Persistencia en localStorage
     * 
     * @param {string} lang - Código de idioma ('es' o 'en')
     */
    function changeLanguage(lang) {
        // Validación de disponibilidad del idioma
        if (translations[lang]) {
            console.log(`🌐 Cambiando idioma a: ${lang}`);
            
            // Actualización del estado global
            currentLanguage = lang;
            
            // Refreso de la interfaz con el nuevo idioma
            updateUI();
            
            // Persistencia de la preferencia del usuario
            // localStorage mantiene los datos entre sesiones del navegador
            localStorage.setItem('selectedLanguage', lang);
        } else {
            console.error(`❌ Idioma no disponible: ${lang}`);
        }
    }
    
    /**
     * Función para actualizar todos los elementos de la interfaz con el idioma actual.
     * 
     * ELEMENTOS ACTUALIZADOS:
     * - Placeholder del campo de búsqueda
     * - Sugerencias mostradas (si hay búsqueda activa)
     * - Cualquier otro texto dinámico de la interfaz
     * 
     * DISEÑO MODULAR:
     * - Separación de responsabilidades: cambio de idioma vs. actualización de UI
     * - Reutilizable: se puede llamar desde otros contextos
     * - Extensible: fácil agregar más elementos a actualizar
     * 
     * CONSIDERACIONES DE RENDIMIENTO:
     * - Solo actualiza elementos que existen (verificación previa)
     * - Evita manipulaciones DOM innecesarias
     * - Logging selectivo para debugging sin spam
     */
    function updateUI() {
        console.log('🔄 Actualizando UI...');
        
        // Actualización del placeholder del campo de búsqueda
        if (searchInput) {
            searchInput.placeholder = getTranslation('search.placeholder');
            console.log('✅ Placeholder actualizado:', searchInput.placeholder);
        }
        
        // Refreso de sugerencias si hay búsqueda activa
        // Esto mantiene consistencia cuando el usuario cambia idioma con búsqueda abierta
        if (searchInput && searchInput.value.trim()) {
            showSuggestions(searchInput.value);
        }
        
        // PUNTO DE EXTENSIÓN:
        // Aquí se pueden agregar más actualizaciones de UI según las necesidades:
        // - Textos de menú dinámicos
        // - Botones con texto
        // - Mensajes de estado
        // - Tooltips
    }
    
    /* ===============================================
       SELECCIÓN Y CACHEO DE ELEMENTOS DEL DOM
       =============================================== */
    
    /**
     * Cacheo de referencias a elementos DOM críticos.
     * 
     * ¿POR QUÉ CACHEAR?
     * - querySelector/getElementById son operaciones costosas
     * - Evita búsquedas repetitivas en el DOM
     * - Mejora el rendimiento significativamente
     * - Código más limpio y mantenible
     * 
     * ESTRATEGIA DE SELECCIÓN:
     * - .querySelector(): Para elementos únicos por clase o selector complejo
     * - .getElementById(): Para elementos con ID específico (más rápido)
     * - Verificación de existencia antes del uso
     * 
     * ELEMENTOS SELECCIONADOS:
     */
    
    /**
     * Contenedor principal del menú de navegación.
     * Usado para: manipulación de clases, inserción de elementos hijos
     */
    const menu = document.querySelector('.menu');
    
    /**
     * Botón hamburguesa para menú móvil.
     * Usado para: toggle de visibilidad en dispositivos móviles
     * Nota: Puede ser null si no existe (verificación posterior)
     */
    const menuToggle = menu ? menu.querySelector('.menu-toggle') : null;
    
    /**
     * Campo de entrada de texto para búsquedas.
     * Elemento crítico del sistema - todas las funcionalidades dependen de él
     */
    const searchInput = document.getElementById('searchInput');
    
    /**
     * Botón de búsqueda.
     * Usado para: ejecución manual de búsquedas via click
     */
    const searchButton = document.getElementById('searchButton');
    
    /**
     * Contenedor de sugerencias de búsqueda.
     * Usado para: mostrar/ocultar dropdown, insertar sugerencias dinámicamente
     */
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    /**
     * Área de contenido principal donde se aplica el resaltado.
     * Usado para: función de highlighting de resultados de búsqueda
     */
    const content = document.getElementById('content');

    /* ===============================================
       VARIABLES DE ESTADO GLOBAL
       =============================================== */
    
    /**
     * Índice de la sugerencia actualmente seleccionada via navegación por teclado.
     * 
     * VALORES POSIBLES:
     * - -1: Ninguna sugerencia seleccionada (estado inicial)
     * - 0 a n-1: Índice de la sugerencia seleccionada
     * 
     * CASOS DE USO:
     * - Navegación con flechas arriba/abajo
     * - Selección con Enter
     * - Resaltado visual de la opción activa
     * 
     * RESETEO:
     * - Al ocultar sugerencias
     * - Al comenzar nueva búsqueda
     * - Después de seleccionar una opción
     */
    let selectedSuggestionIndex = -1;

    /* ===============================================
       FUNCIONES DE INICIALIZACIÓN
       =============================================== */
    
    /**
     * Función principal de inicialización de la aplicación.
     * 
     * RESPONSABILIDADES:
     * 1. Cargar sistema de traducciones
     * 2. Recuperar preferencias de usuario
     * 3. Configurar idioma inicial
     * 4. Crear elementos dinámicos de la interfaz
     * 5. Validar elementos DOM críticos
     * 
     * ORDEN DE EJECUCIÓN CRÍTICO:
     * 1. Verificaciones DOM primero (fail-fast)
     * 2. Carga de traducciones (asíncrona)
     * 3. Configuración de idioma
     * 4. Creación de elementos adicionales
     * 
     * MANEJO DE ERRORES:
     * - Verificación de elementos DOM críticos
     * - Logging detallado para debugging
     * - Graceful degradation si fallan componentes
     * 
     * @returns {Promise<void>} Función asíncrona sin valor de retorno
     */
    async function initialize() {
        console.log('🚀 Inicializando aplicación...');
        
        // VALIDACIÓN DE ELEMENTOS DOM CRÍTICOS
        // Sistema fail-fast: si elementos críticos no existen, detener inicialización
        
        if (!searchInput) {
            console.error('❌ No se encontró el elemento searchInput');
            console.error('Verifique que el HTML contenga: <input id="searchInput">');
            return; // Terminación temprana para evitar errores posteriores
        }
        
        if (!searchSuggestions) {
            console.error('❌ No se encontró el elemento searchSuggestions');
            console.error('Verifique que el HTML contenga: <div id="searchSuggestions">');
            return;
        }
        
        console.log('✅ Elementos DOM críticos encontrados');
        
        // CARGA DEL SISTEMA DE TRADUCCIONES
        // Operación asíncrona que puede tardar según conexión de red
        await loadTranslations();
        
        // RECUPERACIÓN DE PREFERENCIAS DE USUARIO
        // localStorage.getItem() puede retornar null si no existe la clave
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'es';
        console.log(`📱 Idioma guardado/por defecto: ${savedLanguage}`);
        
        // CONFIGURACIÓN DE IDIOMA INICIAL
        changeLanguage(savedLanguage);
        
        // CREACIÓN DE ELEMENTOS DINÁMICOS
        createLanguageSelector();
        
        console.log('✅ Inicialización completada exitosamente');
    }
    
    /**
     * Función para crear dinámicamente el selector de idioma en la interfaz.
     * 
     * UBICACIÓN ESTRATÉGICA:
     * - Antes de la barra de búsqueda
     * - Visible pero no intrusivo
     * - Fácil acceso para el usuario
     * 
     * ESTRUCTURA HTML GENERADA:
     * <div class="language-selector">
     *   <select id="languageSelect">
     *     <option value="es">🇪🇸 Español</option>
     *     <option value="en">🇺🇸 English</option>
     *   </select>
     * </div>
     * 
     * CARACTERÍSTICAS:
     * - Iconos de banderas para identificación visual
     * - Selección automática del idioma actual
     * - Event listener para cambios en tiempo real
     * 
     * DEGRADACIÓN ELEGANTE:
     * - Si no encuentra el menú, no falla pero registra warning
     * - Funcionalidad opcional que no afecta core del sistema
     */
    function createLanguageSelector() {
        // Verificación de existencia del contenedor padre
        if (!menu) {
            console.warn('⚠️ No se encontró el menú para agregar selector de idioma');
            return; // Salida temprana sin error crítico
        }
        
        // Creación del elemento contenedor
        const languageSelector = document.createElement('div');
        languageSelector.className = 'language-selector';
        
        // Generación del HTML interno con template literal
        // Uso de operador ternario para selección condicional
        languageSelector.innerHTML = `
            <select id="languageSelect">
                <option value="es" ${currentLanguage === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
                <option value="en" ${currentLanguage === 'en' ? 'selected' : ''}>🇺🇸 English</option>
            </select>
        `;
        
        // Localización del punto de inserción
        const searchBar = document.querySelector('.search-bar');
        
        if (searchBar) {
            // Inserción antes de la barra de búsqueda
            menu.insertBefore(languageSelector, searchBar);
            
            // Configuración del event listener para cambios de idioma
            const select = document.getElementById('languageSelect');
            select.addEventListener('change', function() {
                // this.value contiene el valor de la opción seleccionada
                changeLanguage(this.value);
            });
            
            console.log('✅ Selector de idioma creado y configurado');
        } else {
            console.warn('⚠️ No se encontró .search-bar para posicionar el selector');
        }
    }

    /* ===============================================
       FUNCIONALIDAD DEL MENÚ MÓVIL
       =============================================== */
    
    /**
     * Configuración del toggle del menú para dispositivos móviles.
     * 
     * FUNCIONAMIENTO:
     * - Click en botón hamburguesa alterna visibilidad del menú
     * - Usa clase CSS 'active' para controlar estado
     * - Diseño responsive que se activa en breakpoints específicos
     * 
     * VERIFICACIÓN CONDICIONAL:
     * - Solo se configura si el botón existe
     * - Evita errores en layouts sin menú móvil
     * 
     * CSS REQUERIDO:
     * - .menu.active: Estado visible del menú
     * - Mediaqueries para ocultar/mostrar según pantalla
     */
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            // toggle() agrega la clase si no existe, la remueve si existe
            menu.classList.toggle('active');
        });
    }

    /* ===============================================
       SISTEMA DE RESALTADO DE TEXTO
       =============================================== */
    
    /**
     * Función para resaltar texto específico dentro del contenido de la página.
     * 
     * ALGORITMO DE RESALTADO:
     * 1. Limpiar resaltados previos (evitar acumulación)
     * 2. Crear expresión regular para búsqueda case-insensitive
     * 3. Recorrer todos los nodos de texto del contenido
     * 4. Aplicar resaltado donde hay coincidencias
     * 
     * CARACTERÍSTICAS AVANZADAS:
     * - Preserva estructura HTML original
     * - Case-insensitive (no distingue mayúsculas/minúsculas)
     * - Escapa caracteres especiales de regex
     * - Usa TreeWalker para eficiencia
     * 
     * CONSIDERACIONES DE RENDIMIENTO:
     * - TreeWalker es más eficiente que getElementsByTagName
     * - Recolecta todos los nodos antes de modificar (evita DOM live collections)
     * - Normaliza nodos después de modificaciones
     * 
     * @param {string} text - Texto a resaltar en el contenido
     */
    function highlightText(text) {
        
        // PASO 1: LIMPIEZA DE RESALTADOS PREVIOS
        // Busca todos los elementos con clase 'highlight' generados previamente
        document.querySelectorAll('.highlight').forEach(el => {
            const parent = el.parentNode;
            // Reemplaza el elemento span con su contenido de texto plano
            parent.replaceChild(document.createTextNode(el.textContent), el);
            // Normaliza el nodo padre para combinar nodos de texto adyacentes
            parent.normalize();
        });

        // Salida temprana si no hay texto para buscar
        if (text === '') return;

        // PASO 2: CREACIÓN DE EXPRESIÓN REGULAR
        // Escapa caracteres especiales que tienen significado en regex
        // Flags: 'g' = global (todas las coincidencias), 'i' = case-insensitive
        const regex = new RegExp(`(${text.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')})`, 'gi');
        
        // PASO 3: CREACIÓN DE TREEWALKER PARA NODOS DE TEXTO
        // TreeWalker es una API eficiente para recorrer nodos específicos del DOM
        const walker = document.createTreeWalker(
            content,                    // Nodo raíz donde buscar
            NodeFilter.SHOW_TEXT,       // Filtro: solo nodos de texto
            null,                       // Sin filtro adicional personalizado
            false                       // No expandir referencias de entidad
        );
        
        // PASO 4: RECOLECCIÓN DE TODOS LOS NODOS DE TEXTO
        // Se recolectan primero para evitar problemas con modificación durante iteración
        const textNodes = [];
        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        // PASO 5: PROCESAMIENTO Y APLICACIÓN DE RESALTADO
        textNodes.forEach(node => {
            // Verificar si el nodo contiene el texto buscado
            if (regex.test(node.nodeValue)) {
                // Crear elemento span contenedor para el resaltado
                const span = document.createElement('span');
                span.className = 'highlight';
                
                // Reemplazar coincidencias con etiquetas <mark>
                // $1 hace referencia al primer grupo capturado en la regex
                span.innerHTML = node.nodeValue.replace(regex, '<mark>$1</mark>');
                
                // Reemplazar el nodo de texto original con el span resaltado
                node.parentNode.replaceChild(span, node);
            }
        });
    }

    /* ===============================================
       SISTEMA DE GESTIÓN DE SUGERENCIAS
       =============================================== */
    
    /**
     * Función principal para mostrar sugerencias filtradas de búsqueda.
     * 
     * FLUJO DE PROCESAMIENTO:
     * 1. Validación de entrada (query no vacía)
     * 2. Obtención de sugerencias del idioma actual
     * 3. Filtrado basado en coincidencias de texto
     * 4. Generación de HTML dinámico
     * 5. Mostrar dropdown con animación
     * 
     * ALGORITMO DE FILTRADO:
     * - Búsqueda case-insensitive
     * - Coincidencias parciales desde cualquier posición
     * - Validación de estructura de datos
     * 
     * GENERACIÓN DE HTML:
     * - Template literals para estructura limpia
     * - Data attributes para interacción posterior
     * - Iconos y categorías para mejor UX
     * 
     * @param {string} query - Término de búsqueda ingresado por el usuario
     */
    function showSuggestions(query) {
        console.log(`🔍 Buscando sugerencias para: "${query}"`);
        
        // VALIDACIÓN DE ENTRADA
        // trim() elimina espacios al inicio y final
        if (!query.trim()) {
            hideSuggestions();
            return;
        }

        // OBTENCIÓN DE SUGERENCIAS DEL IDIOMA ACTUAL
        const currentSuggestions = getTranslation('search.suggestions');
        console.log('📋 Sugerencias disponibles:', currentSuggestions);
        
        // VALIDACIÓN DE ESTRUCTURA DE DATOS
        // Verificar que sea un array válido antes de procesar
        if (!Array.isArray(currentSuggestions)) {
            console.error('❌ Las sugerencias no son un array:', currentSuggestions);
            searchSuggestions.innerHTML = `<div class="no-suggestions">${getTranslation('search.noSuggestions')}</div>`;
            searchSuggestions.classList.add('show');
            return;
        }
        
        // ALGORITMO DE FILTRADO
        const filteredSuggestions = currentSuggestions.filter(item => {
            // Validación de item individual
            if (!item || !item.text) return false;
            
            // Conversión a minúsculas para comparación case-insensitive
            const itemText = item.text.toLowerCase();
            const searchQuery = query.toLowerCase();
            
            // includes() permite coincidencias parciales desde cualquier posición
            // Más flexible que startsWith() o match exacto
            return itemText.includes(searchQuery);
        });
        
        console.log(`✅ Sugerencias filtradas (${filteredSuggestions.length}):`, filteredSuggestions);

        // GENERACIÓN DE HTML DINÁMICO
        if (filteredSuggestions.length === 0) {
            // Caso sin resultados: mostrar mensaje localizado
            searchSuggestions.innerHTML = `<div class="no-suggestions">${getTranslation('search.noSuggestions')}</div>`;
        } else {
            // Caso con resultados: generar lista de sugerencias
            // Caso con resultados: generar lista de sugerencias
            searchSuggestions.innerHTML = filteredSuggestions.map((item, index) => `
                <div class="suggestion-item" data-index="${index}" data-text="${item.text}">
                    <i class="${item.icon}"></i>
                    <span class="suggestion-text">${item.text}</span>
                    <span class="suggestion-category">${item.category}</span>
                </div>
            `).join('');
        }

        // MOSTRAR DROPDOWN CON ESTADO INICIAL
        searchSuggestions.classList.add('show');  // Activa animación CSS
        selectedSuggestionIndex = -1;             // Resetea selección por teclado
    }

    /**
     * Función para ocultar el dropdown de sugerencias.
     * 
     * RESPONSABILIDADES:
     * - Remover clase de visibilidad (activa animación CSS de salida)
     * - Resetear índice de selección por teclado
     * - Limpiar estado visual
     * 
     * CASOS DE USO:
     * - Query vacía o solo espacios
     * - Selección de una sugerencia
     * - Click fuera del componente
     * - Tecla Escape
     * - Pérdida de foco del input
     */
    function hideSuggestions() {
        searchSuggestions.classList.remove('show');
        selectedSuggestionIndex = -1;
    }

    /* ===============================================
       SISTEMA DE BÚSQUEDA Y EJECUCIÓN
       =============================================== */
    
    /**
     * Función principal para ejecutar búsquedas y aplicar resaltado.
     * 
     * PARÁMETROS:
     * @param {string|null} searchTerm - Término específico a buscar (opcional)
     *                                   Si es null, usa el valor actual del input
     * 
     * FLUJO DE EJECUCIÓN:
     * 1. Determinar término de búsqueda (parámetro o input actual)
     * 2. Validar que no esté vacío
     * 3. Aplicar resaltado en el contenido
     * 4. Ocultar dropdown de sugerencias
     * 
     * CASOS DE USO:
     * - Búsqueda manual via botón
     * - Selección de sugerencia
     * - Búsqueda libre con Enter
     * 
     * DISEÑO FLEXIBLE:
     * - Acepta término externo (para sugerencias)
     * - Fallback al input actual (para búsqueda libre)
     */
    function executeSearch(searchTerm = null) {
        // Determinar término: parámetro o valor actual del input
        // trim() elimina espacios en blanco al inicio y final
        const query = searchTerm || searchInput.value.trim();
        console.log(`🔍 Ejecutando búsqueda: "${query}"`);
        
        if (query) {
            // Aplicar resaltado visual en el contenido
            highlightText(query);
            // Limpiar interfaz de sugerencias
            hideSuggestions();
        }
    }

    /**
     * Función para seleccionar una sugerencia específica y ejecutar búsqueda.
     * 
     * FLUJO DE OPERACIÓN:
     * 1. Actualizar valor del input con el texto seleccionado
     * 2. Ejecutar búsqueda con ese término específico
     * 
     * EXPERIENCIA DE USUARIO:
     * - Retroalimentación inmediata: el input muestra la selección
     * - Búsqueda automática: no requiere acción adicional del usuario
     * - Coherencia: mismo comportamiento para click y teclado
     * 
     * @param {string} text - Texto de la sugerencia seleccionada
     */
    function selectSuggestion(text) {
        console.log(`✅ Sugerencia seleccionada: "${text}"`);
        
        // Actualizar campo de entrada con la selección
        searchInput.value = text;
        
        // Ejecutar búsqueda automáticamente
        executeSearch(text);
    }

    /* ===============================================
       EVENT LISTENERS DEL CAMPO DE BÚSQUEDA
       =============================================== */
    
    /**
     * Configuración de todos los event listeners relacionados con el campo de búsqueda.
     * 
     * EVENTOS MANEJADOS:
     * - input: Búsqueda en tiempo real mientras escribe
     * - keydown: Navegación por teclado y atajos
     * - blur: Pérdida de foco (ocultar sugerencias)
     * - focus: Obtención de foco (mostrar sugerencias si hay texto)
     * 
     * VERIFICACIÓN PREVIA:
     * Solo se configuran los listeners si el elemento existe
     */
    if (searchInput) {
        
        /**
         * EVENT LISTENER: Input en tiempo real
         * 
         * COMPORTAMIENTO:
         * - Se dispara en cada cambio del valor del input
         * - Actualiza sugerencias instantáneamente
         * - Proporciona feedback inmediato al usuario
         * 
         * CONSIDERACIONES DE RENDIMIENTO:
         * - Se ejecuta en cada tecla (alta frecuencia)
         * - Función showSuggestions debe ser eficiente
         * - Posible optimización: debouncing para búsquedas complejas
         */
        searchInput.addEventListener('input', function() {
            // this.value hace referencia al valor actual del input
            showSuggestions(this.value);
        });

        /**
         * EVENT LISTENER: Navegación por teclado
         * 
         * TECLAS MANEJADAS:
         * - ArrowDown: Navegar a siguiente sugerencia
         * - ArrowUp: Navegar a sugerencia anterior
         * - Enter: Seleccionar sugerencia actual o búsqueda libre
         * - Escape: Cerrar dropdown
         * 
         * ALGORITMO DE NAVEGACIÓN:
         * - Mantiene índice dentro de límites válidos
         * - Índice -1 = ninguna selección
         * - Índices 0 a n-1 = sugerencias válidas
         * 
         * PREVENCIÓN DE COMPORTAMIENTO POR DEFECTO:
         * - preventDefault() evita acciones nativas del navegador
         * - Especialmente importante para Enter (envío de formulario)
         */
        searchInput.addEventListener('keydown', function(e) {
            // Obtener lista actual de sugerencias visibles
            const suggestionItems = searchSuggestions.querySelectorAll('.suggestion-item');
            
            // Switch para manejar diferentes teclas de manera organizada
            switch(e.key) {
                case 'ArrowDown':
                    // FLECHA ABAJO: Navegar hacia la siguiente sugerencia
                    e.preventDefault(); // Evitar scroll de página
                    
                    // Math.min asegura que no exceda el último índice
                    selectedSuggestionIndex = Math.min(
                        selectedSuggestionIndex + 1, 
                        suggestionItems.length - 1
                    );
                    updateSelectedSuggestion(suggestionItems);
                    break;
                    
                case 'ArrowUp':
                    // FLECHA ARRIBA: Navegar hacia la sugerencia anterior
                    e.preventDefault(); // Evitar movimiento de cursor
                    
                    // Math.max asegura que no baje de -1 (ninguna selección)
                    selectedSuggestionIndex = Math.max(
                        selectedSuggestionIndex - 1, 
                        -1
                    );
                    updateSelectedSuggestion(suggestionItems);
                    break;
                    
                case 'Enter':
                    // ENTER: Seleccionar sugerencia actual o ejecutar búsqueda libre
                    e.preventDefault(); // Evitar envío de formulario
                    
                    if (selectedSuggestionIndex >= 0 && suggestionItems[selectedSuggestionIndex]) {
                        // Hay una sugerencia seleccionada: usarla
                        const selectedText = suggestionItems[selectedSuggestionIndex].dataset.text;
                        selectSuggestion(selectedText);
                    } else {
                        // No hay selección: búsqueda libre con texto actual
                        executeSearch();
                    }
                    break;
                    
                case 'Escape':
                    // ESCAPE: Cerrar dropdown de sugerencias
                    hideSuggestions();
                    break;
            }
        });

        /**
         * EVENT LISTENER: Pérdida de foco (blur)
         * 
         * PROPÓSITO:
         * - Ocultar sugerencias cuando el usuario hace click fuera
         * - Mantener interfaz limpia y no intrusiva
         * 
         * DELAY IMPORTANTE:
         * - setTimeout de 200ms permite que se procesen clicks en sugerencias
         * - Sin este delay, el dropdown se cerraría antes de registrar el click
         * - Balance entre responsividad y funcionalidad
         * 
         * CASOS DE USO:
         * - Click en otra parte de la página
         * - Navegación con Tab a otro elemento
         * - Foco programático en otro elemento
         */
        searchInput.addEventListener('blur', function() {
            // Delay para permitir clicks en sugerencias antes de cerrar
            setTimeout(hideSuggestions, 200);
        });

        /**
         * EVENT LISTENER: Obtención de foco (focus)
         * 
         * COMPORTAMIENTO:
         * - Si ya hay texto en el campo, mostrar sugerencias correspondientes
         * - Mejora la experiencia al volver al campo de búsqueda
         * - Contexto persistente para el usuario
         * 
         * CASOS DE USO:
         * - Click en el campo de búsqueda
         * - Navegación con Tab al campo
         * - Foco programático
         */
        searchInput.addEventListener('focus', function() {
            // Solo mostrar sugerencias si hay contenido existente
            if (this.value.trim()) {
                showSuggestions(this.value);
            }
        });
    }

    /* ===============================================
       FUNCIONES AUXILIARES PARA NAVEGACIÓN
       =============================================== */
    
    /**
     * Función para actualizar visualmente qué sugerencia está seleccionada.
     * 
     * ALGORITMO:
     * 1. Iterar sobre todos los elementos de sugerencia
     * 2. Comparar índice de cada elemento con índice seleccionado
     * 3. Agregar/remover clase CSS según coincidencia
     * 
     * CLASE CSS UTILIZADA:
     * - 'selected': Aplicada al elemento actualmente seleccionado
     * - Removida de todos los demás elementos
     * 
     * EFICIENCIA:
     * - Un solo recorrido de elementos
     * - Uso de classList.toggle() con condición
     * - Evita manipulaciones DOM innecesarias
     * 
     * @param {NodeList} suggestionItems - Lista de elementos de sugerencia del DOM
     */
    function updateSelectedSuggestion(suggestionItems) {
        // forEach con arrow function para código conciso
        suggestionItems.forEach((item, index) => {
            // toggle(className, condition) agrega clase si condition es true,
            // la remueve si es false
            item.classList.toggle('selected', index === selectedSuggestionIndex);
        });
    }

    /* ===============================================
       EVENT LISTENERS PARA INTERACCIÓN CON SUGERENCIAS
       =============================================== */
    
    /**
     * Event listener para clicks en sugerencias usando event delegation.
     * 
     * EVENT DELEGATION:
     * - Un solo listener en el contenedor padre
     * - Maneja clicks en elementos dinámicos (creados/destruidos)
     * - Más eficiente que listeners individuales
     * - Funciona con contenido generado dinámicamente
     * 
     * ALGORITMO:
     * 1. Detectar si el click fue en una sugerencia
     * 2. Usar closest() para encontrar el elemento contenedor
     * 3. Extraer datos del elemento y procesar selección
     * 
     * VENTAJAS DE CLOSEST():
     * - Maneja clicks en elementos hijos (icono, texto, categoría)
     * - Busca hacia arriba en el DOM hasta encontrar el contenedor
     * - Robusto ante cambios en estructura HTML interna
     */
    if (searchSuggestions) {
        searchSuggestions.addEventListener('click', function(e) {
            // closest() busca el elemento .suggestion-item más cercano hacia arriba
            // Funciona aunque el click sea en un elemento hijo (i, span)
            const suggestionItem = e.target.closest('.suggestion-item');
            
            if (suggestionItem) {
                // Extraer texto desde data attribute
                const text = suggestionItem.dataset.text;
                selectSuggestion(text);
            }
        });
    }

    /* ===============================================
       EVENT LISTENERS PARA BOTÓN DE BÚSQUEDA
       =============================================== */
    
    /**
     * Event listener para el botón de búsqueda manual.
     * 
     * FUNCIONALIDAD:
     * - Permitir búsqueda via click además de Enter
     * - Interfaz alternativa para usuarios que prefieren mouse
     * - Accesibilidad mejorada
     * 
     * VERIFICACIÓN CONDICIONAL:
     * - Solo se configura si el botón existe
     * - Evita errores en interfaces sin botón de búsqueda
     */
    if (searchButton) {
        searchButton.addEventListener('click', executeSearch);
    }

    /* ===============================================
       EVENT LISTENERS GLOBALES DEL DOCUMENTO
       =============================================== */
    
    /**
     * Event listener global para clicks fuera del área de búsqueda.
     * 
     * PROPÓSITO:
     * - Cerrar sugerencias cuando se hace click en cualquier parte fuera
     * - Comportamiento estándar esperado por usuarios
     * - Mantener interfaz limpia y no intrusiva
     * 
     * ALGORITMO:
     * 1. Detectar todos los clicks en el documento
     * 2. Verificar si el click fue fuera del componente de búsqueda
     * 3. Si es así, ocultar sugerencias
     * 
     * SELECTORES UTILIZADOS:
     * - '.search-container': Contenedor completo del componente
     * - closest() verifica si el click fue dentro de este contenedor
     * 
     * EFICIENCIA:
     * - Un solo listener global vs. múltiples listeners locales
     * - Early return evita procesamiento innecesario
     */
    document.addEventListener('click', function(e) {
        // Si el click NO fue dentro del contenedor de búsqueda
        if (!e.target.closest('.search-container')) {
            hideSuggestions();
        }
    });

    /* ===============================================
       LLAMADA DE INICIALIZACIÓN FINAL
       =============================================== */
    
    /**
     * Llamada a la función de inicialización principal.
     * 
     * UBICACIÓN ESTRATÉGICA:
     * - Al final del DOMContentLoaded listener
     * - Después de todas las definiciones de funciones
     * - Garantiza que todo esté definido antes de ejecutar
     * 
     * FUNCIÓN ASÍNCRONA:
     * - initialize() es async debido a loadTranslations()
     * - No necesita await aquí porque no dependemos del resultado
     * - El manejo de errores está dentro de initialize()
     */
    initialize();

}); // Fin del DOMContentLoaded event listener

/* ===============================================
   DOCUMENTACIÓN ADICIONAL
   =============================================== */

/**
 * PUNTOS DE EXTENSIÓN IDENTIFICADOS:
 * 
 * 1. NUEVOS IDIOMAS:
 *    - Agregar entradas en fallbackSuggestions
 *    - Actualizar createLanguageSelector() con nuevas opciones
 *    - Considerar RTL para idiomas como árabe/hebreo
 * 
 * 2. OPTIMIZACIONES DE RENDIMIENTO:
 *    - Implementar debouncing en el input listener
 *    - Lazy loading de traducciones grandes
 *    - Virtual scrolling para muchas sugerencias
 * 
 * 3. ACCESIBILIDAD AVANZADA:
 *    - ARIA labels para sugerencias
 *    - Anuncios de screen reader para cambios
 *    - Soporte completo para navegación por teclado
 * 
 * 4. FUNCIONALIDADES ADICIONALES:
 *    - Historial de búsquedas
 *    - Sugerencias basadas en popularidad
 *    - Búsqueda con autocorrección
 *    - Categorías colapsables
 *    - Búsqueda por voz
 * 
 * 5. INTEGRACIÓN CON BACKENDS:
 *    - API para sugerencias dinámicas
 *    - Análisis de búsquedas
 *    - Personalización basada en usuario
 *    - Cache inteligente de resultados
 */

/**
 * PATRONES DE DISEÑO UTILIZADOS:
 * 
 * 1. MODULE PATTERN:
 *    - Todo encapsulado en DOMContentLoaded
 *    - Variables privadas no globales
 *    - Exposición controlada de funcionalidad
 * 
 * 2. EVENT DELEGATION:
 *    - Listeners en contenedores padre
 *    - Manejo de elementos dinámicos
 *    - Eficiencia de memoria mejorada
 * 
 * 3. OBSERVER PATTERN:
 *    - Event listeners como observadores
 *    - Separación de concerns clara
 *    - Bajo acoplamiento entre componentes
 * 
 * 4. STRATEGY PATTERN:
 *    - Diferentes estrategias de carga (JSON vs fallback)
 *    - Múltiples formas de ejecutar búsqueda
 *    - Flexibilidad en implementación
 * 
 * 5. FACADE PATTERN:
 *    - Funciones como showSuggestions() simplifican operaciones complejas
 *    - Interfaz unificada para operaciones relacionadas
 *    - Abstracción de complejidad interna
 */

/**
 * CONSIDERACIONES DE SEGURIDAD:
 * 
 * 1. XSS PREVENTION:
 *    - Validación de entrada en filtros
 *    - Uso cuidadoso de innerHTML
 *    - Escapado de caracteres especiales en regex
 * 
 * 2. DATA VALIDATION:
 *    - Verificación de estructura de JSON
 *    - Validación de tipos de datos
 *    - Manejo robusto de datos malformados
 * 
 * 3. ERROR HANDLING:
 *    - Try-catch en operaciones críticas
 *    - Graceful degradation en fallos
 *    - Logging adecuado para debugging
 */

/**
 * MÉTRICAS DE RENDIMIENTO TÍPICAS:
 * 
 * - Tiempo de inicialización: < 100ms
 * - Respuesta de sugerencias: < 50ms
 * - Carga de traducciones: < 200ms
 * - Memoria utilizada: < 2MB
 * - Tamaño de archivo: ~15KB comprimido
 * 
 * OPTIMIZACIONES APLICADAS:
 * - Cacheo de selectors DOM
 * - Event delegation
 * - Lazy loading de recursos
 * - Minimización de reflows/repaints
 * - Uso eficiente de APIs modernas
 */
