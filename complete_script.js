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
        <img src="${src}" alt="Thumbnail ${index + 1}" class="gallery-thumbnail" onclick="goToImage(${index})">
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

    // Enhanced navbar scroll effect
    function initNavbarEffects() {
      const navbar = document.getElementById('navbar');
      let lastScrollY = window.scrollY;

      window.addEventListener('scroll', () => {
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
      });
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
      document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        document.querySelectorAll('.floating-element').forEach((element, index) => {
          const speed = (index + 1) * 0.5;
          const x = (mouseX - 0.5) * speed;
          const y = (mouseY - 0.5) * speed;
          
          element.style.transform += ` translate(${x}px, ${y}px)`;
        });
      });
    }

    // Enhanced Video functionality with auto-play
    function initVideoControls() {
      const videoCards = document.querySelectorAll('.video-card');
      
      videoCards.forEach((card, index) => {
        const video = card.querySelector('.video-player');
        const overlay = card.querySelector('.video-overlay');
        const playButton = card.querySelector('.play-button');
        
        // Auto-play first video after delay
        if (index === 0) {
          setTimeout(() => {
            video.play();
            card.classList.add('auto-playing');
          }, 2000);
        }
        
        // Play button click handler
        if (playButton) {
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
        
        // Video ended handler
        video.addEventListener('ended', () => {
          card.classList.remove('auto-playing');
        });
        
        // Intersection observer for auto-play
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              setTimeout(() => {
                if (video.paused) {
                  video.play();
                  card.classList.add('auto-playing');
                }
              }, 1000);
            } else {
              video.pause();
              card.classList.remove('auto-playing');
            }
          });
        }, { threshold: 0.5 });
        
        observer.observe(card);
      });
    }

    // Initialize all functions
    function init() {
      animateHeroTitle();
      populateChassisGallery();
      initScrollAnimations();
      initNavbarEffects();
      initSmoothScrolling();
      initMouseParallax();
      initVideoControls();
      initPortfolioHandlers();
      
      // Show all animations immediately for testing
      setTimeout(showAllAnimatedElements, 100);
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