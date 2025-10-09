// Mobile-only off-canvas navigation: auto-clone existing nav links, no desktop changes
(function(){
  'use strict';

  function shouldInit(){ return window.matchMedia && window.matchMedia('(max-width: 900px)').matches; }

  function getNavLinks(){
    var nav = document.querySelector('.nav');
    var list = nav ? nav.querySelector('.nav-links') : null;
    if (!list) return [];
    var anchors = list.querySelectorAll('a[href^="#"]');
    return Array.prototype.map.call(anchors, function(a){ return { href: a.getAttribute('href')||'#', text: (a.textContent||'').trim() }; });
  }

  function buildDrawer(links){
    if (document.querySelector('.mobile-drawer')) return; // once

    // Hamburger button
    var btn = document.createElement('button');
    btn.className = 'hamburger-btn';
    btn.setAttribute('aria-label', 'Open menu');
    btn.innerHTML = '<span class="bar"></span>';

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

    // events
    function openMenu(){ document.documentElement.classList.add('mobile-menu-open'); drawer.setAttribute('aria-hidden','false'); }
    function closeMenu(){ document.documentElement.classList.remove('mobile-menu-open'); drawer.setAttribute('aria-hidden','true'); }

    btn.addEventListener('click', function(){
      if (document.documentElement.classList.contains('mobile-menu-open')) closeMenu();
      else openMenu();
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
