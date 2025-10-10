// Mobile-only off-canvas navigation: auto-clone existing nav links, no desktop changes
(function(){
  'use strict';

  function shouldInit(){ return window.matchMedia && window.matchMedia('(max-width: 900px)').matches; }

  function getNavLinks(){
    var nav = document.querySelector('.nav');
    var list = nav ? nav.querySelector('.nav-links') : null;
    if (!list) return [];
    var anchors = list.querySelectorAll('a[href^="#"]');
    return Array.prototype.map.call(anchors, function(a){ return { href: a.getAttribute('href')||'#', text: (a.textContent||'').trim() }; })
      .filter(function(link){ return link.href !== '#chassis'; }); // Exclude Chassis from mobile menu
  }

  function buildDrawer(links){
    if (document.querySelector('.mobile-drawer')) return; // once

    // Hamburger button
    var btn = document.createElement('button');
    btn.className = 'hamburger-btn';
    btn.setAttribute('aria-label', 'Open menu');
    btn.innerHTML = '<span class="bar"></span>';
    
    // Force inline left-side half-visible behavior (override conflicting CSS)
    // Position BELOW the theme toggle (theme is at 50% + 100px, this at 50% + 170px)
    var H_SIZE = 48; var H_HALF = H_SIZE / 2;
    function applyHamburgerBase(){
      btn.style.setProperty('position','fixed','important');
      btn.style.setProperty('top','calc(50% + 170px)','important');
      btn.style.setProperty('left','-' + H_HALF + 'px','important');
      btn.style.setProperty('right','auto','important');
      btn.style.setProperty('width', H_SIZE + 'px','important');
      btn.style.setProperty('height', H_SIZE + 'px','important');
      btn.style.setProperty('borderRadius','50%','important');
      btn.style.setProperty('transform','translateY(-50%)','important');
      btn.style.setProperty('transition','all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)','important');
      btn.style.setProperty('zIndex','1102','important');
    }
    function setHamburgerHalf(){
      btn.style.setProperty('left','-' + H_HALF + 'px','important');
      btn.style.setProperty('right','auto','important');
    }
    function setHamburgerFull(){
      btn.style.setProperty('left','12px','important');
      btn.style.setProperty('right','auto','important');
    }
    applyHamburgerBase();
    setHamburgerHalf();

    // Overlay
    var overlay = document.createElement('div');
    overlay.className = 'mobile-drawer-overlay';

    // Drawer
    var drawer = document.createElement('nav');
    drawer.className = 'mobile-drawer';
    drawer.setAttribute('aria-hidden', 'true');

    var header = document.createElement('div');
    header.className = 'drawer-header';
    header.innerHTML = '<div class="drawer-title">Navigation</div>';
    drawer.appendChild(header);

    var ul = document.createElement('ul');
    ul.className = 'drawer-links';
    links.forEach(function(l){
      var li = document.createElement('li');
      var a = document.createElement('a'); a.href = l.href; a.textContent = l.text;
      a.addEventListener('click', closeMenu, { passive: true });
      li.appendChild(a); ul.appendChild(li);
    });
    drawer.appendChild(ul);

    var footer = document.createElement('div');
    footer.className = 'drawer-footer';
    footer.textContent = '© ' + new Date().getFullYear() + ' Abdelrahman Okasha';
    drawer.appendChild(footer);

    document.body.appendChild(btn);
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    // events with slide animation (keep full while open, half-hidden when closed)
    function openMenu(){ 
      document.documentElement.classList.add('mobile-menu-open'); 
      drawer.setAttribute('aria-hidden','false'); 
      btn.classList.add('active'); // keep fully visible while menu open
      setHamburgerFull();
    }
    function closeMenu(){ 
      document.documentElement.classList.remove('mobile-menu-open'); 
      drawer.setAttribute('aria-hidden','true'); 
      // slide back to half-hidden shortly after close
      setTimeout(function(){ 
        btn.classList.remove('active'); 
        setHamburgerHalf();
      }, 50);
    }

    btn.addEventListener('click', function(){
      var isOpen = document.documentElement.classList.contains('mobile-menu-open');
      if (isOpen) {
        // close immediately and slide back
        closeMenu();
      } else {
        // slide in and open INSTANTLY for immediate response
        btn.classList.add('active');
        setHamburgerFull();
        openMenu(); // No delay - instant response
      }
    }, { passive: true });

    overlay.addEventListener('click', closeMenu, { passive: true });
    window.addEventListener('resize', function(){ if (!shouldInit()) closeMenu(); }, { passive: true });
  }

  function init(){
    if (!shouldInit()) return; // desktop untouched
    var links = getNavLinks();
    if (!links.length) return;
    buildDrawer(links);
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init, { once:true });
  else init();
})();
