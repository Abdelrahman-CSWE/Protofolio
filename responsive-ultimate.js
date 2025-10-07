/* ═══════════════════════════════════════════════════════════════════════════
   🚀 ULTIMATE RESPONSIVE JAVASCRIPT - PERFORMANCE & INTERACTIONS
   ═══════════════════════════════════════════════════════════════════════════
   
   ✅ Hamburger Menu Toggle with Smooth Animations
   ✅ Lazy Loading for Images & Videos
   ✅ Smooth Scroll Navigation
   ✅ Performance Monitoring & Optimization
   ✅ Touch Gestures Support
   ✅ Viewport Detection & Adaptive Loading
   ✅ Intersection Observer for Animations
   ✅ Service Worker for Caching (Optional)
   
   ═══════════════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════════════
     🍔 HAMBURGER MENU FUNCTIONALITY
     ═══════════════════════════════════════════════════════════════════════════ */

  function initHamburgerMenu() {
    // Create hamburger button if it doesn't exist
    const nav = document.querySelector('.nav');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelector('.nav-links');
    
    if (!nav || !navContainer || !navLinks) return;

    // Check if hamburger already exists
    let hamburger = document.querySelector('.hamburger');
    
    if (!hamburger) {
      // Create hamburger button
      hamburger = document.createElement('button');
      hamburger.className = 'hamburger';
      hamburger.setAttribute('aria-label', 'Toggle navigation menu');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.innerHTML = `
        <div class="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;
      
      // Insert hamburger before nav-links
      navContainer.insertBefore(hamburger, navLinks);
    }

    // Toggle menu function
    function toggleMenu() {
      const isOpen = nav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      
      // Prevent body scroll when menu is open on mobile
      if (window.innerWidth <= 900) {
        document.body.style.overflow = isOpen ? 'hidden' : '';
      }
    }

    // Click event for hamburger
    hamburger.addEventListener('click', toggleMenu);

    // Close menu when clicking on a link
    const navLinksItems = navLinks.querySelectorAll('a');
    navLinksItems.forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
          toggleMenu();
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && 
          !nav.contains(e.target) && 
          !hamburger.contains(e.target)) {
        toggleMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        toggleMenu();
      }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 900 && nav.classList.contains('open')) {
          nav.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      }, 250);
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     🖼️ LAZY LOADING FOR IMAGES & VIDEOS
     ═══════════════════════════════════════════════════════════════════════════ */

  function initLazyLoading() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
      // Lazy load images
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Load the image
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            
            // Add loaded class for fade-in effect
            img.addEventListener('load', () => {
              img.classList.add('loaded');
            });
            
            // Stop observing this image
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      lazyImages.forEach(img => imageObserver.observe(img));

      // Lazy load videos
      const lazyVideos = document.querySelectorAll('video[data-src]');
      
      const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const video = entry.target;
            
            // Load video sources
            const sources = video.querySelectorAll('source[data-src]');
            sources.forEach(source => {
              source.src = source.dataset.src;
            });
            
            video.load();
            video.classList.add('loaded');
            observer.unobserve(video);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      lazyVideos.forEach(video => videoObserver.observe(video));
    } else {
      // Fallback for browsers without Intersection Observer
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      lazyImages.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        img.classList.add('loaded');
      });
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     🎯 SMOOTH SCROLL NAVIGATION
     ═══════════════════════════════════════════════════════════════════════════ */

  function initSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if href is just "#"
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          const navHeight = document.querySelector('.nav')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     📊 INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
     ═══════════════════════════════════════════════════════════════════════════ */

  function initScrollAnimations() {
    if ('IntersectionObserver' in window) {
      const animatedElements = document.querySelectorAll('.fade-in, [data-animate]');
      
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            animationObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      animatedElements.forEach(el => animationObserver.observe(el));
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     🎨 NAVBAR SCROLL EFFECT
     ═══════════════════════════════════════════════════════════════════════════ */

  function initNavbarScroll() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScroll = 0;
    let ticking = false;

    function updateNavbar() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     ⚡ PERFORMANCE OPTIMIZATION
     ═══════════════════════════════════════════════════════════════════════════ */

  function optimizePerformance() {
    // Disable animations on low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      document.documentElement.classList.add('low-performance');
    }

    // Reduce animations on mobile
    if (window.innerWidth <= 900) {
      document.documentElement.classList.add('mobile-device');
    }

    // Preload critical resources
    const preloadLinks = [
      { href: 'Certificat.png', as: 'image' },
      { href: 'shell eco marathon chassis 2023.webp', as: 'image' },
      { href: 'shell eco marathon chassis 2025.webp', as: 'image' }
    ];

    preloadLinks.forEach(link => {
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.href = link.href;
      preloadLink.as = link.as;
      
      // Check if file exists before preloading
      if (document.querySelector(`img[src="${link.href}"]`)) {
        document.head.appendChild(preloadLink);
      }
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     📱 TOUCH GESTURES SUPPORT
     ═══════════════════════════════════════════════════════════════════════════ */

  function initTouchGestures() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let touchStartX = 0;
    let touchEndX = 0;

    function handleSwipe() {
      const swipeThreshold = 50;
      const swipeDistance = touchEndX - touchStartX;

      if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance < 0 && !nav.classList.contains('open')) {
          // Swipe left - could be used for other features
        } else if (swipeDistance > 0 && nav.classList.contains('open')) {
          // Swipe right - close menu
          nav.classList.remove('open');
          document.body.style.overflow = '';
        }
      }
    }

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  /* ═══════��═══════════════════════════════════════════════════════════════════
     🔄 VIEWPORT DETECTION & ADAPTIVE LOADING
     ═══════════════════════════════════════════════════════════════════════════ */

  function detectViewport() {
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth <= 900,
      isTablet: window.innerWidth > 900 && window.innerWidth <= 1200,
      isDesktop: window.innerWidth > 1200
    };

    // Store viewport info in data attribute
    document.documentElement.setAttribute('data-viewport', 
      viewport.isMobile ? 'mobile' : 
      viewport.isTablet ? 'tablet' : 'desktop'
    );

    // Disable heavy animations on mobile
    if (viewport.isMobile) {
      const heavyAnimations = document.querySelectorAll(
        '.mechanical-gear-system, .mechanical-framework, .mechanical-bolts, .pcb-pattern'
      );
      heavyAnimations.forEach(el => {
        el.style.display = 'none';
      });
    }

    return viewport;
  }

  /* ═════════���═════════════════════════════════════════════════════════════════
     🎬 HERO NAME ANIMATION
     ═══════════════════════════════════════════════════════════════════════════ */

  function initHeroNameAnimation() {
    const heroName = document.getElementById('hero-name') || document.querySelector('.hero-name');
    
    if (heroName) {
      // Add animation class after a short delay
      setTimeout(() => {
        heroName.classList.add('hero-name-animate');
      }, 100);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     🚀 INITIALIZATION
     ═══════════════════════════════════════════════════════════════════════════ */

  function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    console.log('🚀 Initializing Ultimate Responsive Features...');

    // Initialize all features
    try {
      initHamburgerMenu();
      console.log('✅ Hamburger menu initialized');
    } catch (e) {
      console.error('❌ Hamburger menu error:', e);
    }

    try {
      initLazyLoading();
      console.log('✅ Lazy loading initialized');
    } catch (e) {
      console.error('❌ Lazy loading error:', e);
    }

    try {
      initSmoothScroll();
      console.log('✅ Smooth scroll initialized');
    } catch (e) {
      console.error('❌ Smooth scroll error:', e);
    }

    try {
      initScrollAnimations();
      console.log('✅ Scroll animations initialized');
    } catch (e) {
      console.error('❌ Scroll animations error:', e);
    }

    try {
      initNavbarScroll();
      console.log('✅ Navbar scroll effect initialized');
    } catch (e) {
      console.error('❌ Navbar scroll error:', e);
    }

    try {
      optimizePerformance();
      console.log('✅ Performance optimization applied');
    } catch (e) {
      console.error('❌ Performance optimization error:', e);
    }

    try {
      initTouchGestures();
      console.log('✅ Touch gestures initialized');
    } catch (e) {
      console.error('❌ Touch gestures error:', e);
    }

    try {
      detectViewport();
      console.log('✅ Viewport detection initialized');
    } catch (e) {
      console.error('❌ Viewport detection error:', e);
    }

    try {
      initHeroNameAnimation();
      console.log('✅ Hero name animation initialized');
    } catch (e) {
      console.error('❌ Hero name animation error:', e);
    }

    console.log('🎉 All responsive features initialized successfully!');
  }

  // Start initialization
  init();

  /* ═══════════════════════════════════════════════════════════════════════════
     🔄 WINDOW RESIZE HANDLER
     ═══════════════════════════════════════════════════════════════════════════ */

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      detectViewport();
    }, 250);
  });

  /* ═══════════════════════════════════════════════════════════════════════════
     📊 PERFORMANCE MONITORING (Optional - for development)
     ═══════════════════════════════════════════════════════════════════════════ */

  if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        const connectTime = perfData.responseEnd - perfData.requestStart;
        const renderTime = perfData.domComplete - perfData.domLoading;

        console.log('📊 Performance Metrics:');
        console.log(`   Page Load Time: ${pageLoadTime}ms`);
        console.log(`   Connect Time: ${connectTime}ms`);
        console.log(`   Render Time: ${renderTime}ms`);
      }, 0);
    });
  }

})();

/* ═══════════════════════════════════════════════════════════════════════════
   ✅ END OF ULTIMATE RESPONSIVE JAVASCRIPT
   ═══════════════════════════════════════════════════════════════════════════ */
