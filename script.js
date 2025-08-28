// Helpers
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];

// Year in footer
$('#year').textContent = new Date().getFullYear();

// Mobile nav toggle
const navToggle = $('.nav-toggle');
const navMenu = $('#nav-menu');
navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navMenu.classList.toggle('show');
});
$$('#nav-menu a').forEach(a => a.addEventListener('click', () => {
  navMenu.classList.remove('show');
  navToggle.setAttribute('aria-expanded', 'false');
}));

// Smooth scroll (native CSS handles, but ensure offset for sticky header)
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const headerOffset = $('.site-header').offsetHeight + 8;
    const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  });
});

// Theme toggle with persistence
const themeToggle = $('#themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);
themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.textContent = next === 'light' ? '🌙' : '☀️';
});
themeToggle.textContent = (root.getAttribute('data-theme') || 'light') === 'light' ? '🌙' : '☀️';

// Scroll to top button
const scrollTopBtn = $('#scrollTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) scrollTopBtn.classList.add('show');
  else scrollTopBtn.classList.remove('show');
});
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Animate sections on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
$$('.animate-on-scroll').forEach(el => observer.observe(el));

// Modal helpers
const modal = $('#modal');
const openModal = (message, title = 'Success') => {
  $('#modalMessage').textContent = message;
  $('#modalTitle').textContent = title;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
};
const closeModal = () => {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
};
$$('[data-close]').forEach(btn => btn.addEventListener('click', closeModal));
modal.addEventListener('click', (e) => { if (e.target.classList.contains('modal-backdrop')) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// Validation helpers
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const setError = (id, msg) => { const el = document.getElementById(id); if (el) el.textContent = msg; };
const clearErrors = (...ids) => ids.forEach(id => setError(id, ''));

// Newsletter form
const newsletterForm = $('#newsletterForm');
newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = $('#newsletterEmail').value.trim();
  clearErrors('newsletterError');
  if (!email) { setError('newsletterError', 'Email is required'); return; }
  if (!emailRegex.test(email)) { setError('newsletterError', 'Enter a valid email'); return; }
  e.target.reset();
  openModal('Thanks for subscribing! Please check your inbox to confirm.');
});

// Contact form
const contactForm = $('#contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const message = $('#message').value.trim();
  clearErrors('nameError', 'emailError', 'messageError');
  let valid = true;
  if (!name || name.length < 2) { setError('nameError', 'Please enter your name'); valid = false; }
  if (!email) { setError('emailError', 'Email is required'); valid = false; }
  else if (!emailRegex.test(email)) { setError('emailError', 'Enter a valid email'); valid = false; }
  if (!message || message.length < 10) { setError('messageError', 'Message must be at least 10 characters'); valid = false; }
  if (!valid) return;
  e.target.reset();
  openModal('Thanks for reaching out! We\'ll get back to you shortly.');
});


