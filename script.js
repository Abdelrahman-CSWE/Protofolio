// Portfolio data with all projects
const portfolioData = {
  'chassis-gallery': {
    title: 'Chassis Gallery',
    images: [
      'shell eco marathon chassis 2023.webp',
      'shell eco marathon chassis 2025.webp',
      'Global chassis.webp',
      'Ever Chassis.webp',
      'Formula Student chassis.webp'
    ]
  },
  'formula-chassis': {
    title: 'Formula Student Chassis',
    images: [
      'Photos/Formula Student Chassis/A.webp',
      'Photos/Formula Student Chassis/B.webp',
      'Photos/Formula Student Chassis/C.webp',
      'Photos/Formula Student Chassis/D.webp',
      'Photos/Formula Student Chassis/E.webp',
      'Photos/Formula Student Chassis/R.webp'
    ]
  },
  'ever': {
    title: 'EVER Monaco',
    images: [
      'Photos/EVER/1.webp',
      'Photos/EVER/2.webp',
      'Photos/EVER/C.webp'
    ]
  },
  'shell-eco': {
    title: 'Shell Eco-Marathon Vehicle',
    images: [
      'Photos/Shell Eco-Marathon Vehicle/1.webp',
      'Photos/Shell Eco-Marathon Vehicle/2.webp',
      'Photos/Shell Eco-Marathon Vehicle/3.webp',
      'Photos/Shell Eco-Marathon Vehicle/4.webp',
      'Photos/Shell Eco-Marathon Vehicle/5.webp',
      'Photos/Shell Eco-Marathon Vehicle/6.webp',
      'Photos/Shell Eco-Marathon Vehicle/7.webp',
      'Photos/Shell Eco-Marathon Vehicle/8.webp',
      'Photos/Shell Eco-Marathon Vehicle/9.webp',
      'Photos/Shell Eco-Marathon Vehicle/A.webp'
    ]
  },
  'achievements': {
    title: 'Engineering Achievements',
    images: [
      'Photos/Achievements/A-1.webp',
      'Photos/Achievements/A.webp',
      'Photos/Achievements/B.webp',
      'Photos/Achievements/C.webp',
      'Photos/Achievements/D.webp',
      'Photos/Achievements/E.webp'
    ]
  },
  'helmet': {
    title: 'Helmet Design & FEA',
    images: [
      'Photos/Helemt/A.webp',
      'Photos/Helemt/B.webp',
      'Photos/Helemt/C.webp',
      'Photos/Helemt/D.webp',
      'Photos/Helemt/FEA-Helmet.webp'
    ]
  },
  'manufacturing': {
    title: 'Manufacturing & Prototyping',
    images: [
      'Photos/Manufacturing & Prototyping/1.webp',
      'Photos/Manufacturing & Prototyping/2.webp',
      'Photos/Manufacturing & Prototyping/3.webp',
      'Photos/Manufacturing & Prototyping/4.webp',
      'Photos/Manufacturing & Prototyping/5.webp'
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
      'Photos/Solidwork Champion/1-optimized.jpg',
      'Photos/Solidwork Champion/2-optimized.jpg',
      'Photos/Solidwork Champion/3-optimized.jpg'
    ]
  },
  'drawing': {
    title: 'Technical Drawing',
    images: [
      'Photos/Drawing/1.webp',
      'Photos/Drawing/2.webp',
      'Photos/Drawing/3.webp',
      'Photos/Drawing/4.webp',
      'Photos/Drawing/5.webp',
      'Photos/Drawing/6.webp',
      'Photos/Drawing/7.webp',
      'Photos/Drawing/8.webp',
      'Photos/Drawing/9.webp',
      'Photos/Drawing/10.webp',
      'Photos/Drawing/11.webp',
      'Photos/Drawing/12.webp'
    ]
  }
};

// Chassis data
const chassisData = [
  { src: 'shell eco marathon chassis 2023.webp', title: 'Shell Eco-Marathon Chassis 2023' },
  { src: 'shell eco marathon chassis 2025.webp', title: 'Shell Eco-Marathon Chassis 2025' },
  { src: 'Global chassis.webp', title: 'Global Chassis Design' },
  { src: 'Ever Chassis.webp', title: 'EVER Chassis' },
  { src: 'Formula Student chassis.webp', title: 'Formula Student Chassis' }
];

// Gallery functionality
let currentGallery = [];
let currentImageIndex = 0;

function openGallery(projectKey) {
  console.log('Opening gallery for:', projectKey);
  const project = portfolioData[projectKey];
  console.log('Project data:', project);
  
  if (!project) {
    console.error('Project not found:', projectKey);
    return;
  }

  currentGallery = project.images;
  currentImageIndex = 0;

  const modal = document.getElementById('galleryModal');
  const title = document.getElementById('galleryTitle');
  const mainImage = document.getElementById('galleryMainImage');
  const counter = document.getElementById('galleryCounter');
  const thumbnails = document.getElementById('galleryThumbnails');

  if (!modal) {
    console.error('Gallery modal not found!');
    return;
  }

  title.textContent = project.title;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  updateGalleryImage();
  createThumbnails();
}

function updateGalleryImage() {
  const mainImage = document.getElementById('galleryMainImage');
  const counter = document.getElementById('galleryCounter');
  
  mainImage.src = currentGallery[currentImageIndex];
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
  const projects = document.querySelectorAll('.portfolio-project');
  console.log('Found portfolio projects:', projects.length);
  
  projects.forEach(project => {
    const projectKey = project.getAttribute('data-project');
    console.log('Registering click handler for:', projectKey);
    
    project.addEventListener('click', () => {
      console.log('Clicked on project:', projectKey);
      openGallery(projectKey);
    });
  });

  // Gallery controls
  const closeBtn = document.getElementById('galleryClose');
  const nextBtn = document.getElementById('galleryNext');
  const prevBtn = document.getElementById('galleryPrev');
  
  if (closeBtn) closeBtn.addEventListener('click', closeGallery);
  if (nextBtn) nextBtn.addEventListener('click', nextImage);
  if (prevBtn) prevBtn.addEventListener('click', prevImage);

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
  // Simple, performant CSS-only animation trigger
  heroName.classList.add('hero-name-animate');
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
  } else {
    // Fallback: reveal immediately
    targets.forEach(el => el.classList.add('visible'));
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
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
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
      video.preload = 'auto';
    }
    
    // Auto-play first video immediately
    if (index === 0 && video) {
      try { const p = video.play(); if (p && typeof p.catch === 'function') p.catch(() => {}); } catch (_) {}
      card.classList.add('auto-playing');
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
    
    // Intersection observer for auto-play - optimized, instant play when visible
    if ('IntersectionObserver' in window && video) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
            try { const p = video.play(); if (p && typeof p.catch === 'function') p.catch(() => {}); } catch (_) {}
            card.classList.add('auto-playing');
          } else {
            video.pause();
            card.classList.remove('auto-playing');
          }
        });
      }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });
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


// Initialize all functions
function init() {
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
    mo.observe(document.documentElement, { childList: true, subtree: true });
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