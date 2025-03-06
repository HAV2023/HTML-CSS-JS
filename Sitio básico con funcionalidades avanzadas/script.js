document.addEventListener('DOMContentLoaded', function () {
    const menu = document.querySelector('.menu');
    const menuToggle = menu.querySelector('.menu-toggle');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const content = document.getElementById('content');

    // Alternar menú en móviles
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            menu.classList.toggle('active');
        });
    }

    function highlightText(text) {
        // Eliminar resaltados previos
        document.querySelectorAll('.highlight').forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });

        if (text === '') return;

        const regex = new RegExp(`(${text.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')})`, 'gi');
        const walker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null, false);
        const textNodes = [];

        while (walker.nextNode()) {
            textNodes.push(walker.currentNode);
        }

        textNodes.forEach(node => {
            if (regex.test(node.nodeValue)) {
                const span = document.createElement('span');
                span.className = 'highlight';
                span.innerHTML = node.nodeValue.replace(regex, '<mark>$1</mark>');
                node.parentNode.replaceChild(span, node);
            }
        });
    }

    function executeSearch() {
        if (searchInput && content) {
            highlightText(searchInput.value.trim());
        }
    }

    if (searchButton) {
        searchButton.addEventListener('click', executeSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                executeSearch();
            }
        });
    }
});
