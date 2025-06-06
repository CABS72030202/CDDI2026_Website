document.addEventListener('DOMContentLoaded', function() {
  // Initialize all galleries on the page
  document.querySelectorAll('.gallery-container').forEach(initGallery);
  
  function initGallery(container) {
    const folder = container.getAttribute('data-folder');
    const track = container.querySelector('.gallery-track');
    
    // Create arrows
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
    
    // Load images
    const imageNames = [
      'UQTR-5878.jpg', 
      'UQTR-6373.jpg', 
      'UQTR-6643.jpg'
    ];
    
    imageNames.forEach(img => {
      const slide = document.createElement('div');
      slide.className = 'gallery-slide';
      slide.innerHTML = `<img src="assets/img/${folder}/${img}" alt="Gallery image">`;
      track.appendChild(slide);
    });

    // Initialize IntersectionObserver for infinite loop detection
    setupIntersectionObserver(track, container);
  }
  
  function scrollGallery(track, direction, container) {
    const slides = track.querySelectorAll('.gallery-slide');
    const slideWidth = slides[0]?.offsetWidth || 300;
    const scrollAmount = direction * (slideWidth + 16);
    
    // Check if we're at the end or beginning
    if (direction === 1 && track.scrollLeft + track.offsetWidth >= track.scrollWidth - 10) {
      // At the end - scroll to beginning instantly
      track.scrollTo({
        left: 0,
        behavior: 'auto'
      });
      // Then do a small smooth scroll for better UX
      setTimeout(() => {
        track.scrollBy({
          left: scrollAmount,
          behavior: 'smooth'
        });
      }, 50);
    } 
    else if (direction === -1 && track.scrollLeft <= 10) {
      // At the beginning - scroll to end instantly
      track.scrollTo({
        left: track.scrollWidth,
        behavior: 'auto'
      });
      // Then do a small smooth scroll for better UX
      setTimeout(() => {
        track.scrollBy({
          left: -slideWidth - 16,
          behavior: 'smooth'
        });
      }, 50);
    }
    else {
      // Normal scroll
      track.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  function setupIntersectionObserver(track, container) {
    const slides = track.querySelectorAll('.gallery-slide');
    if (slides.length < 2) return;

    // Clone first and last slides for seamless looping
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    
    track.prepend(lastClone);
    track.appendChild(firstClone);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // If we're seeing the first clone (which is actually the last slide)
          if (entry.target === lastClone) {
            track.scrollTo({
              left: track.scrollWidth - (2 * entry.target.offsetWidth),
              behavior: 'auto'
            });
          }
          // If we're seeing the last clone (which is actually the first slide)
          else if (entry.target === firstClone) {
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