// ============ PRELOADER ============
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
    document.body.style.overflow = 'auto';
  }, 2400);
});
document.body.style.overflow = 'hidden';

// ============ NAV SCROLL ============
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if(window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// ============ REVEAL ON SCROLL ============
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal, .service-card').forEach(el => observer.observe(el));

// ============ GOLD PARTICLES ============
const particlesEl = document.getElementById('particles');
for(let i = 0; i < 18; i++){
  const p = document.createElement('div');
  p.className = 'particle';
  p.style.left = Math.random() * 100 + 'vw';
  p.style.animationDuration = (12 + Math.random() * 14) + 's';
  p.style.animationDelay = Math.random() * 12 + 's';
  const s = 1 + Math.random() * 3;
  p.style.width = s + 'px';
  p.style.height = s + 'px';
  particlesEl.appendChild(p);
}

// ============ FORM ============
document.getElementById('bookingForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  btn.innerHTML = 'Wysyłanie...';
  btn.style.opacity = '.7';
  setTimeout(() => {
    btn.innerHTML = '✓ Dziękujemy! Oddzwonimy wkrótce.';
    btn.style.background = 'linear-gradient(135deg,#27d3c5,#0a8079)';
    btn.style.color = '#0a0807';
    setTimeout(() => {
      e.target.reset();
      btn.innerHTML = original;
      btn.style.opacity = '1';
      btn.style.background = '';
      btn.style.color = '';
    }, 3000);
  }, 1200);
});

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if(href === '#') return;
    const target = document.querySelector(href);
    if(target){
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============ HERO PARALLAX ============
const heroFigure = document.querySelector('.hero-figure');
const heroCurves = document.querySelector('.hero-curves');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if(y < window.innerHeight){
    if(heroFigure) heroFigure.style.transform = `translateY(${y * 0.15}px)`;
    if(heroCurves) heroCurves.style.transform = `translateY(${y * 0.08}px)`;
  }
});

// ============ PRICING ACCORDION (single open) ============
document.querySelectorAll('[data-acc]').forEach(head => {
  head.addEventListener('click', () => {
    const section = head.parentElement;
    const wasOpen = section.classList.contains('open');
    // Close all
    document.querySelectorAll('.price-section').forEach(s => s.classList.remove('open'));
    // Open clicked one (if it was closed)
    if(!wasOpen) section.classList.add('open');
  });
});
// All accordions start closed by default — no auto-open

// ============ MOBILE MENU ============
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : 'auto';
});
// close menu when clicking any link
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = 'auto';
  });
});

// ============ GALLERY SLIDER ============
const track = document.getElementById('galleryTrack');
const slides = track.children;
const prev = document.getElementById('galleryPrev');
const next = document.getElementById('galleryNext');
const dotsWrap = document.getElementById('galleryDots');

function getVisibleSlides(){
  const w = window.innerWidth;
  if(w < 980) return 1;
  if(w < 1100) return 2;
  return 3;
}

let currentIndex = 0;
let visibleCount = getVisibleSlides();
let maxIndex = Math.max(0, slides.length - visibleCount);

function renderDots(){
  dotsWrap.innerHTML = '';
  for(let i = 0; i <= maxIndex; i++){
    const dot = document.createElement('button');
    dot.className = 'gallery-dot' + (i === currentIndex ? ' active' : '');
    dot.setAttribute('aria-label', `Przejdź do slajdu ${i+1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }
}

function updateSlider(){
  const slideWidth = slides[0].offsetWidth + 24;
  track.style.transform = `translateX(${-currentIndex * slideWidth}px)`;
  prev.disabled = currentIndex === 0;
  next.disabled = currentIndex >= maxIndex;
  document.querySelectorAll('.gallery-dot').forEach((d, i) => {
    d.classList.toggle('active', i === currentIndex);
  });
}

function goTo(i){
  currentIndex = Math.max(0, Math.min(i, maxIndex));
  updateSlider();
}

prev.addEventListener('click', () => goTo(currentIndex - 1));
next.addEventListener('click', () => goTo(currentIndex + 1));

window.addEventListener('resize', () => {
  visibleCount = getVisibleSlides();
  maxIndex = Math.max(0, slides.length - visibleCount);
  currentIndex = Math.min(currentIndex, maxIndex);
  renderDots();
  updateSlider();
});

// touch swipe
let startX = 0;
track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, {passive:true});
track.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - startX;
  if(dx > 50) goTo(currentIndex - 1);
  else if(dx < -50) goTo(currentIndex + 1);
}, {passive:true});

renderDots();
updateSlider();
