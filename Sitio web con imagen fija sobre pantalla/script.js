// Función que ajusta el margen izquierdo del bloque de texto en función del ancho real de la imagen
function adjustMargin() {
  // Seleccionamos la imagen fija dentro del contenedor
  var fixedImg = document.querySelector(".fixed-img img");
  // Seleccionamos el contenedor de texto desplazable
  var scrollText = document.querySelector(".scroll-text");
  // Obtenemos el ancho de la imagen (su tamaño natural)
  var imgWidth = fixedImg.offsetWidth;
  // Asignamos al contenedor de texto un margen izquierdo igual al ancho de la imagen más un espacio extra (20px)
  scrollText.style.marginLeft = (imgWidth + 20) + "px";
}

// Ajustamos el margen cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", adjustMargin);
// También reajustamos en cada cambio de tamaño de la ventana
window.addEventListener("resize", adjustMargin);

