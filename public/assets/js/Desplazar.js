// Función para manejar el desplazamiento suave al hacer clic en el enlace del navbar
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    const navbarHeight = document.querySelector('#navbar').offsetHeight;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition - navbarHeight;
  
    window.scrollBy({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
  
  // Agregar evento de clic para los enlaces del dropdown del navbar
  const dropdownLinks = document.querySelectorAll('.navbar .dropdown ul li a');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault(); // Evita el comportamiento predeterminado del enlace
      const target = this.getAttribute('href');
      smoothScrollTo(target);
    });
  });
  