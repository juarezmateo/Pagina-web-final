// Navegación responsive
const navToggle = document.querySelector('.nav-toggle');
const siteNav   = document.getElementById('site-nav');

navToggle?.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// Smooth scroll para anclas internas
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth'});
      siteNav.classList.remove('open');
    }
  });
});

// Utilidad para enviar formularios via mailto con pre-relleno
function mailtoFromForm(form, toEmail, subjectPrefix){
  const data = new FormData(form);
  const name = data.get('name') || '—';
  const email = data.get('email') || '—';
  const subject = (data.get('subject') || `${subjectPrefix} de ${name}`).toString();
  const message = (data.get('message') || '').toString();

  const body = [
    `Nombre: ${name}`,
    `Email: ${email}`,
    '',
    'Mensaje:',
    message
  ].join('\n');

  const mailto = `mailto:${encodeURIComponent(toEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}

// Contacto
const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  mailtoFromForm(contactForm, 'contacto.smarthome@example.com', 'Consulta');
});

// Adquirir
const adquireForm = document.getElementById('adquire-form');
adquireForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  mailtoFromForm(adquireForm, 'ventas.smarthome@example.com', 'Solicitud de información');
});

document.addEventListener('DOMContentLoaded', () => {
  // ===== Testimonios dinámicos =====
  const slider = document.querySelector('.t-slider');
  if (slider){ // por si la sección no está en alguna página
    const track = slider.querySelector('.t-track');
    const cards = Array.from(slider.querySelectorAll('.t-card'));
    const btnPrev = slider.querySelector('.t-prev');
    const btnNext = slider.querySelector('.t-next');
    const dots = Array.from(slider.querySelectorAll('.t-dot'));

    let index = 0;
    const total = cards.length;
    let autoTimer = null;

    function goTo(i){
      index = (i + total) % total;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      dots[index].classList.add('active');
    }

    function next(){ goTo(index + 1); }
    function prev(){ goTo(index - 1); }

    btnNext.addEventListener('click', next);
    btnPrev.addEventListener('click', prev);
    dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

    // Auto-play
    function startAuto(){ autoTimer = setInterval(next, 6000); }
    function stopAuto(){ clearInterval(autoTimer); }
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    // Swipe táctil
    let startX = 0, dx = 0;
    slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; dx = 0; stopAuto(); }, {passive:true});
    slider.addEventListener('touchmove', (e) => { dx = e.touches[0].clientX - startX; }, {passive:true});
    slider.addEventListener('touchend', () => {
      if (dx > 40) prev();
      else if (dx < -40) next();
      startAuto();
    });

    // Inicial
    goTo(0);
    startAuto();
  }
});

// ===== Estadísticas (Count-Up) =====
const statNumbers = document.querySelectorAll('.stat-number');

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      const el = entry.target;
      const target = +el.dataset.target;
      let current = 0;
      const step = Math.ceil(target / 60); // duración ~1s

      const counter = setInterval(() => {
        current += step;
        if (current >= target){
          el.textContent = target;
          clearInterval(counter);
        } else {
          el.textContent = current;
        }
      }, 16);

      obs.unobserve(el);
    }
  });
}, {threshold: 0.6});

statNumbers.forEach(num => observer.observe(num));

// ===== Scroll Reveal Animations =====
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.15});

revealEls.forEach(el => revealObserver.observe(el));

// ===== Scroll Progress Bar =====
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (scrollTop / docHeight) * 100;
  progressBar.style.width = progress + '%';
});

// ====== Toggle de idioma con recarga (ES por defecto) ======
(function () {
  const LANG_KEY = "lang";               // 'es' | 'en'
  const btn = document.getElementById("lang-toggle");

  // Diccionario de textos por clave
  const dict = {
    es: {
      "nav.home": "Inicio",
      "nav.services": "Servicios",
      "nav.about": "¿Quiénes somos?",
      "nav.demo": "Panel de Control Demo",
      "nav.faq": "FAQ",
      "nav.contact": "Contacto",
      "nav.buy": "Adquirir",

      "hero.title": "El futuro de tu hogar, hoy",
      "hero.lead": "Un Sistema inteligente para automatizar tareas simples: luces, temperatura, riego y seguridad — todo desde una aplicación.",
      "hero.cta.services": "Ver servicios",
      "hero.cta.contact": "Hablar con nosotros",
      "chip.project": "Proyecto: ",
      "chip.company": "Empresa: ",
      "chip.duration": "Duración: ",
      "chip.start": "Inicio: ",

      "stats.title": "Estadísticas rápidas",
      "stats.lead": "Impacto del Smart Home System hasta ahora",
      "stats.uact": "Usuarios activos",
      "stats.sens": "Sensores instalados",
      "stats.save": "% de ahorro energético",
      "stats.pilot": "Proyectos piloto",

      "about.title": "¿Quiénes somos?",
      "about.lead": "Somos Smart Company, un equipo estudiantil que desarrolla Smart Home System, una solución tecnológica, moderna y minimalista para automatizar hogares.",
      "about.history": "Historia",
      "about.mission": "Misión",
      "about.vision": "Visión",
      "about.values": "Valores",

      "services.title": "Servicios",
      "services.lead": "Subsistemas del Smart Home System incluidos en la solución informativa del sitio.",
      "services.lights.title": "Control de luces",
      "services.lights.lead": "Por condiciones o por tiempo. Programá escenas y horarios para cada ambiente.",
      "services.temp.title": "Temperatura",
      "services.temp.lead": "Regulación según clima exterior e interior. Ahorro energético automático.",
      "services.irrig.title": "Riego de plantas",
      "services.irrig.lead": "Configurable por tipo de planta y humedad del suelo. Recordatorios y monitoreo.",
      "services.sec.title": "Seguridad",
      "services.sec.lead": "Registro de personas o mascotas con alertas locales. Privacidad como pilar.",
      "services.buy": "Adquirir producto",
      "services.note": "El presente sitio es informativo. El control del hogar será mediante una aplicación dedicada.",

      "testi.title": "Opiniones",
      "testi.lead": "Qué dicen sobre nosotros.",

      "news.title": "Noticias y actualizaciones",
      "news.lead": "Avances del proyecto y nuevas funciones.",

      "faq.title": "FAQ",
      "faq.lead": "Preguntas frecuentes.",

      "adq.title": "Adquirir producto",
      "adq.lead": "Recibí más información detallada sobre el Smart Home System.",
      "adq.form.note": "Completá tus datos y te contactamos.",
      "adq.form.name": "Nombre y apellido",
      "adq.form.email": "Correo electrónico",
      "adq.form.msg": "Mensaje",
      "adq.form.btn": "Solicitar info",
      "adq.form.disc": "Al enviar, se abrirá tu cliente de correo con el resumen.",

      "contact.title": "Contacto",
      "contact.lead": "Escribinos para consultas o soporte.",
      "contact.form.note": "Completar Formulario",
      "contact.form.name": "Nombre",
      "contact.form.email": "Correo",
      "contact.form.subj": "Asunto",
      "contact.form.msg": "Mensaje",
      "contact.form.btn": "Enviar",
      "contact.form.hours": "Atención: Lun–Vie 9–18 h (ARG)",

    "about.title": "¿Quiénes somos?",
    "about.lead": "Somos <strong>Smart Company</strong>, un equipo estudiantil que desarrolla <em>Smart Home System</em>, una solución tecnológica, moderna y minimalista para automatizar hogares.",
    "about.history": "Historia",
    "about.history.text": "Nacimos como proyecto educativo con el objetivo de crear un sistema accesible y predecible para cualquier persona con hogar.",
    "about.mission": "Misión",
    "about.vision": "Visión",
    "about.values": "Valores",

    // ... (resto)
    "footer.copy": "© 2025 Smart Company. Todos los derechos reservados.",  // ← OJO: coma aquí

    "ui.totop": "Volver arriba",
    "contact.placeholder.name": "Tu nombre",
    "contact.placeholder.email": "tu@email.com",
    "contact.placeholder.msg": "Escribí tu mensaje..."


     
    },
    en: {

"news.title": "News and updates",
"news.lead": "Project progress and new features.",

"timeline.item1.date": "May 18, 2025",
"timeline.item1.title": "Project kickoff",
"timeline.item1.text": "The founding team is formed and the first objectives of the Smart Home System are defined. Specialists in home automation, digital security, and user experience join to build the foundation of the ecosystem.",

"timeline.item2.date": "Q1 2025",
"timeline.item2.title": "Subsystem design",
"timeline.item2.text": "Technical specifications for the main modules are created: smart lighting, temperature control, automated irrigation, and intelligent security with motion sensors. Usability tests with pilot users improve the design.",

"timeline.item3.date": "Q2 2025",
"timeline.item3.title": "Website launch",
"timeline.item3.text": "The first version of the website is published with institutional sections, service catalog, and contact form — marking the start of our digital presence.",

"timeline.item4.date": "Q3 2025",
"timeline.item4.title": "Supplier integration",
"timeline.item4.text": "Strategic agreements are established with hardware manufacturers to ensure compatibility with standard sensors and devices, allowing users to connect their existing equipment easily.",

"timeline.item5.date": "Q4 2025",
"timeline.item5.title": "Mobile App 1.0 (Coming soon)",
"timeline.item5.text": "Development of the first version of the official app begins, allowing users to control lights, cameras, climate, and routines such as 'night mode' or 'vacation mode'.",

"faq.title": "FAQ",
"faq.lead": "Frequently asked questions.",

"faq.q1.q": "Does this website control my house?",
"faq.q1.a": "No. This website serves as a marketing and informational platform. Real control of the devices will be managed through an exclusive app.",

"faq.q2.q": "Which devices are compatible?",
"faq.q2.a": "The system is designed to work with standard hardware, including temperature sensors, air conditioners, irrigation systems, and smart cameras — prioritizing interoperability.",

"faq.q3.q": "How do you protect my data?",
"faq.q3.a": "Security is a priority. The system applies privacy by default, end-to-end encryption, and automatic updates to prevent vulnerabilities.",

"faq.q4.q": "What happens if the Internet goes down?",
"faq.q4.a": "Basic local functions, such as turning lights on/off and controlling locks, remain available. Advanced remote control requires an Internet connection.",

"faq.q5.q": "Will there be multilingual support?",
"faq.q5.a": "Yes. It will initially be available in Spanish, English, and Portuguese, with plans to add more languages based on demand.",

"faq.q6.q": "Can I expand my system in the future?",
"faq.q6.a": "Of course. Smart Home System is modular and scalable — you can start with lights and security, and later add climate, irrigation, and more features.",

"adq.includes.title": "Includes",
"adq.includes.1": "Installation advice",
"adq.includes.2": "Starter sensor package",
"adq.includes.3": "Dedicated mobile application",
"adq.includes.4": "Academic project warranty",


      "nav.home": "Home",
      "nav.services": "Services",
      "nav.about": "About",
      "nav.demo": "Control Panel Demo",
      "nav.faq": "FAQ",
      "nav.contact": "Contact",
      "nav.buy": "Get it",

      "hero.title": "The future of your home, today",
      "hero.lead": "An intelligent system to automate simple tasks: lights, temperature, irrigation and security — all from one app.",
      "hero.cta.services": "See services",
      "hero.cta.contact": "Contact us",
      "chip.project": "Project: ",
      "chip.company": "Company: ",
      "chip.duration": "Duration: ",
      "chip.start": "Start: ",

      "stats.title": "Quick stats",
      "stats.lead": "Smart Home System impact so far",
      "stats.uact": "Active users",
      "stats.sens": "Sensors installed",
      "stats.save": "% energy savings",
      "stats.pilot": "Pilot projects",


      "testi.1.name": "Ana García",
"testi.1.text": "It’s easy to use and helped me save on electricity.",

"testi.2.name": "Juan Pérez",
"testi.2.text": "Automating irrigation has changed my life.",

"testi.3.name": "María López",
"testi.3.text": "The app is intuitive — even my parents use it!",




      "about.title": "About us",
"about.lead": "We are Smart Company, a student team that develops Smart Home System — a modern and minimalist solution to automate homes.",
"about.history": "History",
"about.history.text": "We started as an educational project with the goal of creating an accessible and reliable system for any household.",
"about.mission": "Mission",
"about.mission.text": "Make home activities easier to save time and let users focus on what matters.",
"about.vision": "Vision",
"about.vision.text": "Become a school reference in simple, reliable, and scalable smart-home solutions.",
"about.values": "Values",
"about.values.1": "Usability and accessibility",
"about.values.2": "Responsibility in delivery",
"about.values.3": "Transparency and continuous learning",
"about.values.4": "Security and privacy",
"about.values": "Values",
"about.history.text": "We started as an educational project with the goal of creating an accessible and reliable system for any household.",



      "services.title": "Services",
      "services.lead": "Subsystems included in this site’s informational scope.",
      "services.lights.title": "Lights control",
      "services.lights.lead": "By conditions or schedule. Program scenes for every room.",
      "services.temp.title": "Temperature",
      "services.temp.lead": "Regulates by indoor/outdoor weather. Automatic energy saving.",
      "services.irrig.title": "Plant irrigation",
      "services.irrig.lead": "Configurable by plant type and soil moisture. Reminders & monitoring.",
      "services.sec.title": "Security",
      "services.sec.lead": "People/pet logging with local alerts. Privacy first.",
      "services.buy": "Get product",
      "services.note": "This site is informational. Home control will use a dedicated app.",

      "testi.title": "Testimonials",
      "testi.lead": "What people say about us.",

      "news.title": "News & updates",
      "news.lead": "Project progress and new features.",

      "faq.title": "FAQ",
      "faq.lead": "Frequently asked questions.",

      "adq.title": "Get the product",
      "adq.lead": "Receive more detailed information about Smart Home System.",
      "adq.form.note": "Fill in your details and we'll contact you.",
      "adq.form.name": "Full name",
      "adq.form.email": "Email address",
      "adq.form.msg": "Message",
      "adq.form.btn": "Request info",
      "adq.form.disc": "When sending, your email client will open with a summary.",

      "contact.title": "Contact",
      "contact.lead": "Write to us for inquiries or support.",
      "contact.form.note": "Complete the form",
      "contact.form.name": "Name",
      "contact.form.email": "Email",
      "contact.form.subj": "Subject",
      "contact.form.msg": "Message",
      "contact.form.btn": "Send",
      "contact.form.hours": "Support: Mon–Fri 9–18 (ARG)",


// --- ABOUT ---
"about.history.text": "We started as an educational project with the goal of creating an accessible and reliable system for any household.",

// --- NEWS / TIMELINE ---
"news.title": "News & updates",
"news.lead": "Project progress and new features.",

"timeline.item1.date": "May 18, 2025",
"timeline.item1.title": "Project kickoff",
"timeline.item1.text": "The founding team is formed and the first objectives of the Smart Home System are defined. Specialists in home automation, digital security, and user experience join to build the foundation of the ecosystem.",

"timeline.item2.date": "Q1 2025",
"timeline.item2.title": "Subsystem design",
"timeline.item2.text": "Technical specifications for the main modules are created: smart lighting, temperature control, automated irrigation, and intelligent security with motion sensors. Usability tests with pilot users improve the design.",

"timeline.item2.list1": "Smart lighting control with automatic schedules.",
"timeline.item2.list2": "Climate management based on ambient temperature.",
"timeline.item2.list3": "Automated irrigation adaptable to humidity and weather.",
"timeline.item2.list4": "Smart security with cameras and motion sensors.",
"timeline.item2.list5": "Usability tests conducted with pilot users to improve experience.",

"timeline.item3.date": "Q2 2025",
"timeline.item3.title": "Website launch",
"timeline.item3.text": "The first version of the website is published with institutional sections, service catalog, and contact form — marking the start of our digital presence.",

"timeline.item4.date": "Q3 2025",
"timeline.item4.title": "Supplier integration",
"timeline.item4.text": "Strategic agreements are established with hardware manufacturers to ensure compatibility with standard sensors and devices, allowing users to connect their existing equipment easily.",

"timeline.item5.date": "Q4 2025",
"timeline.item5.title": "Mobile App 1.0 (Coming soon)",
"timeline.item5.text": "Development of the first version of the official app begins, allowing users to control lights, cameras, climate, and routines such as 'night mode' or 'vacation mode'.",

// --- FAQ ---
"faq.title": "Frequently asked questions.",
"faq.lead": "Common queries and their answers.",

"faq.q1.q": "Does this website control my house?",
"faq.q1.a": "No. This website serves as a marketing and informational platform. Real control of the devices will be managed through an exclusive app.",

"faq.q2.q": "Which devices are compatible?",
"faq.q2.a": "The system is designed to work with standard hardware, including temperature sensors, air conditioners, irrigation systems, and smart cameras — prioritizing interoperability.",
"faq.q2.list1": "Temperature sensors",
"faq.q2.list2": "Air conditioners",
"faq.q2.list3": "Irrigation systems",
"faq.q2.list4": "Smart cameras",
"faq.q2.note": "Interoperability is prioritized so users are not dependent on a single provider.",

"faq.q3.q": "How do you protect my data?",
"faq.q3.a": "Security is a priority. The system applies privacy by default, end-to-end encryption, and automatic updates to prevent vulnerabilities.",
"faq.q3.list1": "Privacy by default: only minimal necessary data is collected.",
"faq.q3.list2": "End-to-end encryption: all communication between devices and the app is protected.",
"faq.q3.list3": "Automatic updates: continuous improvements are applied to prevent vulnerabilities.",

"faq.q4.q": "What happens if the Internet goes down?",
"faq.q4.a": "Basic local functions, such as turning lights on/off and controlling locks, remain available. Advanced remote control requires an Internet connection.",

"faq.q5.q": "Will there be multilingual support?",
"faq.q5.a": "Yes. It will initially be available in Spanish, English, and Portuguese, with plans to add more languages based on demand.",

"faq.q6.q": "Can I expand my system in the future?",
"faq.q6.a": "Of course. Smart Home System is modular and scalable — you can start with lights and security, and later add climate, irrigation, and more features.",
// --- ABOUT / HISTORY ---
"about.history": "History",
"about.history.text": "We were born as an educational project with the goal of creating an accessible and predictable system for any person with a home.",

// --- TIMELINE / SUBSYSTEM DESIGN ---
"timeline.item2.title": "Subsystem design",
"timeline.item2.text": "Technical specifications for the main modules are created: smart lighting, temperature control, automated irrigation, and intelligent security with motion sensors. Usability tests with pilot users improve the design.",

"timeline.item2.list1": "Smart lighting control with automatic schedules.",
"timeline.item2.list2": "Climate management based on ambient temperature.",
"timeline.item2.list3": "Automated irrigation adaptable to humidity and weather.",
"timeline.item2.list4": "Smart security with cameras and motion sensors.",

"about.title": "About us",
    "about.lead": "We are <strong>Smart Company</strong>, a student team building <em>Smart Home System</em>, a modern and minimalist solution to automate homes.",
    "about.history": "History",
    "about.history.text": "We began as an educational project with the goal of creating an accessible and predictable system for anyone with a home.",
    "about.mission": "Mission",
    "about.vision": "Vision",
    "about.values": "Values",
"about.title": "About us",
    "about.lead": "We are <strong>Smart Company</strong>, a student team developing <em>Smart Home System</em>, a modern and minimalist solution to automate homes.",
    "about.history": "History",
    "about.history.text": "We were born as an educational project with the goal of creating an accessible and predictable system for anyone with a home.",
    // ... (resto)
    "footer.copy": "© 2025 Smart Company. All rights reserved.",

    "ui.totop": "Back to top",
    "contact.placeholder.name": "Your name",
    "contact.placeholder.email": "your@email.com",
    "contact.placeholder.msg": "Write your message...",

      "footer.legal.about": "About",
      "footer.legal.services": "Services",
      "footer.legal.faq": "FAQ",
      "footer.legal.contact": "Contact",
      "footer.copy": "© 2025 Smart Company. All rights reserved."


      
    }
  };

  // Mapa de selectores -> claves (solo para los principales)
  const map = [
    // NAV
// ABOUT / HISTORY
['#about h3:nth-of-type(1)', 'about.history'],
['#about p.history-text', 'about.history.text'],

// TIMELINE / SUBSYSTEM DESIGN
['#news .tl-item:nth-child(2) h4', 'timeline.item2.title'],
['#news .tl-item:nth-child(2) p', 'timeline.item2.text'],
['#news .tl-item:nth-child(2) ul li:nth-child(1)', 'timeline.item2.list1'],
['#news .tl-item:nth-child(2) ul li:nth-child(2)', 'timeline.item2.list2'],
['#news .tl-item:nth-child(2) ul li:nth-child(3)', 'timeline.item2.list3'],
['#news .tl-item:nth-child(2) ul li:nth-child(4)', 'timeline.item2.list4'],


['#support details:nth-of-type(2) ul li:nth-child(1)', 'faq.q2.list1'],
['#support details:nth-of-type(2) ul li:nth-child(2)', 'faq.q2.list2'],
['#support details:nth-of-type(2) ul li:nth-child(3)', 'faq.q2.list3'],
['#support details:nth-of-type(2) ul li:nth-child(4)', 'faq.q2.list4'],
['#support details:nth-of-type(2) p:last-of-type', 'faq.q2.note'],

['#support details:nth-of-type(3) ul li:nth-child(1)', 'faq.q3.list1'],
['#support details:nth-of-type(3) ul li:nth-child(2)', 'faq.q3.list2'],
['#support details:nth-of-type(3) ul li:nth-child(3)', 'faq.q3.list3'],



    ['a[data-i18n="nav.home"]', 'nav.home'],
    ['a[data-i18n="nav.services"]', 'nav.services'],
    ['a[data-i18n="nav.about"]', 'nav.about'],
    ['a[data-i18n="nav.demo"]', 'nav.demo'],
    ['a[data-i18n="nav.faq"]', 'nav.faq'],
    ['a[data-i18n="nav.contact"]', 'nav.contact'],
    ['a[data-i18n="nav.buy"]', 'nav.buy'],

    // HERO
    ['#home .hero-text h1', 'hero.title'],
    ['#home .hero-text .lead', 'hero.lead'],
    ['#home .cta .btn.btnEspecial', 'hero.cta.services'],
    ['#home .cta .btn.btn--ghost', 'hero.cta.contact'],
    // Chips: dejamos las negritas tal cual, solo etiquetas
    ['#home .chips li:nth-child(1)', 'chip.project', (el, t) => el.firstChild.nodeValue = t],
    ['#home .chips li:nth-child(2)', 'chip.company', (el, t) => el.firstChild.nodeValue = t],
    ['#home .chips li:nth-child(3)', 'chip.duration', (el, t) => el.firstChild.nodeValue = t],
    ['#home .chips li:nth-child(4)', 'chip.start', (el, t) => el.firstChild.nodeValue = t],

    // STATS
    ['#stats h2', 'stats.title'],
    ['#stats .section-header p', 'stats.lead'],
    ['#stats .stat-card:nth-child(1) .stat-label', 'stats.uact'],
    ['#stats .stat-card:nth-child(2) .stat-label', 'stats.sens'],
    ['#stats .stat-card:nth-child(3) .stat-label', 'stats.save'],
    ['#stats .stat-card:nth-child(4) .stat-label', 'stats.pilot'],

    // ABOUT
    ['#about h2', 'about.title'],
['#about .section-header p', 'about.lead'],
['#about h3:nth-of-type(1)', 'about.history'],
['#about p:nth-of-type(1)', 'about.history.text'],
['#about h3:nth-of-type(2)', 'about.mission'],
['#about p:nth-of-type(2)', 'about.mission.text'],
['#about h3:nth-of-type(3)', 'about.vision'],
['#about p:nth-of-type(3)', 'about.vision.text'],
['#about h3:nth-of-type(4)', 'about.values'],
['#about li:nth-child(1)', 'about.values.1'],
['#about li:nth-child(2)', 'about.values.2'],
['#about li:nth-child(3)', 'about.values.3'],
['#about li:nth-child(4)', 'about.values.4'],
['#about h3:nth-of-type(1)', 'about.history'],
['#about p:nth-of-type(1)', 'about.history.text'],
['#about h3:nth-of-type(4)', 'about.values'],
['#about h3:nth-of-type(1)', 'about.history'],
['#about p:nth-of-type(1)', 'about.history.text'],
['#about h3:nth-of-type(4)', 'about.values'],



    // SERVICES
    ['#services h2', 'services.title'],
    ['#services .section-header p', 'services.lead'],
    ['#services .service-cards article:nth-child(1) h3', 'services.lights.title'],
    ['#services .service-cards article:nth-child(1) p', 'services.lights.lead'],
    ['#services .service-cards article:nth-child(2) h3', 'services.temp.title'],
    ['#services .service-cards article:nth-child(2) p', 'services.temp.lead'],
    ['#services .service-cards article:nth-child(3) h3', 'services.irrig.title'],
    ['#services .service-cards article:nth-child(3) p', 'services.irrig.lead'],
    ['#services .service-cards article:nth-child(4) h3', 'services.sec.title'],
    ['#services .service-cards article:nth-child(4) p', 'services.sec.lead'],
    ['#services .center .btnAdquirir', 'services.buy'],
    ['#services .center .note', 'services.note'],

    // TESTIMONIOS
    ['#testimonios h2', 'testi.title'],
    ['#testimonios .section-header p', 'testi.lead'],
    ['#testimonios .t-card:nth-child(1) .t-name', 'testi.1.name'],
['#testimonios .t-card:nth-child(1) .t-text', 'testi.1.text'],
['#testimonios .t-card:nth-child(2) .t-name', 'testi.2.name'],
['#testimonios .t-card:nth-child(2) .t-text', 'testi.2.text'],
['#testimonios .t-card:nth-child(3) .t-name', 'testi.3.name'],
['#testimonios .t-card:nth-child(3) .t-text', 'testi.3.text'],


    // NEWS
    ['#news h2', 'news.title'],
    ['#news .section-header p', 'news.lead'],

    // FAQ
    ['#support h2', 'faq.title'],
    ['#support .section-header p', 'faq.lead'],

    // ADQUIRIR
    ['#adquirir h2', 'adq.title'],
    ['#adquirir .section-header p', 'adq.lead'],
    ['#adquire-form #adquire-desc', 'adq.form.note'],
    ['#adquire-form label:nth-of-type(1)', 'adq.form.name', (el,t)=> el.childNodes[0].nodeValue = t],
    ['#adquire-form label:nth-of-type(2)', 'adq.form.email', (el,t)=> el.childNodes[0].nodeValue = t],
    ['#adquire-form label:nth-of-type(3)', 'adq.form.msg', (el,t)=> el.childNodes[0].nodeValue = t],
    ['#adquire-form button[type="submit"]', 'adq.form.btn'],
    ['#adquirir .small:last-of-type', 'adq.form.disc'],

    // CONTACTO
    ['#contact h2', 'contact.title'],
    ['#contact .section-header p', 'contact.lead'],
    ['#contact #contact-desc', 'contact.form.note'],
    ['#contact-form label:nth-of-type(1)', 'contact.form.name', (el,t)=> el.childNodes[0].nodeValue = t],
    ['#contact-form label:nth-of-type(2)', 'contact.form.email', (el,t)=> el.childNodes[0].nodeValue = t],
    ['#contact-form label:nth-of-type(3)', 'contact.form.subj', (el,t)=> el.childNodes[0].nodeValue = t],
    ['#contact-form label:nth-of-type(4)', 'contact.form.msg', (el,t)=> el.childNodes[0].nodeValue = t],
    ['#contact-form button[type="submit"]', 'contact.form.btn'],
    ['#contact .small:last-of-type', 'contact.form.hours'],


// TIMELINE
['#news .tl-item:nth-child(1) .tl-date', 'timeline.item1.date'],
['#news .tl-item:nth-child(1) h4', 'timeline.item1.title'],
['#news .tl-item:nth-child(1) p', 'timeline.item1.text'],

['#news .tl-item:nth-child(2) .tl-date', 'timeline.item2.date'],
['#news .tl-item:nth-child(2) h4', 'timeline.item2.title'],
['#news .tl-item:nth-child(2) p', 'timeline.item2.text'],

['#news .tl-item:nth-child(3) .tl-date', 'timeline.item3.date'],
['#news .tl-item:nth-child(3) h4', 'timeline.item3.title'],
['#news .tl-item:nth-child(3) p', 'timeline.item3.text'],

['#news .tl-item:nth-child(4) .tl-date', 'timeline.item4.date'],
['#news .tl-item:nth-child(4) h4', 'timeline.item4.title'],
['#news .tl-item:nth-child(4) p', 'timeline.item4.text'],

['#news .tl-item:nth-child(5) .tl-date', 'timeline.item5.date'],
['#news .tl-item:nth-child(5) h4', 'timeline.item5.title'],
['#news .tl-item:nth-child(5) p', 'timeline.item5.text'],

// FAQ
['#support h2', 'faq.title'],
['#support .section-header p', 'faq.lead'],
['#support details:nth-of-type(1) summary', 'faq.q1.q'],
['#support details:nth-of-type(1) p', 'faq.q1.a'],
['#support details:nth-of-type(2) summary', 'faq.q2.q'],
['#support details:nth-of-type(2) p', 'faq.q2.a'],
['#support details:nth-of-type(3) summary', 'faq.q3.q'],
['#support details:nth-of-type(3) p', 'faq.q3.a'],
['#support details:nth-of-type(4) summary', 'faq.q4.q'],
['#support details:nth-of-type(4) p', 'faq.q4.a'],
['#support details:nth-of-type(5) summary', 'faq.q5.q'],
['#support details:nth-of-type(5) p', 'faq.q5.a'],
['#support details:nth-of-type(6) summary', 'faq.q6.q'],
['#support details:nth-of-type(6) p', 'faq.q6.a'],

// INCLUYE
['#adquirir .grid.two .card h3', 'adq.includes.title'],
['#adquirir .grid.two .card ul li:nth-child(1)', 'adq.includes.1'],
['#adquirir .grid.two .card ul li:nth-child(2)', 'adq.includes.2'],
['#adquirir .grid.two .card ul li:nth-child(3)', 'adq.includes.3'],
['#adquirir .grid.two .card ul li:nth-child(4)', 'adq.includes.4'],


    // FOOTER
    ['.footer-nav a:nth-child(1)', 'footer.legal.about'],
    ['.footer-nav a:nth-child(2)', 'footer.legal.services'],
    ['.footer-nav a:nth-child(3)', 'footer.legal.faq'],
    ['.footer-nav a:nth-child(4)', 'footer.legal.contact'],
    ['.footer-copy .small.muted', 'footer.copy']



  ];

  function applyLang(lang) {
    document.documentElement.setAttribute('lang', lang);
    // Cambia icono del botón
    if (btn) btn.textContent = (lang === 'en') ? '🇺🇸' : '🇪🇸';

    const table = dict[lang] || dict.es;

    // Aplica textos
    for (const [selector, key, custom] of map) {
      const el = document.querySelector(selector);
      if (!el) continue;
      const text = table[key];
      if (typeof custom === 'function') {
        try { custom(el, text); } catch (_) {}
      } else if (typeof text === 'string') {
        el.textContent = text;
      }
    }
  }

  // Estado inicial
  let lang = localStorage.getItem(LANG_KEY) || 'es';
localStorage.setItem(LANG_KEY, lang);
applyLang(lang);


  // Click: alterna idioma y recarga
  if (btn) {
    btn.addEventListener('click', () => {
      lang = (localStorage.getItem(LANG_KEY) === 'es') ? 'en' : 'es';
      localStorage.setItem(LANG_KEY, lang);
      location.reload(); // recarga como pediste
    });
  }
})();

// Botón "Subir arriba"
document.addEventListener('DOMContentLoaded', () => {
  const toTopBtn = document.getElementById('back-to-top');
  if (!toTopBtn) return;

  const toggleToTop = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    // Mostramos a partir de 400px de scroll
    if (y > 400) {
      toTopBtn.classList.add('show');
    } else {
      toTopBtn.classList.remove('show');
    }
  };

  // Mostrar/ocultar al scrollear
  window.addEventListener('scroll', toggleToTop, { passive: true });
  // Llamada inicial por si el usuario entra ya scrolleado
  toggleToTop();

  // Volver arriba suave
  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

