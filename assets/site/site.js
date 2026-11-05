(() => {
  const root = document.documentElement;
  const body = document.body;
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-links');
  const languageButtons = document.querySelectorAll('[data-lang]');
  const translations = document.querySelectorAll('[data-en][data-gr]');

  const setLanguage = (language) => {
    const lang = language === 'gr' ? 'gr' : 'en';
    root.lang = lang === 'gr' ? 'el' : 'en';
    translations.forEach((element) => {
      element.textContent = element.dataset[lang];
    });
    languageButtons.forEach((button) => {
      const active = button.dataset.lang === lang;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    localStorage.setItem('soul-language', lang);
  };

  languageButtons.forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });
  setLanguage(localStorage.getItem('soul-language') || 'en');

  if (menuButton && nav) {
    const closeMenu = () => {
      body.classList.remove('nav-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open menu');
    };
    menuButton.addEventListener('click', () => {
      const open = body.classList.toggle('nav-open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item) => observer.observe(item));
  }

  const lightbox = document.querySelector('.lightbox');
  if (lightbox && typeof lightbox.showModal === 'function') {
    const lightboxImage = lightbox.querySelector('img');
    document.querySelectorAll('.gallery-item, .menu-page').forEach((item) => {
      item.addEventListener('click', () => {
        const image = item.querySelector('img');
        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightbox.showModal();
      });
    });
    lightbox.querySelector('button').addEventListener('click', () => lightbox.close());
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) lightbox.close();
    });
  }
})();
