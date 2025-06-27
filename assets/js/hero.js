document.querySelectorAll('.main-nav a').forEach(function(link) {
  link.addEventListener('click', function() {
    sessionStorage.setItem('animate-hero', '1');
  });
});

window.addEventListener('DOMContentLoaded', function() {
  const heroes = document.querySelectorAll('.hero');

  if (sessionStorage.getItem('animate-hero')) {
    sessionStorage.removeItem('animate-hero');
    setTimeout(function() {
      heroes.forEach(hero => hero.classList.add('visible'));
    }, 10);
  } else {
    heroes.forEach(hero => hero.classList.add('visible'));
  }
});
