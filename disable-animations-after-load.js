/* ===== تعطيل الأنيميشنات المستمرة بعد التحميل لتحسين الأداء ===== */
(function() {
  'use strict';
  
  // الانتظار 3 ثواني بعد تحميل الصفحة ثم تعطيل الأنيميشنات المستمرة
  function disableContinuousAnimations() {
    var heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
      heroVisual.classList.add('loaded');
    }
    
    // إزالة will-change من جميع العناصر لتحسين الأداء
    var floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach(function(el) {
      el.style.willChange = 'auto';
    });
    
    console.log('✅ تم تعطيل الأنيميشنات المستمرة لتحسين الأداء');
  }
  
  // تشغيل بعد 3 ثواني من تحميل الصفحة
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(disableContinuousAnimations, 3000);
    });
  } else {
    setTimeout(disableContinuousAnimations, 3000);
  }
})();
