const WA_NUMERO = '5492284322157';

function goTo(selector) {
  const el = document.querySelector(selector);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function initNavScroll() {
  window.addEventListener('scroll', () => {
    document.querySelector('nav')
      .classList.toggle('nav-scrolled', window.scrollY > 60);
  }, { passive: true });
}

function initHamburger() {
  const nav = document.querySelector('nav');
  const btn = document.querySelector('.nav-hamburger');
  const menu = document.querySelector('.nav-mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('menu-open');
    btn.setAttribute('aria-expanded', isOpen);
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('menu-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) {
      nav.classList.remove('menu-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

window.goTo = goTo;

document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initHamburger();
});
