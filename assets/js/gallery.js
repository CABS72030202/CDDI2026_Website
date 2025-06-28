document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.gallery-container').forEach(initGallery);

  function initGallery(container) {
    const folder = container.getAttribute('data-folder');
    const prefix = container.getAttribute('data-prefix') || 'image';
    const count = parseInt(container.getAttribute('data-count') || '0');
    const extension = container.getAttribute('data-extension') || 'png';

    const gallery = container.querySelector('.gallery');
    const track = container.querySelector('.gallery-track');
    const prevBtn = container.querySelector('.gallery-arrow.prev');
    const nextBtn = container.querySelector('.gallery-arrow.next');

    let currentIndex = 1; // Start at 1 because we'll add clones
    let isAnimating = false;
    let slideInterval;

    // Generate file names
    const imageList = [];
    for (let i = 1; i <= count; i++) {
      imageList.push(`${prefix}${i}.${extension}`);
    }

    // Clear existing slides
    track.innerHTML = '';

    // Add clone of last image at the beginning
    if (imageList.length > 1) {
      const lastSlide = document.createElement('div');
      lastSlide.className = 'gallery-slide';
      lastSlide.innerHTML = `<img src="assets/img/${folder}/${imageList[imageList.length - 1]}" alt="Gallery image">`;
      track.appendChild(lastSlide);
    }

    // Add all original images
    imageList.forEach((img) => {
      const slide = document.createElement('div');
      slide.className = 'gallery-slide';
      slide.innerHTML = `<img data-src="assets/img/${folder}/${img}" alt="Gallery image"
        loading="lazy"
        decoding="async">`;
      track.appendChild(slide);
    });

    // Add clone of first image at the end
    if (imageList.length > 1) {
      const firstSlide = document.createElement('div');
      firstSlide.className = 'gallery-slide';
      firstSlide.innerHTML = `<img src="assets/img/${folder}/${imageList[0]}" alt="Gallery image">`;
      track.appendChild(firstSlide);
    }

    const slides = track.querySelectorAll('.gallery-slide');
    const realSlideCount = imageList.length;
    const totalSlides = slides.length;

    // Set initial position (showing first real slide)
    track.style.transform = `translateX(-${100 * currentIndex}%)`;

    function goToSlide(index, direction) {
      if (isAnimating) return;
      
      isAnimating = true;
      currentIndex = index;
      
      // Enable transition
      track.style.transition = 'transform 0.5s ease-in-out';
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Load next image if it's lazy loaded
      const nextImg = slides[currentIndex].querySelector('img[data-src]');
      if (nextImg) {
        nextImg.src = nextImg.getAttribute('data-src');
        nextImg.removeAttribute('data-src');
      }

      track.addEventListener('transitionend', function onTransitionEnd() {
        track.removeEventListener('transitionend', onTransitionEnd);
        
        // If we're at the clone of the last slide (index totalSlides-1), jump to real first slide (index 1)
        if (currentIndex === totalSlides - 1) {
          track.style.transition = 'none';
          currentIndex = 1;
          track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        // If we're at the clone of the first slide (index 0), jump to real last slide (index totalSlides-2)
        else if (currentIndex === 0) {
          track.style.transition = 'none';
          currentIndex = totalSlides - 2;
          track.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
        
        isAnimating = false;
      }, { once: true });
    }

    function nextSlide() {
      goToSlide(currentIndex + 1, 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1, -1);
    }

    // Set up event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    function startAutoSlide() {
      slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
      clearInterval(slideInterval);
    }

    // Start auto-advance
    startAutoSlide();

    // Pause on hover
    gallery.addEventListener('mouseenter', stopAutoSlide);
    gallery.addEventListener('mouseleave', startAutoSlide);

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });

    // Load images that are in view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target.querySelector('img[data-src]');
          if (img) {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
          }
        }
      });
    }, { threshold: 0.1 });

    slides.forEach(slide => observer.observe(slide));
  }
});