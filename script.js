// Portfolio data with all projects
const portfolioData = {
  'formula-chassis': {
    title: 'Formula Student Chassis',
    images: [
      'Photos/Formula Student Chassis/A.jpg',
      'Photos/Formula Student Chassis/B.jpg',
      'Photos/Formula Student Chassis/C.jpg',
      'Photos/Formula Student Chassis/D.jpg',
      'Photos/Formula Student Chassis/E.jpg',
      'Photos/Formula Student Chassis/R.jpg'
    ]
  },
  'ever': {
    title: 'EVER Monaco',
    images: [
      'Photos/EVER/A.jpg',
      'Photos/EVER/B.jpg',
      'Photos/EVER/C.jpeg'
    ]
  },
  'shell-eco': {
    title: 'Shell Eco-Marathon Vehicle',
    images: [
      'Photos/Shell Eco-Marathon Vehicle/1.jpg',
      'Photos/Shell Eco-Marathon Vehicle/2.jpg',
      'Photos/Shell Eco-Marathon Vehicle/3.jpg',
      'Photos/Shell Eco-Marathon Vehicle/4.jpg',
      'Photos/Shell Eco-Marathon Vehicle/5.jpg',
      'Photos/Shell Eco-Marathon Vehicle/6.png',
      'Photos/Shell Eco-Marathon Vehicle/7.png',
      'Photos/Shell Eco-Marathon Vehicle/8.jpg',
      'Photos/Shell Eco-Marathon Vehicle/9.png',
      'Photos/Shell Eco-Marathon Vehicle/A.jpg'
    ]
  },
  'achievements': {
    title: 'Engineering Achievements',
    images: [
      'Photos/Achievements/A-1.jpg',
      'Photos/Achievements/A.jpg',
      'Photos/Achievements/B.jpg',
      'Photos/Achievements/C.jpg',
      'Photos/Achievements/D.jpeg',
      'Photos/Achievements/E.jpg'
    ]
  },
  'helmet': {
    title: 'Helmet Design & FEA',
    images: [
      'Photos/Helemt/A.jpg',
      'Photos/Helemt/B.jpg',
      'Photos/Helemt/C.jpg',
      'Photos/Helemt/D.jpg',
      'Photos/Helemt/FEA-Helmet.jpg'
    ]
  },
  'manufacturing': {
    title: 'Manufacturing & Prototyping',
    images: [
      'Photos/Manufacturing & Prototyping/1.jpg',
      'Photos/Manufacturing & Prototyping/2.jpg',
      'Photos/Manufacturing & Prototyping/3.jpg',
      'Photos/Manufacturing & Prototyping/4.jpg',
      'Photos/Manufacturing & Prototyping/5.jpg'
    ]
  },
  'sheet-metal': {
    title: 'Sheet Metal Analysis',
    images: [
      'Photos/Sheet Metal Analysis/1.jpeg',
      'Photos/Sheet Metal Analysis/2.jpeg',
      'Photos/Sheet Metal Analysis/3.jpeg',
      'Photos/Sheet Metal Analysis/4.jpeg',
      'Photos/Sheet Metal Analysis/Punch.jpeg'
    ]
  },
  'solidworks-champion': {
    title: 'SolidWorks Champion',
    images: [
      'Photos/Solidwork Champion/1.jpg',
      'Photos/Solidwork Champion/2.jpg',
      'Photos/Solidwork Champion/3.jpg'
    ]
  },
  'drawing': {
    title: 'Technical Drawing',
    images: [
      'Photos/Drawing/1.jpg',
      'Photos/Drawing/2.jpg',
      'Photos/Drawing/3.jpg',
      'Photos/Drawing/4.jpg',
      'Photos/Drawing/5.jpg',
      'Photos/Drawing/6.jpg',
      'Photos/Drawing/7.jpg',
      'Photos/Drawing/8.jpg',
      'Photos/Drawing/9.jpg',
      'Photos/Drawing/10.jpg',
      'Photos/Drawing/11.jpg',
      'Photos/Drawing/12.jpg'
    ]
  }
};

// Chassis data
const chassisData = [
  { src: 'shell eco marathon chassis 2023.png', title: 'Shell Eco-Marathon Chassis 2023' },
  { src: 'shell eco marathon chassis 2025.png', title: 'Shell Eco-Marathon Chassis 2025' },
  { src: 'Global chassis.png', title: 'Global Chassis Design' },
  { src: 'Ever Chassis.png', title: 'EVER Chassis' },
  { src: 'Formula Student chassis.png', title: 'Formula Student Chassis' }
];

// Gallery functionality
let currentGallery = [];
let currentImageIndex = 0;

function openGallery(projectKey) {
  const project = portfolioData[projectKey];
  if (!project) return;

  currentGallery = project.images;
  currentImageIndex = 0;

  const modal = document.getElementById('galleryModal');
  const title = document.getElementById('galleryTitle');
  const mainImage = document.getElementById('galleryMainImage');
  const counter = document.getElementById('galleryCounter');
  const thumbnails = document.getElementById('galleryThumbnails');

  title.textContent = project.title;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  updateGalleryImage();
  createThumbnails();
}

function updateGalleryImage() {
  const mainImage = document.getElementById('galleryMainImage');
  const counter = document.getElementById('galleryCounter');

  // Soft fade/zoom transition for main image
  if (mainImage) {
    try {
      mainImage.style.opacity = '0';
      mainImage.style.transform = 'scale(0.985)';
      const onload = () => {
        requestAnimationFrame(() => {
          mainImage.style.opacity = '1';
          mainImage.style.transform = 'scale(1)';
        });
      };
      mainImage.addEventListener('load', onload, { once: true });
    } catch (_) {}
  }
  
  mainImage.src = currentGallery[currentImageIndex];
  // Preload adjacent images for instant navigation
  const len = currentGallery.length;
  const prevIdx = (currentImageIndex - 1 + len) % len;
  const nextIdx = (currentImageIndex + 1) % len;
  [currentGallery[prevIdx], currentGallery[nextIdx]].forEach(src => {
    const i = new Image();
    i.decoding = 'async';
    i.src = src;
  });
  counter.textContent = `${currentImageIndex + 1} / ${currentGallery.length}`;
  
  // Update active thumbnail
  document.querySelectorAll('.gallery-thumbnail').forEach((thumb, index) => {
    thumb.classList.toggle('active', index === currentImageIndex);
  });
}

function createThumbnails() {
  const thumbnails = document.getElementById('galleryThumbnails');
  thumbnails.innerHTML = currentGallery.map((src, index) => `
    <img src="${src}" alt="Thumbnail ${index + 1}" class="gallery-thumbnail" onclick="goToImage(${index})" loading="lazy" decoding="async">
  `).join('');
  // Ensure native lazy attributes are applied
  setLazyLoadingForImages();
}

function goToImage(index) {
  currentImageIndex = index;
  updateGalleryImage();
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
  updateGalleryImage();
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
  updateGalleryImage();
}

function closeGallery() {
  const modal = document.getElementById('galleryModal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Initialize portfolio click handlers
function initPortfolioHandlers() {
  document.querySelectorAll('.portfolio-project').forEach(project => {
    project.addEventListener('click', () => {
      const projectKey = project.getAttribute('data-project');
      openGallery(projectKey);
    });
  });

  // Gallery controls
  document.getElementById('galleryClose').addEventListener('click', closeGallery);
  document.getElementById('galleryNext').addEventListener('click', nextImage);
  document.getElementById('galleryPrev').addEventListener('click', prevImage);

  // Close on backdrop click
  document.getElementById('galleryModal').addEventListener('click', (e) => {
    if (e.target.id === 'galleryModal') {
      closeGallery();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('galleryModal').classList.contains('active')) return;
    
    switch(e.key) {
      case 'Escape':
        closeGallery();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      case 'ArrowRight':
        nextImage();
        break;
    }
  });
}

// Optimized Text Animation - Fast & Smooth
function animateHeroTitle() {
  const heroTitle = document.getElementById('hero-title'); // Job title element
  const heroName = document.getElementById('hero-name');   // Name element
  
  // Faster typewriter effect
  if (heroTitle) {
    const text = 'Mechanical Design Engineer';
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid var(--accent-primary)';
    heroTitle.style.animation = 'blink-cursor 0.8s infinite';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        heroTitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 60); // Faster typing
      } else {
        // Remove cursor after typing is complete
        setTimeout(() => {
          heroTitle.style.borderRight = 'none';
          heroTitle.style.animation = 'none';
          
          // Lighter glow effect
          heroTitle.style.textShadow = `
            0 0 8px rgba(14, 165, 233, 0.4),
            0 0 16px rgba(14, 165, 233, 0.2)
          `;
          
          // Start name animation faster
          animateNameWithEngineering();
        }, 300);
      }
    };
    
    // Start typing sooner
    setTimeout(typeWriter, 500);
  }
}

// Advanced name animation with engineering theme - FIXED TO TARGET NAME ELEMENT
function animateNameWithEngineering() {
  const heroName = document.getElementById('hero-name'); // Fixed ID
  if (!heroName) return;
  
  const text = heroName.textContent;
  heroName.textContent = '';
  
  text.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = `${0.1 + index * 0.08}s`;
    
    // Add engineering-themed effects to each character
    span.style.display = 'inline-block';
    span.style.transform = 'translateY(50px) rotateX(90deg)';
    span.style.opacity = '0';
    span.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    
    // Add mechanical precision effect
    setTimeout(() => {
      span.style.transform = 'translateY(0) rotateX(0deg)';
      span.style.opacity = '1';
      
      // Add subtle glow effect to each character
      span.style.textShadow = `
        0 0 5px rgba(139, 92, 246, 0.3),
        0 2px 4px rgba(0, 0, 0, 0.1)
      `;
      
      // Add hover effect for engineering precision
      span.addEventListener('mouseenter', () => {
        span.style.transform = 'translateY(-3px) scale(1.1)';
        span.style.textShadow = `
          0 0 15px rgba(139, 92, 246, 0.6),
          0 4px 8px rgba(0, 0, 0, 0.2)
        `;
      });
      
      span.addEventListener('mouseleave', () => {
        span.style.transform = 'translateY(0) scale(1)';
        span.style.textShadow = `
          0 0 5px rgba(139, 92, 246, 0.3),
          0 2px 4px rgba(0, 0, 0, 0.1)
        `;
      });
      
    }, 100 + index * 80);
    
    heroName.appendChild(span);
  });
}

// Populate chassis gallery
function populateChassisGallery() {
  const grid = document.getElementById('chassisGrid');
  if (!grid) return;
  
  grid.innerHTML = chassisData.map((chassis, index) => `
    <div class="chassis-card animate-on-scroll" style="animation-delay: ${index * 0.1}s">
      <img src="${chassis.src}" alt="${chassis.title}" class="chassis-image" loading="lazy" decoding="async">
      <div class="chassis-info">
        <h3 class="chassis-title">${chassis.title}</h3>
      </div>
    </div>
  `).join('');
}

// Enhanced scroll animations
function initScrollAnimations() {
  const targets = document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right');
  const sections = document.querySelectorAll('section');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    targets.forEach(el => observer.observe(el));

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    sections.forEach(s => sectionObserver.observe(s));
  } else {
    // Fallback: reveal immediately
    targets.forEach(el => el.classList.add('visible'));
    sections.forEach(s => s.classList.add('in-view'));
  }
}

// Make all animated elements visible immediately (for testing)
function showAllAnimatedElements() {
  document.querySelectorAll('.animate-on-scroll, .animate-slide-left, .animate-slide-right').forEach(el => {
    el.classList.add('visible');
  });
}

// Enhanced navbar scroll effect
function initNavbarEffects() {
  const navbar = document.getElementById('navbar');
  let lastScrollY = window.scrollY;
  let ticking = false;

  const onScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }

    lastScrollY = currentScrollY;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
}

// Handle form submission
function handleSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  
  const subject = encodeURIComponent('Portfolio Inquiry from ' + name);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.location.href = `mailto:abdelrahman.okasha@example.com?subject=${subject}&body=${body}`;
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  const overlay = ensureTransitionOverlay();
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      // Page transition overlay + smooth scroll
      overlay.classList.add('show');
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => overlay.classList.remove('show'), 450);
      }, 80);
    });
  });
}

// Add mouse parallax effect
function initMouseParallax() {
  // Disabled for performance and smoother animations
  // If needed later, implement with requestAnimationFrame and CSS variables
}

// Enhanced Video functionality with auto-play
function initVideoControls() {
  const videoCards = document.querySelectorAll('.video-card');
  
  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;
  };
  
  videoCards.forEach((card, index) => {
    const video = card.querySelector('.video-player');
    const overlay = card.querySelector('.video-overlay');
    const playButton = card.querySelector('.play-button');

    // Ensure efficient attributes and instant playback
    if (video) {
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.muted = true;
      video.autoplay = true;
      video.loop = true;
      // Avoid heavy buffering until near viewport
      video.preload = 'metadata';
    }
    
    // Auto-play first video if it's visible to the user
    if (index === 0 && video) {
      if (typeof IntersectionObserver === 'undefined' ? true : isElementInViewport(card)) {
        try { const p = video.play(); if (p && typeof p.catch === 'function') p.catch(() => {}); } catch (_) {}
        card.classList.add('auto-playing');
      }
    }
    
    // Play button click handler
    if (playButton && video) {
      playButton.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          card.classList.add('auto-playing');
        } else {
          video.pause();
          card.classList.remove('auto-playing');
        }
      });
    }
    
    // Video lifecycle handlers
    if (video) {
      // Ensure quick start when ready
      video.addEventListener('canplay', () => {
        try { const p = video.play(); if (p && typeof p.catch === 'function') p.catch(() => {}); } catch (_) {}
      }, { once: true });

      video.addEventListener('ended', () => {
        card.classList.remove('auto-playing');
      });
    }
    
    // Intersection observer for auto-play and smart preloading
    if ('IntersectionObserver' in window && video) {
      let preloaded = false;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.15) {
            if (!preloaded) {
              // Start buffering shortly before it becomes visible
              video.preload = 'auto';
              try { video.load(); } catch(_) {}
              preloaded = true;
            }
            try { const p = video.play(); if (p && typeof p.catch === 'function') p.catch(() => {}); } catch (_) {}
            card.classList.add('auto-playing');
          } else {
            video.pause();
            card.classList.remove('auto-playing');
          }
        });
      }, { threshold: 0.15, rootMargin: '200px 0px 200px 0px' });
      observer.observe(card);
    }
  });
}

// ترتيب المربعات في صف أفقي واحد على اليمين
function arrangeHeroMetricsRow() {
  try {
    const visual = document.querySelector('.hero-visual');
    if (!visual) return;

    // التأكد من وجود الحاوية
    let wrapper = visual.querySelector('.metrics-row');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'metrics-row';
      visual.prepend(wrapper);
    }

    // جمع المربعات
    const boxes = Array.from(visual.querySelectorAll('.floating-element'));
    const badge = document.querySelector('.certification-badge');

    // ترتيب المربعات حسب المحتوى
    const getRank = (el) => {
      const t = (el.textContent || '').toLowerCase();
      // Place the dedicated CERTIFIED EXPERT CSWE box at the end (4th)
      if (t.includes('certified') && t.includes('expert')) return 3;
      // First metric: CSWE Certified 1/129
      if (t.includes('cswe') && t.includes('certified')) return 0;
      // Second: Years Experience
      if (t.includes('years') && t.includes('experience')) return 1;
      // Third: Projects Completed
      if (t.includes('projects') && t.includes('completed')) return 2;
      // Others go after
      return 4;
    };

    boxes.sort((a, b) => getRank(a) - getRank(b));

    // إضافة المربعات بالترتيب
    boxes.forEach((el) => {
      if (el) wrapper.appendChild(el);
    });

    // إضافة الشارة في النهاية
    if (badge) wrapper.appendChild(badge);

    // محاذاة الصف مع العنوان
    const titleEl = document.querySelector('.hero-title .line2')
      || document.querySelector('.hero-title .line1')
      || document.querySelector('.hero-title');
    const visRect = visual.getBoundingClientRect();
    if (titleEl) {
      const titleRect = titleEl.getBoundingClientRect();
      const topOffset = Math.max(0, Math.round(titleRect.top - visRect.top));
      wrapper.style.top = `${topOffset}px`;
    } else {
      wrapper.style.top = '0px';
    }
    wrapper.style.position = 'absolute';
    wrapper.style.right = '0px';
  } catch (err) {
    console.error('Error arranging metrics row:', err);
  }
}

// Utility: ensure all images use native lazy loading for better performance
function setLazyLoadingForImages() {
  try {
    document.querySelectorAll('img:not([loading])').forEach(img => {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    });
  } catch (_) {}
}

// Lightweight CSS injection for animations and transition overlay
function installAnimationStyles() {
  if (document.getElementById('pro-animations-css')) return;
  const css = `
    section { opacity: 0; transform: translateY(24px); transition: transform 600ms var(--ease), opacity 600ms var(--ease); will-change: transform, opacity; }
    section.in-view { opacity: 1; transform: none; }
    #page-transition-overlay { position: fixed; inset: 0; background: radial-gradient(1200px 800px at 10% 10%, rgba(14,165,233,.10), transparent 60%), radial-gradient(1200px 800px at 90% 90%, rgba(245,158,11,.08), transparent 60%), rgba(3,7,18,0.65); backdrop-filter: blur(2px); opacity: 0; pointer-events: none; transition: opacity 300ms ease; z-index: 2147483000; }
    #page-transition-overlay.show { opacity: 1; pointer-events: auto; }
    @media (prefers-reduced-motion: reduce) {
      section, #page-transition-overlay { transition: none !important; transform: none !important; }
    }
  `;
  const style = document.createElement('style');
  style.id = 'pro-animations-css';
  style.textContent = css;
  document.head.appendChild(style);
}

function ensureTransitionOverlay() {
  let ov = document.getElementById('page-transition-overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'page-transition-overlay';
    document.body.appendChild(ov);
  }
  return ov;
}

// Initialize all functions
function init() {
  installAnimationStyles();
  ensureTransitionOverlay();
  // Apply lazy loading to existing images
  setLazyLoadingForImages();

  animateHeroTitle();
  populateChassisGallery();
  initScrollAnimations();
  initNavbarEffects();
  initSmoothScrolling();
  initMouseParallax();
  initVideoControls();
  initPortfolioHandlers();

  // Re-apply lazy attributes to dynamically inserted images
  try {
    const mo = new MutationObserver(() => setLazyLoadingForImages());
    const targets = [document.getElementById('galleryThumbnails'), document.getElementById('chassisGrid')].filter(Boolean);
    targets.forEach(t => mo.observe(t, { childList: true, subtree: true }));
  } catch (_) {}

  // Arrange metrics row after initial layout and on resize
  setTimeout(arrangeHeroMetricsRow, 50);
  window.addEventListener('resize', () => { setTimeout(arrangeHeroMetricsRow, 100); });
  
  // Testing helper disabled to avoid extra work during startup
  // setTimeout(showAllAnimatedElements, 100);
}

// Run initialization when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Advanced Content Protection
document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  return false;
});

document.addEventListener('keydown', function(e) {
  // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
  if (e.keyCode === 123 || 
      (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
      (e.ctrlKey && e.keyCode === 85)) {
    e.preventDefault();
    return false;
  }
});

// Disable drag and drop
document.addEventListener('dragstart', function(e) {
  e.preventDefault();
  return false;
});

// Disable text selection on protected elements
document.addEventListener('selectstart', function(e) {
  if (e.target.closest('.portfolio-project, .floating-element, .hero-content')) {
    e.preventDefault();
    return false;
  }
});