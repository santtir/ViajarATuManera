const WA_NUMERO = '5492284648973';

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

window.goTo = goTo;

document.addEventListener('DOMContentLoaded', initNavScroll);
