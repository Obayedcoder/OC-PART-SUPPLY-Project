import './style.css';

function scrollCarousel(dir) {
  const track = document.getElementById('carousel');
  const card = track.querySelector('.product-card');
  const gap = 20;
  const distance = (card.offsetWidth + gap) * 2 * dir;
  track.scrollBy({ left: distance, behavior: 'smooth' });
}

// exposed globally so the existing onclick="scrollCarousel(...)" markup keeps working
window.scrollCarousel = scrollCarousel;

// ---- mobile menu drawer ----
const mmOpenBtn = document.getElementById('mmOpen');
const mmCloseBtn = document.getElementById('mmClose');
const mobileMenu = document.getElementById('mobileMenu');
const mmShopToggle = document.getElementById('mmShopToggle');
const mmShopSubmenu = document.getElementById('mmShopSubmenu');

function openMobileMenu() {
  mobileMenu.classList.add('is-open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  mmOpenBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  mmOpenBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (mmOpenBtn && mobileMenu) {
  mmOpenBtn.addEventListener('click', openMobileMenu);
  mmCloseBtn.addEventListener('click', closeMobileMenu);
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMobileMenu();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });
}

if (mmShopToggle && mmShopSubmenu) {
  mmShopToggle.addEventListener('click', () => {
    const isOpen = mmShopToggle.getAttribute('aria-expanded') === 'true';
    mmShopToggle.setAttribute('aria-expanded', String(!isOpen));
    mmShopSubmenu.hidden = isOpen;
  });
}
