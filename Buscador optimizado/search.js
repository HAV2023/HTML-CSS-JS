/* Autor: Héctor Arciniega */
(function(){
  // Declaración de función anónima autoejecutable (IIFE)
  // Esto crea un ámbito local para evitar contaminar el ámbito global

  const input = document.getElementById('search-input');
  // Obtiene la referencia al input de búsqueda por su id
  // Será donde el usuario escriba el texto a buscar

  const results = document.getElementById('results');
  // Obtiene el contenedor donde se mostrarán los resultados dinámicamente

  const content = document.getElementById('content');
  // Obtiene el contenedor que tiene todo el contenido donde haremos la búsqueda

  // Extraemos los textos y títulos del contenido para buscar
  // Creamos un array de objetos {title, text}
  const sections = [];
  // Array vacío que almacenará objetos con la estructura:
  // { title: 'Título de sección', text: 'Texto completo de esa sección' }

  // Vamos a obtener todos los h2 y sus párrafos hermanos
  const headings = content.querySelectorAll('h2');
  // Obtiene todos los elementos h2 dentro de #content, 
  // para identificar cada sección del contenido (cada tema)

  headings.forEach(h2 => {
    let textBlocks = '';
    // Variable que almacenará concatenado el texto de todos los párrafos de la sección actual

    // Obtener objetos hermanos siguientes hasta el siguiente h2 o fin del contenido
    let sibling = h2.nextElementSibling;
    while(sibling && sibling.tagName !== 'H2'){
      if(sibling.tagName === 'P'){
        // Si el hermano es un párrafo, añadimos su texto al bloque
        textBlocks += sibling.textContent + ' ';
      }
      sibling = sibling.nextElementSibling;
      // Avanzamos al siguiente objeto hermano para revisar
    }

    // Guardamos la sección con título y texto completo
    sections.push({
      title: h2.textContent.trim(),  // Título sin espacios al inicio/final
      text: textBlocks.trim()         // Texto de párrafos concatenados, también limpio
    });
  });

  // Función para escapar caracteres especiales en expresiones regulares
  function escapeRegExp(string) {
    // Esto evita que caracteres con significado especial en regex causen errores
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Función para obtener un fragmento de texto (preview) alrededor de la palabra buscada,
  // resaltando la palabra con la etiqueta <mark>
  function getPreview(text, query, previewLen = 100){
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();

    // Buscar la posición donde aparece la palabra (en minúsculas para ignorar mayúsculas)
    const idx = textLower.indexOf(queryLower);
    if(idx === -1) return ''; // Si no se encuentra, retorna cadena vacía

    // Definir inicio y fin del fragmento para la preview, centrado en la palabra buscada
    let start = idx - Math.floor(previewLen / 2);
    if(start < 0) start = 0;
    let end = start + previewLen;
    if(end > text.length) end = text.length;

    // Extraer el fragmento de texto para la preview
    let preview = text.substring(start, end);

    // Crear expresión regular para la palabra buscada (sin importar mayúsc/minúsc)
    const regex = new RegExp(escapeRegExp(query), 'gi');

    // Reemplazar la palabra buscada en el preview con la misma palabra envuelta en <mark>
    preview = preview.replace(regex, (match) => `<mark>${match}</mark>`);

    // Agregar puntos suspensivos al inicio o al final si el preview está cortado
    if(start > 0) preview = '... ' + preview;
    if(end < text.length) preview = preview + ' ...';

    return preview; // Retorna el fragmento con la palabra resaltada
  }

  // Función principal que hace la búsqueda y muestra resultados
  function searchContent(query) {
    results.innerHTML = ''; // Limpia resultados previos

    if(query.trim().length < 2) return; // Ignora búsquedas con menos de 2 caracteres

    const matches = [];
    // Recorre cada sección para buscar coincidencias en título o texto
    sections.forEach(section => {
      if(
        section.text.toLowerCase().includes(query.toLowerCase()) ||
        section.title.toLowerCase().includes(query.toLowerCase())
      ){
        // Si la palabra está en el texto o en el título
        const preview = getPreview(section.text, query); // Obtenemos preview con palabra resaltada
        matches.push({title: section.title, preview}); // Guardamos resultado
      }
    });

    if(matches.length === 0){
      // Si no hay coincidencias, mostramos mensaje
      results.innerHTML = '<p>No se encontraron resultados.</p>';
      return;
    }

    // Usamos un DocumentFragment para insertar resultados sin repintar todo repetidamente
    const fragment = document.createDocumentFragment();

    matches.forEach(m => {
      const div = document.createElement('div');
      div.classList.add('result-item');

      const titleEl = document.createElement('div');
      titleEl.classList.add('result-title');
      titleEl.textContent = m.title;

      const previewEl = document.createElement('div');
      previewEl.classList.add('result-preview');
      // Se usa innerHTML porque preview contiene etiquetas <mark>
      previewEl.innerHTML = m.preview;

      // Construimos el bloque resultado: título + preview
      div.appendChild(titleEl);
      div.appendChild(previewEl);

      fragment.appendChild(div);
    });

    // Insertamos todos los resultados al contenedor de forma eficiente
    results.appendChild(fragment);
  }

  // Event listener para capturar la escritura en el input y lanzar la búsqueda
  input.addEventListener('input', e => {
    searchContent(e.target.value);
  });

})();
