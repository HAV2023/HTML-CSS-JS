// ====== Lista de frases célebres ======
const quotes = [
    "La vida es lo que pasa mientras estás ocupado haciendo otros planes. - John Lennon",
    "El único modo de hacer un gran trabajo es amar lo que haces. - Steve Jobs",
    "No cuentes los días, haz que los días cuenten. - Muhammad Ali",
    "El éxito es ir de fracaso en fracaso sin perder el entusiasmo. - Winston Churchill",
    "En la vida hay algo peor que el fracaso: no haber intentado nada. - Franklin D. Roosevelt",
    "Lo más difícil es la decisión de actuar, el resto es mera tenacidad. - Amelia Earhart",
    "No dejes que el miedo a perder sea mayor que la emoción de ganar. - Robert Kiyosaki",
    "El futuro pertenece a quienes creen en la belleza de sus sueños. - Eleanor Roosevelt"
];

// ====== Función para obtener una frase aleatoria ======
function getRandomQuote() {
    // Genera un índice aleatorio entre 0 y la cantidad total de frases en el array
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex]; // Devuelve la frase correspondiente al índice generado
}

// ====== Mostrar la frase aleatoria en el elemento con id "quote" ======
document.getElementById('quote').textContent = getRandomQuote();

