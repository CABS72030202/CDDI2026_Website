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

    // Add preview containers
    let previewPrev = document.createElement('div');
    previewPrev.className = 'gallery-preview gallery-preview-prev';
    let previewNext = document.createElement('div');
    previewNext.className = 'gallery-preview gallery-preview-next';
    gallery.appendChild(previewPrev);
    gallery.appendChild(previewNext);

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

    // Set initial position (showing first real slide)
    track.style.transform = `translateX(-${100 * currentIndex}%)`;

    function updatePreviews() {
      // Calculate real indices for previews
      let prevIdx = currentIndex - 1;
      let nextIdx = currentIndex + 1;
      const slides = track.querySelectorAll('.gallery-slide');
      const totalSlides = slides.length;

      // Handle clones for infinite loop
      if (prevIdx < 0) prevIdx = totalSlides - 2;
      if (nextIdx > totalSlides - 1) nextIdx = 1;
      // Don't show preview if only one image
      if (totalSlides <= 3) {
        previewPrev.innerHTML = '';
        previewNext.innerHTML = '';
        return;
      }
      // Set preview images
      let prevImg = slides[prevIdx].querySelector('img');
      let nextImg = slides[nextIdx].querySelector('img');
      previewPrev.innerHTML = prevImg ? `<img src="${prevImg.src || prevImg.getAttribute('data-src')}" alt="" />` : '';
      previewNext.innerHTML = nextImg ? `<img src="${nextImg.src || nextImg.getAttribute('data-src')}" alt="" />` : '';
    }

    function goToSlide(index, direction) {
      if (isAnimating) return;
      
      isAnimating = true;
      currentIndex = index;
      
      // Use a smoother transition
      track.style.transition = 'transform 0.6s cubic-bezier(0.77, 0, 0.175, 1)';
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Load next image if it's lazy loaded
      const slides = track.querySelectorAll('.gallery-slide');
      const nextImg = slides[currentIndex].querySelector('img[data-src]');
      if (nextImg) {
        nextImg.src = nextImg.getAttribute('data-src');
        nextImg.removeAttribute('data-src');
      }

      track.addEventListener('transitionend', function onTransitionEnd() {
        track.removeEventListener('transitionend', onTransitionEnd);
        
        // If we're at the clone of the last slide (index totalSlides-1), jump to real first slide (index 1)
        if (currentIndex === slides.length - 1) {
          // Use requestAnimationFrame to avoid flicker
          requestAnimationFrame(() => {
            track.style.transition = 'none';
            track.style.transform = `translateX(-${1 * 100}%)`;
            currentIndex = 1;
            // Force reflow to apply the transform instantly
            void track.offsetWidth;
            // Restore transition for next moves
            requestAnimationFrame(() => {
              track.style.transition = 'transform 0.6s cubic-bezier(0.77, 0, 0.175, 1)';
            });
          });
        }
        // If we're at the clone of the first slide (index 0), jump to real last slide (index totalSlides-2)
        else if (currentIndex === 0) {
          requestAnimationFrame(() => {
            track.style.transition = 'none';
            track.style.transform = `translateX(-${(slides.length - 2) * 100}%)`;
            currentIndex = slides.length - 2;
            void track.offsetWidth;
            requestAnimationFrame(() => {
              track.style.transition = 'transform 0.6s cubic-bezier(0.77, 0, 0.175, 1)';
            });
          });
        }
        
        isAnimating = false;
        updatePreviews();
      }, { once: true });
      updatePreviews();
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

    const slides = track.querySelectorAll('.gallery-slide');
    slides.forEach(slide => observer.observe(slide));

    // Initial preview update
    updatePreviews();
  }
});