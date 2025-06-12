// JavaScript Variables for easy customization
const CONFIG = {
  // Countdown target date
  countdownTarget: new Date('2025-07-15T14:00:00').getTime(),
  
  // Carousel settings
  carouselSpeed: 20000, // milliseconds for one complete cycle
  carouselPause: 3000,  // pause on hover (milliseconds)
  
  // Animation settings
  fadeSpeed: 300,
  scrollOffset: 100
};

// DOM Elements
let hamburger, navMenu, countdownElements;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing...');
  
  // Get DOM elements
  hamburger = document.querySelector('.hamburger');
  navMenu = document.querySelector('.nav-menu');
  countdownElements = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
  };

  // Initialize all functionality
  initMobileMenu();
  initCountdown();
  initCarousels();
  initScrollAnimations();
  // initCTAButton();
  initNavbarScroll();
  
  console.log('All systems initialized successfully!');
});

// Mobile menu functionality
function initMobileMenu() {
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });

    // Close menu on window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });
  }
}

// Countdown timer functionality
function initCountdown() {
  console.log('Initializing countdown timer...');
  console.log('Target date:', new Date(CONFIG.countdownTarget));
  
  if (countdownElements.days && countdownElements.hours && countdownElements.minutes && countdownElements.seconds) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
    console.log('Countdown timer started');
  } else {
    console.log('Countdown elements not found - this is normal for non-homepage');
  }
}

function updateCountdown() {
  const now = new Date().getTime();
  const distance = CONFIG.countdownTarget - now;

  if (distance < 0) {
    // Event has passed
    countdownElements.days.textContent = '00';
    countdownElements.hours.textContent = '00';
    countdownElements.minutes.textContent = '00';
    countdownElements.seconds.textContent = '00';
    console.log('Event has passed');
    return;
  }

  // Calculate time units
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Update display with leading zeros
  countdownElements.days.textContent = padZero(days);
  countdownElements.hours.textContent = padZero(hours);
  countdownElements.minutes.textContent = padZero(minutes);
  countdownElements.seconds.textContent = padZero(seconds);
}

function padZero(num) {
  return num < 10 ? '0' + num : num.toString();
}

// Carousel functionality
function initCarousels() {
  console.log('Initializing carousels...');
  
  const carousels = document.querySelectorAll('.carousel');
  console.log('Found carousels:', carousels.length);
  
  carousels.forEach((carousel, index) => {
    const track = carousel.querySelector('.carousel-track');
    const items = carousel.querySelectorAll('.carousel-item');
    
    console.log(`Carousel ${index}: found ${items.length} items`);
    
    if (track && items.length > 0) {
      // Clone items for seamless loop
      items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
      });

      // Set up proper width for infinite scroll
      const itemWidth = 200; // matches CSS
      const gap = 24; // matches CSS gap
      const totalWidth = (itemWidth + gap) * items.length * 2; // doubled because we cloned
      track.style.width = `${totalWidth}px`;

      // Pause animation on hover
      carousel.addEventListener('mouseenter', function() {
        track.style.animationPlayState = 'paused';
      });

      carousel.addEventListener('mouseleave', function() {
        track.style.animationPlayState = 'running';
      });
      
      console.log(`Carousel ${index} initialized successfully`);
    }
  });
}

// CTA Button functionality
// function initCTAButton() {
//   const ctaButton = document.querySelector('.cta-button');
//   if (ctaButton) {
//     ctaButton.addEventListener('click', function() {
//       alert('Redirecting to ticket purchase page...');
//       // Example: window.open('https://tickets.example.com', '_blank');
//     });
//     console.log('CTA button initialized');
//   }
// }

// Scroll animations
function initScrollAnimations() {
  // Add CSS for scroll animations
  const style = document.createElement('style');
  style.textContent = `
    .scroll-animate {
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.6s ease;
    }
    
    .scroll-animate.animate-in {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  // Set up intersection observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Add scroll animation class to elements
  const animateElements = document.querySelectorAll('.event-card, .carousel-section');
  animateElements.forEach(el => {
    el.classList.add('scroll-animate');
    observer.observe(el);
  });
}

// Navbar background on scroll
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      const scrolled = window.pageYOffset;
      if (scrolled > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
      } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      }
    }, { passive: true });
  }
}

// Error handling
window.addEventListener('error', function(e) {
  console.error('Application error:', e.error);
});

// Utility functions
const Utils = {
  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Format numbers with leading zeros
  formatNumber(num, digits = 2) {
    return num.toString().padStart(digits, '0');
  },

  // Check if element is in viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
};

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CONFIG, Utils };
}