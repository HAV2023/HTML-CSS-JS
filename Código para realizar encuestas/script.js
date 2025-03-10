function submitVote() {
    // Verifica si el usuario ya ha votado previamente
    if (localStorage.getItem("hasVoted")) {
        alert("Ya has votado. No puedes volver a votar.");
        return; // Sale de la función si ya ha votado
    }
    
    // Obtiene todas las opciones de la encuesta
    const options = document.getElementsByName("vote");
    let selectedOption = null; // Variable para almacenar la opción seleccionada
    
    // Recorre todas las opciones y guarda la seleccionada
    options.forEach(option => {
        if (option.checked) selectedOption = option.value;
    });
    
    // Si no se seleccionó ninguna opción, muestra una alerta y detiene la función
    if (!selectedOption) {
        alert("Por favor, selecciona una opción antes de votar.");
        return;
    }
    
    // Recupera los votos almacenados o crea un objeto con conteo inicial
    let votes = JSON.parse(localStorage.getItem("votes")) || {1: 0, 2: 0, 3: 0, 4: 0};
    
    // Incrementa el conteo de la opción seleccionada
    votes[selectedOption]++;
    
    // Guarda los votos actualizados en el almacenamiento local
    localStorage.setItem("votes", JSON.stringify(votes));
    localStorage.setItem("hasVoted", "true"); // Marca que el usuario ya ha votado
    
    alert("Gracias por tu voto!"); // Muestra un mensaje de confirmación
}

function showResults() {
    // Recupera los votos almacenados o inicializa con valores en 0
    let votes = JSON.parse(localStorage.getItem("votes")) || {1: 0, 2: 0, 3: 0, 4: 0};
    
    // Calcula el total de votos sumando todas las opciones
    let totalVotes = votes[1] + votes[2] + votes[3] + votes[4];
    
    // Si no hay votos, muestra una alerta y sale de la función
    if (totalVotes === 0) {
        alert("Aún no hay votos registrados.");
        return;
    }
    
    // Muestra la sección de resultados
    document.getElementById("results").classList.remove("hidden");
    
    // Calcula el porcentaje de cada opción y actualiza las barras de resultados
    for (let i = 1; i <= 4; i++) {
        let percentage = ((votes[i] / totalVotes) * 100).toFixed(1); // Calcula el porcentaje con un decimal
        document.getElementById(`bar${i}`).style.width = percentage + "%"; // Ajusta el ancho de la barra
        document.getElementById(`bar${i}`).textContent = percentage + "%"; // Muestra el porcentaje dentro de la barra
    }
}

function hideResults() {
    // Oculta la sección de resultados agregando la clase 'hidden'
    document.getElementById("results").classList.add("hidden");
}
