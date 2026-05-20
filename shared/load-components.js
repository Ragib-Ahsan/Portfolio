(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var cfg = window.SITE_CONFIG;
    if (!cfg) return;

    var currentPage = document.body.dataset.page || '';
    var inPages = document.body.hasAttribute('data-page-in-pages');

    function fullHref(href) {
      if (inPages) {
        if (href.indexOf('pages/') === 0) return href.replace('pages/', '');
        return '../' + href;
      }
      return href;
    }

    // ===== Render Desktop Nav =====
    function renderDesktopNav() {
      var container = document.getElementById('nav-desktop');
      if (!container) return;
      var linksHtml = '';
      cfg.links.forEach(function (l) {
        linksHtml += '<a data-page="' + l.id + '" href="' + fullHref(l.href) + '" class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors no-underline">' + esc(l.label) + '</a>';
      });
      container.innerHTML =
        '<nav class="bg-surface/70 backdrop-blur-xl w-full top-0 fixed z-50 border-b border-white/10 shadow-2xl shadow-black/50">' +
          '<div class="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto h-16">' +
            '<a href="' + fullHref(cfg.links[0].href) + '" class="font-label-md text-label-md font-bold tracking-tighter text-primary no-underline">' + esc(cfg.brand) + '</a>' +
            '<div class="hidden md:flex items-center gap-8">' + linksHtml + '</div>' +
            '<div class="flex items-center gap-2">' +
              '<a href="' + fullHref(cfg.resumeDownload) + '" download class="hidden lg:block bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded-full hover:scale-95 transition-transform no-underline">Download Resume</a>' +
              '<button id="menu-toggle" class="md:hidden flex items-center justify-center w-10 h-10 text-on-surface-variant hover:text-on-surface transition-colors" aria-label="Toggle menu">' +
                '<span class="material-symbols-outlined text-2xl">menu</span>' +
              '</button>' +
            '</div>' +
          '</div>' +
          '<div id="mobile-menu" class="fixed inset-0 z-50 pointer-events-none hidden">' +
            '<div id="menu-backdrop" class="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300"></div>' +
            '<div id="menu-panel" class="absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-surface border-l border-white/10 translate-x-full transition-transform duration-300 ease-in-out shadow-2xl">' +
              '<div class="flex justify-end p-4">' +
                '<button id="menu-close" class="flex items-center justify-center w-10 h-10 text-on-surface-variant hover:text-on-surface" aria-label="Close menu">' +
                  '<span class="material-symbols-outlined text-2xl">close</span>' +
                '</button>' +
              '</div>' +
              '<div class="flex flex-col gap-2 px-6 pb-8">' + getNavLinks('desktop-menu') +
                '<div class="mt-4 pt-4 border-t border-white/10">' +
                  '<a href="' + fullHref(cfg.resumeDownload) + '" download class="block text-center bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full no-underline">Download Resume</a>' +
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</nav>';
    }

    // ===== Render Tablet Nav =====
    function renderTabletNav() {
      var container = document.getElementById('nav-tablet');
      if (!container) return;
      var navLinks = '';
      var showPic = currentPage !== 'index';
      cfg.links.forEach(function (l) {
        navLinks += '<a data-page="' + l.id + '" href="' + fullHref(l.href) + '" class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface py-3 px-4 rounded-lg hover:bg-white/5 transition-colors no-underline">' + esc(l.label) + '</a>';
      });
      container.innerHTML =
        '<div class="mobile-face-topbar h-16 flex items-center justify-between px-margin-mobile z-50">' +
          '<div class="flex items-center gap-3">' +
            '<button id="drawer-toggle-t" class="flex items-center justify-center w-10 h-10 text-on-surface-variant hover:text-on-surface transition-colors" aria-label="Menu">' +
              '<span class="material-symbols-outlined text-2xl">menu</span>' +
            '</button>' +
            '<span class="font-label-md text-label-md font-bold tracking-tighter text-primary">' + esc(cfg.brand) + '</span>' +
          '</div>' +
          (showPic ? '<div class="w-10 h-10 rounded-full overflow-hidden border border-white/10">' +
            '<img alt="Ragib Ahsan" class="w-full h-full object-cover" src="' + fullHref('assets/DP/Ragib (2).png') + '"/>' +
          '</div>' : '') +
        '</div>' +
        '<div class="drawer-backdrop" id="drawer-backdrop-t"></div>' +
        '<div class="drawer-sheet" id="drawer-sheet-t">' +
          '<div class="flex justify-center pt-3 pb-2">' +
            '<div class="w-10 h-1 rounded-full bg-white/20"></div>' +
          '</div>' +
          '<div class="flex flex-col gap-1 px-6 pb-8">' +
            '<div class="flex items-center gap-4 p-4 mb-2 border-b border-white/10">' +
              '<div class="w-12 h-12 rounded-full overflow-hidden border border-white/10">' +
                '<img alt="Ragib Ahsan" class="w-full h-full object-cover" src="' + fullHref('assets/DP/Ragib (2).png') + '"/>' +
              '</div>' +
              '<div>' +
                '<p class="font-label-md text-label-md text-on-surface">Ragib Ahsan</p>' +
                '<p class="font-label-sm text-label-sm text-on-surface-variant">Product &amp; Project Manager</p>' +
              '</div>' +
            '</div>' + navLinks +
            '<div class="mt-4 pt-4 border-t border-white/10">' +
              '<a href="' + fullHref(cfg.resumeDownload) + '" download class="block text-center bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full no-underline">Download Resume</a>' +
            '</div>' +
          '</div>' +
        '</div>';
    }

    // ===== Render Mobile Nav =====
    function renderMobileNav() {
      var container = document.getElementById('nav-mobile');
      if (!container) return;
      var navLinks = '';
      var bottomLinks = '';
      var showPic = currentPage !== 'index';
      cfg.links.forEach(function (l) {
        var active = l.id === currentPage;
        navLinks += '<a data-page="' + l.id + '" href="' + fullHref(l.href) + '" class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface py-3 px-4 rounded-lg hover:bg-white/5 transition-colors no-underline">' + esc(l.label) + '</a>';
        bottomLinks +=
          '<a href="' + fullHref(l.href) + '" class="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-colors flex-1 py-1 no-underline' + (active ? ' mobile-nav-active' : '') + '" data-page="' + l.id + '">' +
            '<span class="material-symbols-outlined text-xl mobile-nav-icon">' + getIcon(l.id) + '</span>' +
            '<span class="text-[10px] mt-0.5 mobile-nav-label">' + esc(l.label) + '</span>' +
          '</a>';
      });
      container.innerHTML =
        '<div class="mobile-face-topbar h-16 flex items-center justify-between px-margin-mobile z-50">' +
          '<div class="flex items-center gap-3">' +
            '<button id="drawer-toggle" class="flex items-center justify-center w-10 h-10 text-on-surface-variant hover:text-on-surface transition-colors" aria-label="Menu">' +
              '<span class="material-symbols-outlined text-2xl">menu</span>' +
            '</button>' +
            '<span class="font-label-md text-label-md font-bold tracking-tighter text-primary">' + esc(cfg.brand) + '</span>' +
          '</div>' +
          (showPic ? '<div class="w-10 h-10 rounded-full overflow-hidden border border-white/10">' +
            '<img alt="Ragib Ahsan" class="w-full h-full object-cover" src="' + fullHref('assets/DP/Ragib (2).png') + '"/>' +
          '</div>' : '') +
        '</div>' +
        '<div class="drawer-backdrop" id="drawer-backdrop"></div>' +
        '<div class="drawer-sheet" id="drawer-sheet">' +
          '<div class="flex justify-center pt-3 pb-2">' +
            '<div class="w-10 h-1 rounded-full bg-white/20"></div>' +
          '</div>' +
          '<div class="flex flex-col gap-1 px-6 pb-8">' +
            '<div class="flex items-center gap-4 p-4 mb-2 border-b border-white/10">' +
              '<div class="w-12 h-12 rounded-full overflow-hidden border border-white/10">' +
                '<img alt="Ragib Ahsan" class="w-full h-full object-cover" src="' + fullHref('assets/DP/Ragib (2).png') + '"/>' +
              '</div>' +
              '<div>' +
                '<p class="font-label-md text-label-md text-on-surface">Ragib Ahsan</p>' +
                '<p class="font-label-sm text-label-sm text-on-surface-variant">Product &amp; Project Manager</p>' +
              '</div>' +
            '</div>' + navLinks +
            '<div class="mt-4 pt-4 border-t border-white/10">' +
              '<a href="' + fullHref(cfg.resumeDownload) + '" download class="block text-center bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full no-underline">Download Resume</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<nav class="mobile-face-bottomnav h-16 flex justify-around items-center px-2 pb-2">' + bottomLinks + '</nav>';
    }

    // ===== Render Footer =====
    function renderFooter() {
      var container = document.getElementById('site-footer');
      if (!container) return;
      container.innerHTML =
        '<footer class="bg-surface-container-lowest w-full border-t border-white/5">' +
          '<div class="flex flex-col md:flex-row justify-center items-center py-8 md:py-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-4">' +
            '<div class="font-label-sm text-label-sm text-secondary uppercase tracking-widest opacity-80">' + esc(cfg.copyright) + '</div>' +
          '</div>' +
        '</footer>';
    }

    function getNavLinks(context) {
      var html = '';
      cfg.links.forEach(function (l) {
        html += '<a data-page="' + l.id + '" href="' + fullHref(l.href) + '" class="font-label-md text-label-md text-on-surface-variant hover:text-on-surface py-3 px-4 rounded-lg hover:bg-white/5 transition-colors no-underline">' + esc(l.label) + '</a>';
      });
      return html;
    }

    function getIcon(id) {
      var icons = { index: 'home', resume: 'description', portfolio: 'folder', insights: 'lightbulb', contact: 'calendar_today' };
      return icons[id] || 'circle';
    }

    function esc(str) {
      var d = document.createElement('div');
      d.textContent = str || '';
      return d.innerHTML;
    }

    // ===== Render all faces =====
    renderDesktopNav();
    renderTabletNav();
    renderMobileNav();
    renderFooter();

    // ===== Highlight current page =====
    if (currentPage) {
      document.querySelectorAll('[data-page="' + currentPage + '"]').forEach(function (link) {
        link.classList.remove('text-on-surface-variant', 'hover:text-on-surface');
        link.classList.add('text-primary');
        if (link.closest('.hidden')) {
          link.classList.add('border-b-2', 'border-primary', 'pb-1');
        }
      });
    }

    // ===== Desktop mobile menu (slide-in) =====
    (function () {
      var toggle = document.getElementById('menu-toggle');
      var close = document.getElementById('menu-close');
      var backdrop = document.getElementById('menu-backdrop');
      var menu = document.getElementById('mobile-menu');
      if (!toggle || !menu) return;
      function open() {
        menu.classList.remove('hidden');
        document.documentElement.classList.add('mobile-menu-open');
        requestAnimationFrame(function () {
          var bd = document.getElementById('menu-backdrop');
          var mp = document.getElementById('menu-panel');
          if (bd) bd.classList.remove('opacity-0');
          if (mp) mp.classList.remove('translate-x-full');
        });
      }
      function closeMenu() {
        var bd = document.getElementById('menu-backdrop');
        var mp = document.getElementById('menu-panel');
        if (bd) bd.classList.add('opacity-0');
        if (mp) mp.classList.add('translate-x-full');
        setTimeout(function () {
          menu.classList.add('hidden');
          document.documentElement.classList.remove('mobile-menu-open');
        }, 300);
      }
      toggle.addEventListener('click', open);
      if (close) close.addEventListener('click', closeMenu);
      if (backdrop) backdrop.addEventListener('click', closeMenu);
    })();

    // ===== Mobile bottom drawer =====
    (function () {
      var toggle = document.getElementById('drawer-toggle');
      var sheet = document.getElementById('drawer-sheet');
      var backdrop = document.getElementById('drawer-backdrop');
      if (!toggle || !sheet) return;
      function openSheet() {
        sheet.classList.add('open');
        if (backdrop) backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
      function closeSheet() {
        sheet.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
        document.body.style.overflow = '';
      }
      toggle.addEventListener('click', openSheet);
      if (backdrop) backdrop.addEventListener('click', closeSheet);
      sheet.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeSheet);
      });
    })();

    // ===== Tablet drawer =====
    (function () {
      var toggle = document.getElementById('drawer-toggle-t');
      var sheet = document.getElementById('drawer-sheet-t');
      var backdrop = document.getElementById('drawer-backdrop-t');
      if (!toggle || !sheet) return;
      function openSheet() {
        sheet.classList.add('open');
        if (backdrop) backdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
      function closeSheet() {
        sheet.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
        document.body.style.overflow = '';
      }
      toggle.addEventListener('click', openSheet);
      if (backdrop) backdrop.addEventListener('click', closeSheet);
      sheet.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', closeSheet);
      });
    })();

    // ===== Reading Progress Bar (mobile only) =====
    (function () {
      var bar = document.getElementById('reading-progress-bar');
      var container = document.getElementById('reading-progress');
      if (!bar || !container) return;
      window.addEventListener('scroll', function () {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        bar.style.width = pct + '%';
      });
    })();
  });
})();
