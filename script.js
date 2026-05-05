/* ============================================================
   PAUL CHINEDU – PORTFOLIO JAVASCRIPT
   Handles: Navbar, Smooth Scroll, Slider, EmailJS Form
   ============================================================ */

/* ---- Initialize EmailJS ----
   Replace "YOUR_PUBLIC_KEY" with your actual EmailJS public key.
   Sign up at https://emailjs.com to get your keys.
   ---------------------------------------------------------------- */
emailjs.init("YOUR_PUBLIC_KEY");

/* ============================================================
   NAVBAR – Hamburger toggle + close on link click
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  // Animate hamburger to X
  hamburger.classList.toggle('active');
});

// Close menu when any nav link is clicked (mobile)
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

/* ============================================================
   SLIDER – horizontal project carousel
   ============================================================ */
const track      = document.getElementById('sliderTrack');
const viewport   = document.getElementById('sliderViewport');
const prevBtn    = document.getElementById('prevBtn');
const nextBtn    = document.getElementById('nextBtn');

let currentIndex = 0;

/**
 * Returns how many cards are visible at once
 * based on current viewport width.
 */
function getVisibleCount() {
  const w = window.innerWidth;
  if (w <= 580) return 1;
  if (w <= 900) return 2;
  return 3;
}

/**
 * Recalculates and applies the transform to the slider track.
 * Uses the viewport width and gap to compute per-card width.
 */
function updateSlider() {
  const cards       = track.children;
  const total       = cards.length;
  const visible     = getVisibleCount();
  const maxIndex    = total - visible;

  // Clamp currentIndex
  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex > maxIndex) currentIndex = maxIndex;

  // Gap between cards (matches CSS gap: 1.5rem = 24px)
  const gap         = 24;
  const viewWidth   = viewport.clientWidth;
  const cardWidth   = (viewWidth - gap * (visible - 1)) / visible;

  // Apply transform
  const offset = currentIndex * (cardWidth + gap);
  track.style.transform = `translateX(-${offset}px)`;

  // Disable / enable buttons
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex >= maxIndex;
}

prevBtn.addEventListener('click', () => {
  currentIndex--;
  updateSlider();
});

nextBtn.addEventListener('click', () => {
  currentIndex++;
  updateSlider();
});

// Recalculate on resize
window.addEventListener('resize', () => {
  currentIndex = 0;
  updateSlider();
});

// Initial render
updateSlider();

/* ============================================================
   TOUCH / SWIPE support for slider on mobile
   ============================================================ */
let touchStartX = 0;
let touchEndX   = 0;

viewport.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

viewport.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].clientX;
  const delta = touchStartX - touchEndX;

  if (Math.abs(delta) > 50) {
    // Swipe left → next; swipe right → prev
    if (delta > 0) { currentIndex++; }
    else           { currentIndex--; }
    updateSlider();
  }
}, { passive: true });

/* ============================================================
   EMAILJS – Contact form submission
   ============================================================ */

/**
 * sendEmail(e) – called by the form's onsubmit attribute.
 *
 * Reads all form values, validates required fields,
 * then sends via EmailJS.
 *
 * IMPORTANT: Before going live, replace:
 *   "YOUR_PUBLIC_KEY"   → your EmailJS account public key
 *   "YOUR_SERVICE_ID"   → your EmailJS service ID  (e.g. "service_abc123")
 *   "YOUR_TEMPLATE_ID"  → your EmailJS template ID (e.g. "template_xyz789")
 */
function sendEmail(e) {
  e.preventDefault();

  // Collect form values
  const firstName = document.getElementById('firstName').value.trim();
  const lastName  = document.getElementById('lastName').value.trim();
  const service   = document.getElementById('service').value.trim();
  const email     = document.getElementById('email').value.trim();
  const message   = document.getElementById('message').value.trim();

  // Validate required fields
  if (!email || !firstName) {
    alert('Please fill in the required fields (First Name and Email).');
    return;
  }

  // Basic email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Disable submit button to prevent double submission
  const submitBtn = document.querySelector('.btn-submit');
  submitBtn.disabled  = true;
  submitBtn.textContent = 'Sending…';

  // Send via EmailJS
  // Template variables must match your EmailJS template:
  //   {{name}}, {{service}}, {{email}}, {{message}}
  emailjs.send(
    'YOUR_SERVICE_ID',    // ← replace with your EmailJS service ID
    'YOUR_TEMPLATE_ID',   // ← replace with your EmailJS template ID
    {
      name:    firstName + ' ' + lastName,
      service: service || 'Not specified',
      email:   email,
      message: message || 'No description provided.'
    }
  )
  .then(function () {
    alert('Message sent successfully! I\'ll get back to you soon.');
    e.target.reset();
  }, function (error) {
    alert('Failed to send message. Please try again or email directly at agohchinedu112@gmail.com\n\nError: ' + JSON.stringify(error));
  })
  .finally(function () {
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Submit';
  });
}

/* ============================================================
   NAVBAR – Add scrolled shadow effect
   ============================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.style.boxShadow = '0 2px 16px rgba(0,0,0,0.10)';
  } else {
    navbar.style.boxShadow = '0 1px 0 rgba(0,0,0,0.06)';
  }
});
