document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.blog-post p').forEach(function (paragraph) {
    if (/^\u3000{2}/.test(paragraph.textContent)) {
      paragraph.classList.add('has-manual-indent');
    }
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
