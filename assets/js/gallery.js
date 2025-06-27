document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.gallery-container').forEach(initGallery);

  function initGallery(container) {
    const folder = container.getAttribute('data-folder');
    const prefix = container.getAttribute('data-prefix') || 'image';
    const count = parseInt(container.getAttribute('data-count') || '0');
    const extension = container.getAttribute('data-extension') || 'png';

    const track = container.querySelector('.gallery-track');

    // Create navigation arrows
    const prevArrow = document.createElement('button');
    prevArrow.className = 'gallery-arrow prev';
    prevArrow.type = 'button';
    // No innerHTML, icon will be set via CSS
    prevArrow.addEventListener('click', () => scrollGallery(track, -1));

    const nextArrow = document.createElement('button');
    nextArrow.className = 'gallery-arrow next';
    nextArrow.type = 'button';
    // No innerHTML, icon will be set via CSS
    nextArrow.addEventListener('click', () => scrollGallery(track, 1));

    container.appendChild(prevArrow);
    container.appendChild(nextArrow);

    // Generate file names
    const imageList = [];
    for (let i = 1; i <= count; i++) {
      imageList.push(`${prefix}${i}.${extension}`);
    }

    // Load images into gallery (use data-src for lazy loading)
    imageList.forEach((img, idx) => {
      const slide = document.createElement('div');
      slide.className = 'gallery-slide';
      // Only first image gets src immediately, others use data-src
      if (idx === 0) {
        slide.innerHTML = `<img src="assets/img/${folder}/${img}" alt="Gallery image"
          loading="eager"
          decoding="async"
          fetchpriority="high"
        >`;
      } else {
        slide.innerHTML = `<img data-src="assets/img/${folder}/${img}" alt="Gallery image"
          loading="lazy"
          decoding="async"
        >`;
      }
      track.appendChild(slide);
    });

    setupIntersectionObserver(track);
    setupImageLazyLoading(track);
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

  function setupImageLazyLoading(track) {
    const images = track.querySelectorAll('img[data-src]');
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all images if IntersectionObserver is not supported
      images.forEach(img => {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      });
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          obs.unobserve(img);
        }
      });
    }, {
      root: track,
      threshold: 0.1
    });
    images.forEach(img => observer.observe(img));
  }
});