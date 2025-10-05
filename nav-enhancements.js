/**
 * ═══════════════════════════════════════════════════════════════
 * ⚡ NAVIGATION BAR ENHANCEMENTS ⚡
 * تحسينات إضافية للبار مع إضافة تأثيرات ديناميكية
 * ═══════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════
  // إضافة عنصر التوهج للروابط
  // ═════════════════════════════════════════════════════════���═════
  
  function addLinkShineEffect() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
      // تحقق إذا كان العنصر موجود مسبقاً
      if (!link.querySelector('.link-shine')) {
        const shineElement = document.createElement('span');
        shineElement.className = 'link-shine';
        link.appendChild(shineElement);
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // تأثير التمرير للبار
  // ═══════════════════════════════════════════════════════════════
  
  function handleNavScroll() {
    const nav = document.querySelector('.nav');
    
    if (!nav) return;
    
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // ══════════════════════════════════════════════════��════════════
  // تفعيل الرابط النشط
  // ═══════════════════════════════��═══════════════════════════════
  
  function handleActiveLink() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');
    
    if (navLinks.length === 0 || sections.length === 0) return;
    
    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // تأثير النقر السلس
  // ═══════════════════════════════════════════════════════════════
  
  function handleSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // تحقق إذا كان الرابط يشير إلى قسم في الصفحة
        if (href.startsWith('#') && href.length > 1) {
          const targetSection = document.querySelector(href);
          
          if (targetSection) {
            e.preventDefault();
            
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight - 20;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // تأثير الماوس ثلاثي الأبعاد
  // ═════════════════════════��═════════════════════════════════════
  
  function handle3DMouseEffect() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
      link.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `
          translateY(-10px) 
          scale(1.1) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg)
        `;
      });
      
      link.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // تهيئة جميع التحسينات
  // ══════════════════════════════════════════════════════════���════
  
  function init() {
    // انتظر حتى يتم تحميل DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        addLinkShineEffect();
        handleNavScroll();
        handleActiveLink();
        handleSmoothScroll();
        handle3DMouseEffect();
      });
    } else {
      addLinkShineEffect();
      handleNavScroll();
      handleActiveLink();
      handleSmoothScroll();
      handle3DMouseEffect();
    }
  }

  // تشغيل التهيئة
  init();

})();
