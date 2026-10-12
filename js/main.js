document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.blog-post p').forEach(function (paragraph) {
    if (/^\u3000{2}/.test(paragraph.textContent)) {
      paragraph.classList.add('has-manual-indent');
    }
  });

  var themeButton = document.querySelector('.theme-toggle');
  function updateThemeButton() {
    if (!themeButton) return;
    var dark = document.documentElement.dataset.theme === 'dark';
    themeButton.innerHTML = '<span aria-hidden="true">' + (dark ? '☀' : '☾') + '</span>';
    themeButton.title = dark ? '切换到常规配色' : '切换到暗色配色';
    themeButton.setAttribute('aria-label', dark ? '切换到常规配色' : '切换到暗色配色');
    themeButton.setAttribute('aria-pressed', String(dark));
  }
  updateThemeButton();
  if (themeButton) themeButton.addEventListener('click', function () {
    var theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try { localStorage.setItem('blog-theme', theme); } catch (e) {}
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#191b1f' : '#f6f3ed';
    updateThemeButton();
  });

  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', function () {
    var open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    links.classList.toggle('is-open', !open);
  });
});
