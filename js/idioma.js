// ----------------------------
// 1️⃣ Definición de traducciones
// ----------------------------
const traducciones = {
    es: {
        h1: "Diego DJ Pro Estancos",
        novedades: "Novedades",
        galeria: "Galería",
        biografia: "Biografía",
        contacto: "Contacto",
        serviciosTitulo: "Servicios",
        serviciosTexto: "Más contenido..."
    },
    en: {
        h1: "Diego DJ Pro Estancos",
        novedades: "News",
        galeria: "Gallery",
        biografia: "Biography",
        contacto: "Contact",
        serviciosTitulo: "Services",
        serviciosTexto: "More content..."
    },
    fr: {
        h1: "Diego DJ Pro Estancos",
        novedades: "Actualités",
        galeria: "Galerie",
        biografia: "Biographie",
        contacto: "Contact",
        serviciosTitulo: "Services",
        serviciosTexto: "Plus de contenu..."
    },
    de: { // Alemán
        h1: "Diego DJ Pro Estancos",
        novedades: "Neuigkeiten",
        galeria: "Galerie",
        biografia: "Biografie",
        contacto: "Kontakt",
        serviciosTitulo: "Dienstleistungen",
        serviciosTexto: "Mehr Inhalt..."
    },
    zh: { // Chino simplificado
        h1: "Diego DJ Pro Estancos",
        novedades: "新闻",
        galeria: "画廊",
        biografia: "传记",
        contacto: "联系",
        serviciosTitulo: "服务",
        serviciosTexto: "更多内容..."
    },
    ja: { // Japonés
        h1: "Diego DJ Pro Estancos",
        novedades: "ニュース",
        galeria: "ギャラリー",
        biografia: "経歴",
        contacto: "お問い合わせ",
        serviciosTitulo: "サービス",
        serviciosTexto: "さらにコンテンツ..."
    },
    ru: { // Ruso
        h1: "Diego DJ Pro Estancos",
        novedades: "Новости",
        galeria: "Галерея",
        biografia: "Биография",
        contacto: "Контакты",
        serviciosTitulo: "Услуги",
        serviciosTexto: "Больше контента..."
    }
};

// ----------------------------
// 2️⃣ Detectar idioma del navegador
// ----------------------------
const idioma = navigator.language || navigator.userLanguage; // ej. "es-ES", "en-US"
const idiomaCorto = idioma.substring(0, 2); // "es", "en", "fr", "de", "zh", "ja", "ru"

// ----------------------------
// 3️⃣ Función para aplicar traducciones
// ----------------------------
function aplicarIdioma() {
    // Si el idioma no está definido, usar español por defecto
    const lang = traducciones[idiomaCorto] ? idiomaCorto : 'es';

    // Cambiar h1
    const h1 = document.querySelector('header h1');
    if (h1) h1.textContent = traducciones[lang].h1;

    // Cambiar nav
    const navItems = document.querySelectorAll('nav li');
    if (navItems.length >= 4) {
        navItems[0].textContent = traducciones[lang].novedades;
        navItems[1].textContent = traducciones[lang].galeria;
        navItems[2].textContent = traducciones[lang].biografia;
        navItems[3].textContent = traducciones[lang].contacto;
    }

    // Cambiar sección servicios
    const serviciosTitulo = document.querySelector('section:nth-of-type(2) h2');
    const serviciosTexto = document.querySelector('section:nth-of-type(2) p');
    if (serviciosTitulo) serviciosTitulo.textContent = traducciones[lang].serviciosTitulo;
    if (serviciosTexto) serviciosTexto.textContent = traducciones[lang].serviciosTexto;
}

// ----------------------------
// 4️⃣ Ejecutar al cargar la página
// ----------------------------
window.addEventListener('DOMContentLoaded', aplicarIdioma);