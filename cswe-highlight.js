(function(){
  function applyCSWEHighlight(){
    try {
      var row = document.querySelector('.metrics-row');
      if(!row) return;
      var boxes = row.querySelectorAll('.floating-element');
      boxes.forEach(function(box){
        var text = (box.textContent || '').toUpperCase();
        // Target ONLY the box that has BOTH phrases
        var isCSWEExpert = text.includes('CERTIFIED EXPERT') && text.includes('CSWE');
        if (isCSWEExpert) {
          box.classList.add('solidworks-cswe');
        } else {
          box.classList.remove('solidworks-cswe');
        }
      });
    } catch(e) {
      // No-op
    }
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyCSWEHighlight);
  } else {
    applyCSWEHighlight();
  }

  // In case DOM updates later (defensive)
  var observer;
  try {
    observer = new MutationObserver(function(){ applyCSWEHighlight(); });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  } catch(e) {}
})();
