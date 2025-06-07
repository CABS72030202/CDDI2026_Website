document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.gallery-container').forEach(initGallery);

  function initGallery(container) {
    const folder = container.getAttribute('data-folder');
    const track = container.querySelector('.gallery-track');

    const imageList = JSON.parse(container.getAttribute('data-images') || '[]');

    const prevArrow = document.createElement('button');
    prevArrow.className = 'gallery-arrow prev';
    prevArrow.innerHTML = '&larr;';
    prevArrow.addEventListener('click', () => scrollGallery(track, -1, container));

    const nextArrow = document.createElement('button');
    nextArrow.className = 'gallery-arrow next';
    nextArrow.innerHTML = '&rarr;';
    nextArrow.addEventListener('click', () => scrollGallery(track, 1, container));

    container.appendChild(prevArrow);
    container.appendChild(nextArrow);

    imageList.forEach(img => {
      const slide = document.createElement('div');
      slide.className = 'gallery-slide';
      slide.innerHTML = `<img src="assets/img/${folder}/${img}" alt="Gallery image">`;
      track.appendChild(slide);
    });

    setupIntersectionObserver(track, container);
  }

  function scrollGallery(track, direction) {
    const slides = track.querySelectorAll('.gallery-slide');
    const slideWidth = slides[0]?.offsetWidth || 300;
    const scrollAmount = direction * (slideWidth + 16);

    if (direction === 1 && track.scrollLeft + track.offsetWidth >= track.scrollWidth - 10) {
      track.scrollTo({ left: 0, behavior: 'auto' });
      setTimeout(() => {
        track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }, 50);
    } else if (direction === -1 && track.scrollLeft <= 10) {
      track.scrollTo({ left: track.scrollWidth, behavior: 'auto' });
      setTimeout(() => {
        track.scrollBy({ left: -slideWidth - 16, behavior: 'smooth' });
      }, 50);
    } else {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  }

  function setupIntersectionObserver(track) {
    const slides = track.querySelectorAll('.gallery-slide');
    if (slides.length < 2) return;

    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    track.prepend(lastClone);
    track.appendChild(firstClone);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === lastClone) {
            track.scrollTo({
              left: track.scrollWidth - (2 * entry.target.offsetWidth),
              behavior: 'auto'
            });
          } else if (entry.target === firstClone) {
            track.scrollTo({
              left: entry.target.offsetWidth,
              behavior: 'auto'
            });
          }
        }
      });
    }, {
      root: track,
      threshold: 0.5
    });

    observer.observe(firstClone);
    observer.observe(lastClone);
  }
});
