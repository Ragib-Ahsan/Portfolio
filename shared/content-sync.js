(function () {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.viewport-tablet [data-sync], .viewport-mobile [data-sync]').forEach(function (el) {
      var sourceId = el.getAttribute('data-sync');
      var source = document.getElementById(sourceId);
      if (!source) return;
      var tag = el.tagName.toLowerCase();
      if (tag === 'img') {
        el.src = source.src;
        el.alt = source.alt;
      } else if (tag === 'a') {
        el.href = source.href;
        el.textContent = source.textContent;
      } else {
        el.innerHTML = source.innerHTML;
      }
    });
  });
})();
