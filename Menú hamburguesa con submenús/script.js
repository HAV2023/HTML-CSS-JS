/* ================================================================
   VARIABLES GLOBALES Y SELECCIÓN DE ELEMENTOS DOM
   ================================================================ */

// Obtener referencias a los elementos principales del DOM
const hamburgerBtn = document.getElementById('hamburgerBtn');  // Botón hamburguesa
const sidebar = document.getElementById('sidebar');            // Menú lateral deslizante
const overlay = document.getElementById('overlay');            // Overlay de fondo oscuro

/* ================================================================
   FUNCIÓN PRINCIPAL PARA TOGGLE DEL MENÚ LATERAL
   ================================================================ */

/**
 * Función que abre o cierra el menú lateral
 * Controla la animación del botón hamburguesa, el deslizamiento del menú
 * y la aparición/desaparición del overlay
 */
function toggleSidebar() {
    // Alterna la clase 'active' en el botón para la animación hamburguesa -> X
    hamburgerBtn.classList.toggle('active');
    
    // Alterna la clase 'active' en el sidebar para deslizarlo desde la izquierda
    sidebar.classList.toggle('active');
    
    // Alterna la clase 'active' en el overlay para mostrarlo/ocultarlo
    overlay.classList.toggle('active');
}

/* ================================================================
   EVENT LISTENERS PARA INTERACCIONES DEL USUARIO
   ================================================================ */

// Event listener para el clic en el botón hamburguesa
hamburgerBtn.addEventListener('click', toggleSidebar);

// Event listener para el clic en el overlay (cerrar menú al hacer clic fuera)
overlay.addEventListener('click', toggleSidebar);

/* ================================================================
   FUNCIÓN PARA MANEJO DE SUBMENÚS DESPLEGABLES
   ================================================================ */

/**
 * Función que controla la apertura y cierre de submenús verticales
 * @param {string} submenuId - ID del submenú a abrir/cerrar
 */
function toggleSubmenu(submenuId) {
    // Obtener el elemento del submenú específico por su ID
    const submenu = document.getElementById(submenuId);
    
    // Obtener la flecha del submenú (elemento anterior al submenú)
    const arrow = submenu.previousElementSibling.querySelector('.dropdown-arrow');
    
    // ========== CERRAR OTROS SUBMENÚS ABIERTOS ==========
    // Obtener todos los submenús y flechas para cerrar los que no sean el actual
    const allSubmenus = document.querySelectorAll('.submenu');
    const allArrows = document.querySelectorAll('.dropdown-arrow');
    
    // Iterar sobre todos los submenús para cerrar los que no sean el clickeado
    allSubmenus.forEach((menu, index) => {
        if (menu.id !== submenuId) {
            // Remover la clase 'active' para cerrar el submenú
            menu.classList.remove('active');
            // Remover la rotación de la flecha correspondiente
            allArrows[index].classList.remove('rotated');
        }
    });
    
    // ========== TOGGLE DEL SUBMENÚ ACTUAL ==========
    // Alternar el estado del submenú clickeado
    submenu.classList.toggle('active');
    // Alternar la rotación de su flecha
    arrow.classList.toggle('rotated');
}

/* ================================================================
   FUNCIONALIDAD ADICIONAL: CERRAR MENÚ CON TECLA ESCAPE
   ================================================================ */

/**
 * Event listener para cerrar el menú con la tecla Escape
 * Mejora la experiencia de usuario permitiendo cerrar el menú con el teclado
 */
document.addEventListener('keydown', function(e) {
    // Verificar si se presionó la tecla Escape Y el sidebar está activo
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        toggleSidebar(); // Cerrar el menú
    }
});

/* ================================================================
   PREVENCIÓN DE SCROLL DEL BODY CUANDO EL MENÚ ESTÁ ABIERTO
   ================================================================ */

/**
 * Observer que vigila cambios en las clases del sidebar
 * Cuando el menú está abierto, previene el scroll del body
 * Esto evita que el usuario pueda scrollear el contenido de fondo
 */

// Referencia al elemento body para controlar el scroll
const body = document.body;

// Crear un MutationObserver para detectar cambios en las clases del sidebar
const observer = new MutationObserver(function(mutations) {
    // Iterar sobre todas las mutaciones detectadas
    mutations.forEach(function(mutation) {
        // Verificar si el cambio fue en el atributo 'class'
        if (mutation.attributeName === 'class') {
            // Si el sidebar tiene la clase 'active' (está abierto)
            if (sidebar.classList.contains('active')) {
                body.style.overflow = 'hidden'; // Deshabilitar scroll del body
            } else {
                body.style.overflow = '';        // Restaurar scroll normal del body
            }
        }
    });
});

// Configurar el observer para vigilar cambios en el atributo 'class' del sidebar
observer.observe(sidebar, {
    attributes: true,              // Observar cambios en atributos
    attributeFilter: ['class']     // Solo observar cambios en el atributo 'class'
});

/* ================================================================
   NOTAS TÉCNICAS Y FUNCIONAMIENTO
   ================================================================ */

/*
FLUJO DE FUNCIONAMIENTO:

1. APERTURA DEL MENÚ:
   - Usuario hace clic en el botón hamburguesa
   - Se ejecuta toggleSidebar()
   - Se añade clase 'active' al botón (animación hamburguesa -> X)
   - Se añade clase 'active' al sidebar (desliza desde la izquierda)
   - Se añade clase 'active' al overlay (aparece fondo oscuro)
   - El observer detecta el cambio y bloquea el scroll del body

2. INTERACCIÓN CON SUBMENÚS:
   - Usuario hace clic en un elemento con submenú
   - Se ejecuta toggleSubmenu(id)
   - Se cierran otros submenús abiertos
   - Se abre/cierra el submenú clickeado
   - Se rota la flecha indicadora

3. CIERRE DEL MENÚ:
   - Usuario hace clic en el botón hamburguesa, overlay, o presiona Escape
   - Se ejecuta toggleSidebar()
   - Se remueven todas las clases 'active'
   - El menú se desliza fuera de vista
   - Se restaura el scroll normal del body

TÉCNICAS UTILIZADAS:
- CSS Transitions para animaciones suaves
- CSS Transform para rotaciones y movimientos
- Flexbox para layouts
- MutationObserver para reactividad
- Event delegation para manejo eficiente de eventos
- Cubic-bezier para curvas de animación personalizadas
*/
