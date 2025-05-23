const toTopBtn = document.getElementById("toTop");
const loadMoreBtn = document.getElementById("loadMore");
const contentDiv = document.getElementById("content");

// Mostrar/Ocultar botón "Ir arriba" al hacer scroll
window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
        toTopBtn.style.display = "block";
    } else {
        toTopBtn.style.display = "none";
    }
});

// Scroll suave al hacer clic en "Ir arriba"
toTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Agregar más párrafos para aumentar contenido al hacer clic en "Más..."
loadMoreBtn.addEventListener("click", () => {
    for (let i = 0; i < 10; i++) {
        const p = document.createElement("p");
        p.textContent = "Texto adicional para que la página sea más larga y aparezca el scroll. Esto permite probar el botón Ir arriba correctamente.";
        contentDiv.insertBefore(p, loadMoreBtn);
    }
});
