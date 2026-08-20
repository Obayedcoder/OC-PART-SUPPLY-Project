import './style.css';

function scrollCarousel(dir, trackId = 'carousel') {
  const track = document.getElementById(trackId);
  const card = track.querySelector('.product-card');
  const gap = 20;
  const distance = (card.offsetWidth + gap) * 2 * dir;
  track.scrollBy({ left: distance, behavior: 'smooth' });
}

// exposed globally so the existing onclick="scrollCarousel(...)" markup keeps working
window.scrollCarousel = scrollCarousel;

// ---- infinite trust-strip marquee ----
// The CSS loop (translateX(-50%)) only looks seamless if HALF the track is
// already wider than the viewport — otherwise the loop point shows a blank
// gap on wide/desktop screens. Clone the one authored set of items until
// that's true, and redo it on resize.
const trustTrack = document.getElementById('trustTrack');
if (trustTrack) {
  const baseItems = Array.from(trustTrack.children);
  function buildMarquee() {
    trustTrack.innerHTML = '';
    baseItems.forEach((item) => trustTrack.appendChild(item.cloneNode(true)));
    const minTotalWidth = Math.max(window.innerWidth * 2.2, 3600);
    let guard = 0;
    while (trustTrack.scrollWidth < minTotalWidth && guard < 60) {
      baseItems.forEach((item) => trustTrack.appendChild(item.cloneNode(true)));
      guard++;
    }
  }
  buildMarquee();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildMarquee, 300);
  });
}

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

// ---- chat widget ----
const chatWidget = document.querySelector('.chat-widget');
const chatToggle = document.getElementById('chatToggle');
const chatClose = document.getElementById('chatClose');
const chatPanel = document.getElementById('chatPanel');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatBody = document.getElementById('chatBody');
const chatGreeting = document.getElementById('chatHero')?.querySelector('.chat-hero-greeting')?.textContent.trim();

function addChatBubble(text, from) {
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble chat-bubble--${from}`;
  bubble.textContent = text;
  chatBody.appendChild(bubble);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// TODO: replace this with a real chatbot / WhatsApp / Messenger integration later.
// For now it just echoes a placeholder reply so the widget feels alive.
function getPlaceholderReply() {
  return "Thanks for your message! Live chat isn't connected yet — please use the Contact Us section below and we'll get back to you soon.";
}

// switches the widget from the empty-state hero (greeting + product art)
// into a normal scrolling message thread, the first time someone writes in.
function startConversation() {
  if (chatWidget.classList.contains('has-messages')) return;
  chatWidget.classList.add('has-messages');
  if (chatGreeting) addChatBubble(chatGreeting, 'bot');
}

function openChat() {
  chatWidget.classList.add('is-open');
  chatToggle.setAttribute('aria-expanded', 'true');
  chatPanel.setAttribute('aria-hidden', 'false');
  chatInput.focus();
}

function closeChat() {
  chatWidget.classList.remove('is-open');
  chatToggle.setAttribute('aria-expanded', 'false');
  chatPanel.setAttribute('aria-hidden', 'true');
}

if (chatWidget && chatToggle && chatPanel) {
  chatToggle.addEventListener('click', () => {
    chatWidget.classList.contains('is-open') ? closeChat() : openChat();
  });
  chatClose.addEventListener('click', closeChat);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatWidget.classList.contains('is-open')) closeChat();
  });
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    startConversation();
    addChatBubble(text, 'user');
    chatInput.value = '';
    setTimeout(() => addChatBubble(getPlaceholderReply(), 'bot'), 400);
  });
}
