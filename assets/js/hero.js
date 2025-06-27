// Add click handler to navigation links to set animation flag
document.querySelectorAll('.main-nav a').forEach(function(link) {
  link.addEventListener('click', function() {
    sessionStorage.setItem('animate-hero', '1');
  });
});

window.addEventListener('DOMContentLoaded', function() {
  // Animate hero if flag is set or on first load
  if (sessionStorage.getItem('animate-hero')) {
    sessionStorage.removeItem('animate-hero');
    setTimeout(function() {
      document.querySelector('.hero')?.classList.add('visible');
    }, 10); // slight delay to ensure CSS applies
  } else {
    document.querySelector('.hero')?.classList.add('visible');
  }
});
