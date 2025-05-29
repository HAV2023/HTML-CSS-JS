(function(){
  const input = document.getElementById('search-input');
  const results = document.getElementById('results');
  const content = document.getElementById('content');

  // Extraemos los textos y títulos del contenido para buscar
  // Creamos un array de objetos {title, text}
  const sections = [];
  // Vamos a obtener todos los h2 y sus párrafos hermanos
  const headings = content.querySelectorAll('h2');

  headings.forEach(h2 => {
    let textBlocks = '';
    // obtener hermanos siguientes hasta el siguiente h2 o fin
    let sibling = h2.nextElementSibling;
    while(sibling && sibling.tagName !== 'H2'){
      if(sibling.tagName === 'P'){
        textBlocks += sibling.textContent + ' ';
      }
      sibling = sibling.nextElementSibling;
    }
    sections.push({title: h2.textContent.trim(), text: textBlocks.trim()});
  });

  // Función para escapar RegExp
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Función para obtener preview con palabra marcada
  function getPreview(text, query, previewLen = 100){
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();
    const idx = textLower.indexOf(queryLower);
    if(idx === -1) return '';

    // Definir inicio y fin para preview
    let start = idx - Math.floor(previewLen / 2);
    if(start < 0) start = 0;
    let end = start + previewLen;
    if(end > text.length) end = text.length;

    let preview = text.substring(start, end);

    // Marcar la palabra con <mark>
    const regex = new RegExp(escapeRegExp(query), 'gi');
    preview = preview.replace(regex, (match) => `<mark>${match}</mark>`);

    // Agregar ... si preview no está al inicio o final del texto
    if(start > 0) preview = '... ' + preview;
    if(end < text.length) preview = preview + ' ...';

    return preview;
  }

  function searchContent(query) {
    results.innerHTML = '';
    if(query.trim().length < 2) return; // mínimo 2 caracteres para buscar

    const matches = [];
    sections.forEach(section => {
      if(section.text.toLowerCase().includes(query.toLowerCase()) || section.title.toLowerCase().includes(query.toLowerCase())){
        const preview = getPreview(section.text, query);
        matches.push({title: section.title, preview});
      }
    });

    if(matches.length === 0){
      results.innerHTML = '<p>No se encontraron resultados.</p>';
      return;
    }

    const fragment = document.createDocumentFragment();

    matches.forEach(m => {
      const div = document.createElement('div');
      div.classList.add('result-item');

      const titleEl = document.createElement('div');
      titleEl.classList.add('result-title');
      titleEl.textContent = m.title;

      const previewEl = document.createElement('div');
      previewEl.classList.add('result-preview');
      previewEl.innerHTML = m.preview;

      div.appendChild(titleEl);
      div.appendChild(previewEl);
      fragment.appendChild(div);
    });

    results.appendChild(fragment);
  }

  input.addEventListener('input', e => {
    searchContent(e.target.value);
  });
})();

