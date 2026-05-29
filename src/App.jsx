import React, { useState, useEffect } from 'react';
import { 
  Car, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Award, 
  Phone, 
  MessageSquare, 
  Users, 
  Briefcase, 
  Calendar, 
  Check, 
  ChevronDown, 
  Menu, 
  X, 
  ArrowUp,
  Mail,
  Navigation
} from 'lucide-react';
import './App.css';

// Fleet vehicles data
const vehicles = [
  {
    id: 'logan',
    name: 'Renault Logan',
    category: 'Económico & Confiable',
    desc: 'Ideal para traslados cotidianos dentro de la ciudad y viajes rápidos. Ofrece una excelente relación precio-calidad con una cabina espaciosa y un andar sumamente suave.',
    specs: { passengers: '4 Pasajeros', luggage: '2 Maletas', rating: 'Confort' },
    image: '/assets/img/team/Logan-Frente.jpeg'
  },
  {
    id: 'cronos-bordo',
    name: 'Fiat Cronos Bordó',
    category: 'Premium Ejecutivo',
    desc: 'Diseñado con elegancia superior. Perfecto para traslados ejecutivos y de negocios a media y larga distancia, brindando un interior refinado y la máxima seguridad en ruta.',
    specs: { passengers: '5 Pasajeros', luggage: '3 Maletas', rating: 'Premium' },
    image: '/assets/img/team/Cronos-Bordo-Izq.jpeg'
  },
  {
    id: 'cronos-blanco',
    name: 'Fiat Cronos Blanco',
    category: 'Eventos & Bodas',
    desc: 'Nuestra opción estelar para eventos de alta gala, ceremonias y recepciones. Aporta distinción visual, interior climatizado de última generación y choferes con vestimenta formal.',
    specs: { passengers: '5 Pasajeros', luggage: '3 Maletas', rating: 'Lujo' },
    image: '/assets/img/team/Cronos-Blanco-Izq.jpeg'
  },
  {
    id: 'ejecutivo',
    name: 'Vehículo Ejecutivo VIP',
    category: 'Corporativo Premium',
    desc: 'Exclusividad y privacidad absoluta. Autos de alta gama preparados para ejecutivos exigentes que requieren confort excepcional y traslados sin interrupciones en viajes interurbanos.',
    specs: { passengers: '4 Pasajeros', luggage: '4 Maletas', rating: 'VIP' },
    image: '/assets/img/team/istockphoto-157725793-612x612.jpg'
  },
  {
    id: 'grupal',
    name: 'Transporte Grupal',
    category: 'Miniván / Eventos',
    desc: 'La solución óptima para delegaciones, grupos corporativos, traslados familiares al aeropuerto o viajes turísticos coordinados, con amplio espacio interior.',
    specs: { passengers: '8+ Pasajeros', luggage: '6+ Maletas', rating: 'Familiar' },
    image: '/assets/img/team/istockphoto-185302122-612x612.jpg'
  },
  {
    id: 'limusina',
    name: 'Servicio VIP de Limusina',
    category: 'Máxima Distinción',
    desc: 'El pináculo de la elegancia y la distinción de clase mundial. Ideal para aniversarios, bodas sofisticadas y traslados de personalidades distinguidas con un servicio a bordo excepcional.',
    specs: { passengers: '6 Pasajeros', luggage: '4 Maletas', rating: 'Exclusivo' },
    image: '/assets/img/team/istockphoto-502292176-612x612.jpg'
  }
];

const getFixtureUrl = () => {
  if (import.meta.env.VITE_FIXTURE_URL) {
    return import.meta.env.VITE_FIXTURE_URL;
  }
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
      return 'http://localhost:3000';
    }
  }
  return 'https://brunoremisesweb-mdnb.vercel.app/';
};

function App() {
  const [activeSection, setActiveSection] = useState('inicio');
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCar, setActiveCar] = useState(vehicles[0]);
  const [openFaq, setOpenFaq] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showFixtureBanner, setShowFixtureBanner] = useState(() => {
    return localStorage.getItem('hideFixtureBanner') !== 'true';
  });
  
  // Reservation form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'ejecutivo',
    date: '',
    time: '',
    origin: '',
    destination: '',
    message: ''
  });

  // Track scrolling to update navbar styling & active section
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavbarScrolled(true);
      } else {
        setNavbarScrolled(false);
      }

      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      // Simple active section highlights
      const sections = ['inicio', 'nosotros', 'servicios', 'flota', 'preguntas'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Construct WhatsApp Message
    const serviceLabels = {
      ejecutivo: 'Transporte Ejecutivo',
      corta: 'Corta Distancia',
      aeropuerto: 'Servicio Aeropuerto',
      grupal: 'Transporte Grupal',
      corporativo: 'Transporte Corporativo',
      eventos: 'Eventos Especiales'
    };

    const text = `Hola Remises Bruno, me gustaría realizar una reserva:
- *Nombre*: ${formData.name}
- *Teléfono*: ${formData.phone}
- *Servicio*: ${serviceLabels[formData.service] || formData.service}
- *Fecha*: ${formData.date}
- *Hora*: ${formData.time}
- *Origen*: ${formData.origin}
- *Destino*: ${formData.destination}
${formData.message ? `- *Mensaje*: ${formData.message}` : ''}`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/+5492346416730?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
    setShowModal(false);
    
    // Reset form
    setFormData({
      name: '',
      phone: '',
      service: 'ejecutivo',
      date: '',
      time: '',
      origin: '',
      destination: '',
      message: ''
    });
  };

  return (
    <>
      {/* Fixture Top Announcement Banner */}
      {showFixtureBanner && (
        <div className="fixture-top-banner">
          <div className="banner-content">
            <span className="banner-badge">🏆 PRODE MUNDIAL 2026</span>
            <span className="banner-text">
              ¡Sumate al Prode Oficial de <strong>Remises Bruno</strong> y ganá premios!
            </span>
            <a href={getFixtureUrl()} className="banner-cta-link">
              Participar Ahora
            </a>
          </div>
          <button 
            className="banner-close" 
            onClick={() => {
              setShowFixtureBanner(false);
              localStorage.setItem('hideFixtureBanner', 'true');
            }} 
            aria-label="Cerrar banner"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Background radial overlays */}
      <div className="bg-glow-container">
        <div className="bg-glow-radial-1"></div>
        <div className="bg-glow-radial-2"></div>
      </div>

      {/* Header & Navigation */}
      <header className={`navbar-custom ${navbarScrolled ? 'scrolled' : ''} ${showFixtureBanner ? 'has-banner' : ''}`}>
        <a onClick={() => handleNavClick('inicio')} className="logo-container">
          <img src="/assets/img/Logo.jpg" alt="Remises Bruno" className="logo-img" />
          <span className="brand-text gold-text-gradient">REMISES BRUNO</span>
        </a>

        <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <li>
            <a 
              className={`nav-link-item ${activeSection === 'inicio' ? 'active' : ''}`}
              onClick={() => handleNavClick('inicio')}
            >
              Inicio
            </a>
          </li>
          <li>
            <a 
              className={`nav-link-item ${activeSection === 'nosotros' ? 'active' : ''}`}
              onClick={() => handleNavClick('nosotros')}
            >
              Nosotros
            </a>
          </li>
          <li>
            <a 
              className={`nav-link-item ${activeSection === 'servicios' ? 'active' : ''}`}
              onClick={() => handleNavClick('servicios')}
            >
              Servicios
            </a>
          </li>
          <li>
            <a 
              className={`nav-link-item ${activeSection === 'flota' ? 'active' : ''}`}
              onClick={() => handleNavClick('flota')}
            >
              Flota
            </a>
          </li>
          <li>
            <a 
              className={`nav-link-item ${activeSection === 'preguntas' ? 'active' : ''}`}
              onClick={() => handleNavClick('preguntas')}
            >
              Preguntas
            </a>
          </li>
          <li>
            <a 
              className="nav-link-item highlight-fixture"
              href={getFixtureUrl()}
            >
              🏆 Fixture 2026
            </a>
          </li>
          <li>
            <button className="btn-gold" style={{ padding: '8px 20px', fontSize: '14px' }} onClick={() => setShowModal(true)}>
              Reservar
            </button>
          </li>
        </ul>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="hero-section">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="hero-tag">
              <Award size={14} /> 25 años de servicio premium
            </div>
            
            {/* World Cup 2026 Promo Card */}
            <div className="hero-fixture-card">
              <span className="fixture-trophy">🏆</span>
              <div className="hero-fixture-card-body">
                <h4>Prode Mundial 2026</h4>
                <p>¡Llevate premios increíbles!</p>
              </div>
              <a href={getFixtureUrl()} className="btn-sm-gold">
                Jugar Gratis
              </a>
            </div>

            <h1 className="hero-title">
              Viajes Premium con la <span className="gold-text-gradient">MÁXIMA</span> distinción y confort.
            </h1>
            <p className="hero-description">
              Experimentá un traslado seguro, puntual y de primer nivel en Chivilcoy y todo el país. Flota moderna con choferes profesionales a tu entera disposición.
            </p>
            <div className="hero-cta">
              <button className="btn-gold" onClick={() => setShowModal(true)}>
                <Calendar size={18} /> Reservar Viaje
              </button>
              <a 
                href="https://wa.me/+5492346416730?text=Hola,%20necesito%20un%20remis" 
                target="_blank" 
                rel="noreferrer"
                className="btn-silver"
              >
                <MessageSquare size={18} /> WhatsApp Directo
              </a>
            </div>
            
            <div className="hero-stats">
              <div className="stat-card">
                <span className="stat-number gold-text-gradient">25+</span>
                <span className="stat-label">Años de trayectoria</span>
              </div>
              <div className="stat-card">
                <span className="stat-number gold-text-gradient">10k+</span>
                <span className="stat-label">Pasajeros felices</span>
              </div>
              <div className="stat-card">
                <span className="stat-number gold-text-gradient">24/7</span>
                <span className="stat-label">Disponibilidad total</span>
              </div>
            </div>
          </div>
          
          <div className="hero-image-wrapper">
            <div className="hero-circle-backdrop"></div>
            <img 
              src="/assets/img/team/Cronos-Bordo-Der.jpeg" 
              alt="Remises Bruno Luxury Fleet" 
              className="hero-img-main"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="nosotros" className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="section-header">
          <span className="section-tag">Trayectoria y Confianza</span>
          <h2 className="section-title">Tu tranquilidad es nuestro norte</h2>
          <p className="section-subtitle">
            Nos dedicamos a brindar traslados confortables garantizando confidencialidad, puntualidad milimétrica y la mayor seguridad vial en cada trayecto.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-img-container">
            <img 
              src="/assets/img/team/Cronos-bordo-Atras.jpeg" 
              alt="Vehículos de Remises Bruno" 
              className="about-img"
            />
            <div className="experience-badge">
              <span className="experience-number">25</span>
              <span className="experience-label">Años brindando<br />excelencia</span>
            </div>
          </div>

          <div className="about-content">
            <h3 className="about-lead gold-text-gradient">Redefiniendo los estándares de transporte privado en Chivilcoy</h3>
            <p className="about-paragraph">
              Desde hace más de dos décadas, lideramos el transporte de pasajeros ejecutivo y particular. Nuestra filosofía combina una rigurosa mantención de cada unidad, choferes altamente instruidos y una flexibilidad total para amoldarnos a las exigencias de tu agenda empresarial o personal.
            </p>

            <div className="about-features">
              <div className="about-feature-item">
                <div className="about-feature-icon">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="about-feature-title">Seguridad Absoluta</h4>
                  <p className="about-feature-desc">Unidades modernas equipadas con seguros de cobertura integral y sistemas de rastreo satelital.</p>
                </div>
              </div>

              <div className="about-feature-item">
                <div className="about-feature-icon">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="about-feature-title">Puntualidad Absoluta</h4>
                  <p className="about-feature-desc">Sabemos el valor de tu tiempo. Monitoreamos constantemente el tránsito para llegar antes de lo pautado.</p>
                </div>
              </div>

              <div className="about-feature-item">
                <div className="about-feature-icon">
                  <Award size={20} />
                </div>
                <div>
                  <h4 className="about-feature-title">Servicio Premium Homologado</h4>
                  <p className="about-feature-desc">Atención de primera categoría, vehículos sanitizados y conductores profesionales cordiales y respetuosos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="section">
        <div className="section-header">
          <span className="section-tag">Servicios Exclusivos</span>
          <h2 className="section-title">Soluciones de traslado a tu medida</h2>
          <p className="section-subtitle">
            Ofrecemos diversas alternativas de transporte de pasajeros diseñadas meticulosamente para cubrir cada una de tus necesidades específicas.
          </p>
        </div>

        <div className="services-grid">
          {/* Card 1 */}
          <div className="service-card glass">
            <div className="service-icon-wrapper">
              <Car size={24} />
            </div>
            <h3 className="service-card-title">Transporte Ejecutivo</h3>
            <p className="service-card-desc">
              Vehículos distinguidos de alta gama ideales para ejecutivos de empresas, directivos y firmas corporativas que exigen discreción.
            </p>
            <ul className="service-card-features">
              <li className="service-card-feature-item"><Check size={14} /> Vehículos limpios y sanitizados</li>
              <li className="service-card-feature-item"><Check size={14} /> Choferes profesionales bilingües opcionales</li>
              <li className="service-card-feature-item"><Check size={14} /> Atención prioritaria 24 horas</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="service-card glass">
            <div className="service-icon-wrapper">
              <MapPin size={24} />
            </div>
            <h3 className="service-card-title">Media y Larga Distancia</h3>
            <p className="service-card-desc">
              Viajes confortables hacia cualquier destino del país con tarifas transparentes y cerradas. El confort de tu hogar sobre ruedas.
            </p>
            <ul className="service-card-features">
              <li className="service-card-feature-item"><Check size={14} /> Aire acondicionado y calefacción regulable</li>
              <li className="service-card-feature-item"><Check size={14} /> Paradas programadas a gusto del pasajero</li>
              <li className="service-card-feature-item"><Check size={14} /> Conductores experimentados en rutas nacionales</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="service-card glass">
            <div className="service-icon-wrapper">
              <Clock size={24} />
            </div>
            <h3 className="service-card-title">Servicios al Aeropuerto</h3>
            <p className="service-card-desc">
              Partidas y arribos coordinados a aeropuertos (Ezeiza, Aeroparque). Monitoreamos tus vuelos para estar listos ante cualquier cambio.
            </p>
            <ul className="service-card-features">
              <li className="service-card-feature-item"><Check size={14} /> Recepción con cartel nominativo en arribos</li>
              <li className="service-card-feature-item"><Check size={14} /> Amplia capacidad para equipaje voluminoso</li>
              <li className="service-card-feature-item"><Check size={14} /> Espera garantizada sin cargos extra por retraso</li>
            </ul>
          </div>

          {/* Card 4 */}
          <div className="service-card glass">
            <div className="service-icon-wrapper">
              <Users size={24} />
            </div>
            <h3 className="service-card-title">Traslados de Eventos</h3>
            <p className="service-card-desc">
              Logística premium para casamientos, cumpleaños de quince, recepciones ejecutivas y eventos sociales corporativos de gran escala.
            </p>
            <ul className="service-card-features">
              <li className="service-card-feature-item"><Check size={14} /> Coordinación logística integral del evento</li>
              <li className="service-card-feature-item"><Check size={14} /> Vehículos engalanados de etiqueta</li>
              <li className="service-card-feature-item"><Check size={14} /> Flexibilidad horaria de fin de fiesta</li>
            </ul>
          </div>

          {/* Card 6 */}
          <div className="service-card glass">
            <div className="service-icon-wrapper">
              <Navigation size={24} />
            </div>
            <h3 className="service-card-title">Paquetería y Trámites VIP</h3>
            <p className="service-card-desc">
              Envío rápido y seguro de documentación confidencial, mercadería de alto valor o trámites bancarios urgentes interurbanos.
            </p>
            <ul className="service-card-features">
              <li className="service-card-feature-item"><Check size={14} /> Entrega en mano con acuse de recibo firmado</li>
              <li className="service-card-feature-item"><Check size={14} /> Cadetería ejecutiva sumamente reservada</li>
              <li className="service-card-feature-item"><Check size={14} /> Monitoreo y reporte en tiempo real de entrega</li>
            </ul>
          </div>
        </div>

        {/* Dynamic CTA Banner */}
        <div className="cta-banner glass">
          <div className="cta-banner-glow"></div>
          <h3 className="cta-title">¿Tenés un requerimiento especial?</h3>
          <p className="cta-desc">
            Organizamos planes de traslados a medida para empresas, viajes de larga estadía, eventos complejos o traslados ejecutivos recurrentes. Contactanos y armamos tu cotización en el acto.
          </p>
          <div className="cta-buttons">
            <button className="btn-gold" onClick={() => setShowModal(true)}>
              <Calendar size={18} /> Cotizar a Medida
            </button>
            <a href="tel:+5492346416730" className="btn-silver">
              <Phone size={18} /> Llamar ahora
            </a>
          </div>
        </div>
      </section>

      {/* Fleet Showcase Section */}
      <section id="flota" className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="section-header">
          <span className="section-tag">Nuestra Flota</span>
          <h2 className="section-title">Flota distinguida de primer nivel</h2>
          <p className="section-subtitle">
            Nuestros vehículos reciben mantenciones mecánicas estrictas semanales y rigurosos procesos de sanitizado profundo para garantizar tu absoluto bienestar.
          </p>
        </div>

        {/* Switcher Tabs */}
        <div className="fleet-tabs">
          {vehicles.map(car => (
            <button 
              key={car.id}
              className={`fleet-tab-btn ${activeCar.id === car.id ? 'active' : ''}`}
              onClick={() => setActiveCar(car)}
            >
              {car.name}
            </button>
          ))}
        </div>

        {/* Display Active Car */}
        <div className="fleet-showcase glass" style={{ padding: '40px', borderRadius: '24px' }}>
          <div className="fleet-media-wrapper">
            <img src={activeCar.image} alt={activeCar.name} className="fleet-img" />
          </div>

          <div className="fleet-info">
            <span className="fleet-category">{activeCar.category}</span>
            <h3 className="fleet-name">{activeCar.name}</h3>
            <p className="fleet-desc">{activeCar.desc}</p>
            
            <div className="fleet-specs">
              <div className="spec-item">
                <div className="spec-val-wrapper">
                  <Users size={18} />
                  <span>{activeCar.specs.passengers.split(' ')[0]}</span>
                </div>
                <span className="spec-label">Pasajeros</span>
              </div>

              <div className="spec-item">
                <div className="spec-val-wrapper">
                  <Briefcase size={18} />
                  <span>{activeCar.specs.luggage.split(' ')[0]}</span>
                </div>
                <span className="spec-label">Equipaje</span>
              </div>

              <div className="spec-item">
                <div className="spec-val-wrapper">
                  <Award size={18} />
                  <span style={{ fontSize: '16px' }}>{activeCar.specs.rating}</span>
                </div>
                <span className="spec-label">Categoría</span>
              </div>
            </div>

            <button className="btn-gold" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowModal(true)}>
              Reservar {activeCar.name}
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="preguntas" className="section">
        <div className="section-header">
          <span className="section-tag">Dudas Frecuentes</span>
          <h2 className="section-title">Preguntas Frecuentes</h2>
          <p className="section-subtitle">
            Compilamos las preguntas más recurrentes para brindarte claridad sobre nuestras modalidades de servicio, reservas y facturación.
          </p>
        </div>

        <div className="faq-grid">
          {[
            {
              q: '¿Cómo puedo reservar un viaje con Remises Bruno?',
              a: 'Podés agendar tu reserva haciendo clic en el botón de reservar y completando el formulario interactivo para enviar los detalles por WhatsApp, llamando por teléfono al 2346-433000 / 427637 o enviándonos un mensaje directo de WhatsApp. Sugerimos agendar traslados de media y larga distancia con un mínimo de 12 horas de anticipación.'
            },
            {
              q: '¿Con qué medidas de seguridad y sanidad cuentan?',
              a: 'Todos los coches de nuestra flota cuentan con habilitación municipal correspondiente, revisiones técnicas periódicas (VTV) vigentes y pólizas de seguro con cobertura completa al pasajero transportado. Adicionalmente, higienizamos y sanitizamos cada unidad luego de finalizar cada servicio.'
            },
            {
              q: '¿Qué formas de pago aceptan?',
              a: 'Aceptamos efectivo, transferencias bancarias directas, pagos mediante Mercado Pago (código QR o link de pago) y tarjetas de débito/crédito. Para clientes corporativos, disponemos de planes de facturación mensual integrada en cuenta corriente con facturas tipo A o B.'
            },
            {
              q: '¿Realizan traslados a aeropuertos en horarios nocturnos?',
              a: 'Sí, funcionamos las 24 horas del día, los 7 días de la semana, los 365 días del año. Los traslados de madrugada o madrugada programados cuentan con unidades exclusivas asignadas previamente para garantizar puntualidad sin fisuras.'
            },
            {
              q: '¿Qué sucede si mi vuelo al aeropuerto se retrasa?',
              a: 'No tenés de qué preocuparte. Nuestro equipo de atención monitorea constantemente el estado de tu vuelo con el número que nos brindás en la reserva. En caso de demoras, reprogramamos automáticamente la hora de recogida de manera interna sin costos adicionales para vos.'
            }
          ].map((faq, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? 'active' : ''}`}>
              <button className="faq-question-btn" onClick={() => toggleFaq(i)}>
                <span>{faq.q}</span>
                <ChevronDown size={18} className="faq-icon-chevron" />
              </button>
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-info">
            <a onClick={() => handleNavClick('inicio')} className="footer-logo">
              <img src="/assets/img/Logo.jpg" alt="Remises Bruno" className="footer-logo-img" />
              <span className="footer-brand gold-text-gradient">REMISES BRUNO</span>
            </a>
            <p className="footer-desc">
              Más de 25 años de confiabilidad e innovación en el transporte privado de pasajeros. Rediseñado con tecnología de punta y estética distinguida de lujo.
            </p>
            <div className="social-links">
              <a href="https://www.facebook.com/remises.bruno" target="_blank" rel="noreferrer" className="social-link-btn" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="https://www.instagram.com/brunoremises/" target="_blank" rel="noreferrer" className="social-link-btn" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="mailto:remisesbrunochivilcoy@gmail.com" className="social-link-btn" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div className="footer-nav">
            <h4 className="footer-title gold-text-gradient">Navegación</h4>
            <ul className="footer-links-list">
              <li><a onClick={() => handleNavClick('inicio')} className="footer-link-item">Inicio</a></li>
              <li><a onClick={() => handleNavClick('nosotros')} className="footer-link-item">Nosotros</a></li>
              <li><a onClick={() => handleNavClick('servicios')} className="footer-link-item">Servicios</a></li>
              <li><a onClick={() => handleNavClick('flota')} className="footer-link-item">Nuestra Flota</a></li>
              <li><a onClick={() => handleNavClick('preguntas')} className="footer-link-item">Preguntas</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h4 className="footer-title gold-text-gradient">Contacto VIP</h4>
            <div className="footer-contact-items">
              <div className="footer-contact-item">
                <MapPin size={18} />
                <span className="footer-contact-text">
                  Av. Sarmiento 271, Chivilcoy,<br />Provincia de Buenos Aires, CP 6620
                </span>
              </div>
              <div className="footer-contact-item">
                <Phone size={18} />
                <span className="footer-contact-text">
                  <a href="tel:+542346433000" style={{ color: 'inherit', textDecoration: 'none' }}>2346 - 433000</a><br />
                  <a href="tel:+542346427637" style={{ color: 'inherit', textDecoration: 'none' }}>2346 - 427637</a>
                </span>
              </div>
              <div className="footer-contact-item">
                <MessageSquare size={18} />
                <span className="footer-contact-text">
                  WhatsApp: <a href="https://wa.me/+5492346416730" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', fontWeight: '600' }}>2346 - 416730</a>
                </span>
              </div>
              <div className="footer-contact-item">
                <Mail size={18} />
                <span className="footer-contact-text">
                  <a href="mailto:remisesbrunochivilcoy@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>remisesbrunochivilcoy@gmail.com</a>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            <span>&copy; {new Date().getFullYear()} Remises Bruno. Todos los derechos reservados.</span>
          </div>
          <div className="footer-copy">
            <span>
              Desarrollado por{' '}
              <a 
                href="https://rzcore.dev" 
                target="_blank" 
                rel="noreferrer"
                className="footer-author-link"
              >
                rzcore
              </a>
            </span>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button 
          className="back-to-top-btn" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp size={22} />
        </button>
      )}

      {/* Custom Reservation Modal Form */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content-custom glass" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowModal(false)}>
              <X size={18} />
            </button>

            <div className="modal-header-custom">
              <span className="section-tag" style={{ fontSize: '11px', marginBottom: '8px' }}>Solicitud de Cotización y Reserva</span>
              <h3 className="modal-title-custom gold-text-gradient">Planificá tu Viaje Premium</h3>
              <p className="modal-subtitle-custom">Completá los datos y nuestro despachador VIP se comunicará con vos al instante.</p>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Nombre Completo</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    placeholder="Juan Pérez" 
                    className="form-input"
                    value={formData.name}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Teléfono de Contacto</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    required 
                    placeholder="2346 123456" 
                    className="form-input"
                    value={formData.phone}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="service" className="form-label">Tipo de Servicio Requerido</label>
                <select 
                  id="service" 
                  className="form-select"
                  value={formData.service}
                  onChange={handleFormChange}
                >
                  <option value="ejecutivo">Transporte Ejecutivo Premium</option>
                  <option value="corta">Traslado Corta Distancia</option>
                  <option value="aeropuerto">Servicio al Aeropuerto (Arribo/Partida)</option>
                  <option value="grupal">Transporte Grupal / Miniván</option>
                  <option value="corporativo">Cuenta Corriente Corporativa</option>
                  <option value="eventos">Eventos Especiales (Bodas, Gala)</option>
                </select>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="date" className="form-label">Fecha del Traslado</label>
                  <input 
                    type="date" 
                    id="date" 
                    required 
                    className="form-input"
                    value={formData.date}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="time" className="form-label">Hora Estimada</label>
                  <input 
                    type="time" 
                    id="time" 
                    required 
                    className="form-input"
                    value={formData.time}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label htmlFor="origin" className="form-label">Dirección de Origen</label>
                  <input 
                    type="text" 
                    id="origin" 
                    required 
                    placeholder="Av. Sarmiento 271, Chivilcoy" 
                    className="form-input"
                    value={formData.origin}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="destination" className="form-label">Dirección de Destino</label>
                  <input 
                    type="text" 
                    id="destination" 
                    required 
                    placeholder="Aeropuerto Ezeiza, Buenos Aires" 
                    className="form-input"
                    value={formData.destination}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Notas Adicionales (Opcional)</label>
                <textarea 
                  id="message" 
                  rows="3" 
                  placeholder="Detalles del equipaje, paradas intermedias, etc." 
                  className="form-textarea"
                  value={formData.message}
                  onChange={handleFormChange}
                ></textarea>
              </div>

              <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', padding: '16px' }}>
                <MessageSquare size={18} /> Confirmar Reserva vía WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
