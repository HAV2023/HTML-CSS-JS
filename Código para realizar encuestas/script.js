function submitVote() {
    if (localStorage.getItem("hasVoted")) {
        alert("Ya has votado. No puedes volver a votar.");
        return;
    }
    
    const options = document.getElementsByName("vote");
    let selectedOption = null;
    options.forEach(option => {
        if (option.checked) selectedOption = option.value;
    });
    
    if (!selectedOption) {
        alert("Por favor, selecciona una opción antes de votar.");
        return;
    }
    
    let votes = JSON.parse(localStorage.getItem("votes")) || {1: 0, 2: 0, 3: 0, 4: 0};
    votes[selectedOption]++;
    localStorage.setItem("votes", JSON.stringify(votes));
    localStorage.setItem("hasVoted", "true");
    alert("Gracias por tu voto!");
}

function showResults() {
    let votes = JSON.parse(localStorage.getItem("votes")) || {1: 0, 2: 0, 3: 0, 4: 0};
    let totalVotes = votes[1] + votes[2] + votes[3] + votes[4];
    if (totalVotes === 0) {
        alert("Aún no hay votos registrados.");
        return;
    }
    
    document.getElementById("results").classList.remove("hidden");
    for (let i = 1; i <= 4; i++) {
        let percentage = ((votes[i] / totalVotes) * 100).toFixed(1);
        document.getElementById(`bar${i}`).style.width = percentage + "%";
        document.getElementById(`bar${i}`).textContent = percentage + "%";
    }
}

function hideResults() {
    document.getElementById("results").classList.add("hidden");
}
