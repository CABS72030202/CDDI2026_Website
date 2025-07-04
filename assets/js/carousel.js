document.addEventListener('DOMContentLoaded', function () {
  const items = document.querySelectorAll('.carousel-item');
  const indicators = document.querySelectorAll('.carousel-indicator');
  let currentIndex = 0;
  const totalItems = items.length;
  let isSliding = false;
  const transitionDuration = 950;

  items.forEach((item, idx) => {
    item.style.position = 'absolute';
    item.style.top = 0;
    item.style.left = 0;
    item.style.width = '100%';
    item.style.transition = `transform ${transitionDuration}ms cubic-bezier(.77,0,.18,1), translate 0.2s ease, box-shadow 0.2s ease`;
    item.style.transform = idx === currentIndex ? 'translateX(0)' : 'translateX(100%)';
    item.style.zIndex = idx === currentIndex ? 2 : 1;
  });

  function slideTo(nextIndex) {
    if (isSliding || nextIndex === currentIndex) return;
    isSliding = true;

    items[currentIndex].style.zIndex = 2;
    items[nextIndex].style.zIndex = 3;
    items[nextIndex].style.transform = 'translateX(100%)';
    items[nextIndex].classList.add('active');
    indicators[currentIndex].classList.remove('active');
    indicators[nextIndex].classList.add('active');

    void items[nextIndex].offsetWidth;

    items[currentIndex].style.transform = 'translateX(-100%)';
    items[nextIndex].style.transform = 'translateX(0)';

    setTimeout(() => {
      items[currentIndex].classList.remove('active');
      items[currentIndex].style.zIndex = 1;
      items[nextIndex].style.zIndex = 2;
      currentIndex = nextIndex;
      isSliding = false;
    }, transitionDuration);
  }

  let rotateInterval = setInterval(() => {
    slideTo((currentIndex + 1) % totalItems);
  }, 5000);

  // Pause carousel on hover
  const carousel = document.querySelector('.carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', () => {
      clearInterval(rotateInterval);
    });

    carousel.addEventListener('mouseleave', () => {
      rotateInterval = setInterval(() => {
        slideTo((currentIndex + 1) % totalItems);
      }, 5000);
    });
  }

  indicators.forEach(indicator => {
    indicator.addEventListener('click', function () {
      clearInterval(rotateInterval);
      rotateInterval = setInterval(() => {
        slideTo((currentIndex + 1) % totalItems);
      }, 5000);
      const targetIndex = parseInt(this.getAttribute('data-index'));
      slideTo(targetIndex);
    });
  });
});
