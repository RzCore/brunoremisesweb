/**
 * Remises Bruno - Modern JavaScript
 * Funcionalidades avanzadas y animaciones
 */

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todas las funcionalidades
    initAOS();
    initSwiper();
    initNavbar();
    initBackToTop();
    initSmoothScroll();
    initContactForm();
    initScrollAnimations();
    initPreloader();
});

/**
 * Inicializar AOS (Animate On Scroll)
 */
function initAOS() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 100
    });
}

/**
 * Inicializar Swiper para la flota y servicios
 */
function initSwiper() {
    // Swiper para la flota
    const fleetSwiper = new Swiper('.fleet-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
            },
        }
    });

    // Swiper para servicios móvil
    const servicesSwiper = new Swiper('.services-carousel', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            480: {
                slidesPerView: 1.2,
                spaceBetween: 15,
            },
            640: {
                slidesPerView: 1.5,
                spaceBetween: 20,
            }
        }
    });
}

/**
 * Inicializar navegación
 */
function initNavbar() {
  const header = document.getElementById('header');
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  const navLinks = document.querySelectorAll('.nav-link');

  // Cambiar estilo del header al hacer scroll
  window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Cerrar menú móvil al hacer clic en un enlace
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navbarCollapse.classList.contains('show')) {
        navbarToggler.click();
      }
    });
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', function(event) {
    const isClickInsideNavbar = header.contains(event.target);
    const isNavbarToggler = navbarToggler.contains(event.target);
    
    if (!isClickInsideNavbar && navbarCollapse.classList.contains('show')) {
      navbarToggler.click();
    }
  });

  // Marcar enlace activo según la sección visible
  window.addEventListener('scroll', function() {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * Inicializar botón "Volver arriba"
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Inicializar scroll suave
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Ajustar por el header fijo
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Inicializar formulario de contacto
 */
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Mostrar estado de carga
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Enviando...';
            submitBtn.disabled = true;
            
            // Simular envío (reemplazar con lógica real)
            setTimeout(() => {
                // Mostrar mensaje de éxito
                showNotification('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');
                
                // Resetear formulario
                this.reset();
                
                // Restaurar botón
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Cerrar modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('contactModal'));
                if (modal) {
                    modal.hide();
                }
            }, 2000);
        });
    }
}

/**
 * Inicializar animaciones de scroll personalizadas
 */
function initScrollAnimations() {
    // Contador animado para estadísticas
    const stats = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target) => {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + (target === 24 ? '/7' : '+');
        }, 20);
    };

    // Observar cuando las estadísticas están visibles
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                let number = parseInt(text.replace(/\D/g, ''));
                
                if (text.includes('24/7')) {
                    number = 24;
                }
                
                animateCounter(target, number);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

/**
 * Inicializar preloader
 */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        window.addEventListener('load', function() {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 300);
        });
    }
}

/**
 * Mostrar notificación
 */
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Agregar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        max-width: 400px;
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

/**
 * Función para validar formularios
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
        
        // Validar email
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                input.classList.add('is-invalid');
            }
        }
    });
    
    return isValid;
}

/**
 * Función para formatear números de teléfono
 */
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 0) {
        value = value.replace(/(\d{4})(\d{3})(\d{3})/, '$1 - $2 - $3');
    }
    input.value = value;
}

/**
 * Función para lazy loading de imágenes
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/**
 * Función para parallax en el hero
 */
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    const heroBackground = document.querySelector('.hero-background');
    
    if (heroSection && heroBackground) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroBackground.style.transform = `translateY(${rate}px)`;
        });
    }
}

/**
 * Función para efectos de hover en tarjetas
 */
function initCardEffects() {
    const cards = document.querySelectorAll('.service-card, .fleet-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/**
 * Función para animaciones de texto
 */
function initTextAnimations() {
    const animatedTexts = document.querySelectorAll('.animate-text');
    
    animatedTexts.forEach(text => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        });
        
        observer.observe(text);
    });
}

/**
 * Función para gestión de cookies
 */
function initCookieConsent() {
    if (!localStorage.getItem('cookieConsent')) {
        const cookieBanner = document.createElement('div');
        cookieBanner.innerHTML = `
            <div class="cookie-banner">
                <p>Utilizamos cookies para mejorar tu experiencia. Al continuar navegando, aceptas nuestra política de cookies.</p>
                <button class="btn btn-primary btn-sm" onclick="acceptCookies()">Aceptar</button>
            </div>
        `;
        
        cookieBanner.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: var(--gray-900);
            color: white;
            padding: 1rem;
            z-index: 1000;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
        `;
        
        document.body.appendChild(cookieBanner);
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'true');
    const banner = document.querySelector('.cookie-banner');
    if (banner) {
        banner.style.transform = 'translateY(100%)';
        setTimeout(() => banner.remove(), 300);
    }
}

// Inicializar funcionalidades adicionales
document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
    initParallax();
    initCardEffects();
    initTextAnimations();
    initCookieConsent();
    
    // Formatear números de teléfono
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', () => formatPhoneNumber(input));
    });
});

// Función para scroll suave a secciones
function scrollToSection(sectionId) {
  const targetSection = document.querySelector(sectionId);
  if (targetSection) {
    const offsetTop = targetSection.offsetTop - 80; // Ajustar por el header fijo
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
}

// Exportar funciones para uso global
window.showNotification = showNotification;
window.acceptCookies = acceptCookies;
window.scrollToSection = scrollToSection;