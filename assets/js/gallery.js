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
      const slides = track.querySelectorAll('.gallery-slide');
      const totalSlides = slides.length;
      
      // Don't show previews if only one image or during transitions
      if (totalSlides <= 3 || isAnimating) {
        previewPrev.innerHTML = '';
        previewNext.innerHTML = '';
        return;
      }

      // Calculate real indices, accounting for clones
      let realCurrentIndex = currentIndex;
      
      // If we're at a clone, calculate the real index
      if (currentIndex === 0) {
        realCurrentIndex = totalSlides - 2; // Last real image
      } else if (currentIndex === totalSlides - 1) {
        realCurrentIndex = 1; // First real image
      }
      
      // Calculate preview indices based on real position
      let prevRealIdx = realCurrentIndex - 1;
      let nextRealIdx = realCurrentIndex + 1;
      
      // Handle wraparound for real indices
      if (prevRealIdx < 1) prevRealIdx = totalSlides - 2;
      if (nextRealIdx > totalSlides - 2) nextRealIdx = 1;
      
      // Get the actual slide elements
      let prevImg = slides[prevRealIdx].querySelector('img');
      let nextImg = slides[nextRealIdx].querySelector('img');
      
      // Update preview content, but avoid showing duplicates
      if (prevImg && prevRealIdx !== realCurrentIndex) {
        const imgSrc = prevImg.src || prevImg.getAttribute('data-src');
        previewPrev.innerHTML = `<img src="${imgSrc}" alt="Previous image" />`;
        previewPrev.style.opacity = '0.6';
      } else {
        previewPrev.innerHTML = '';
      }
      
      if (nextImg && nextRealIdx !== realCurrentIndex) {
        const imgSrc = nextImg.src || nextImg.getAttribute('data-src');
        previewNext.innerHTML = `<img src="${imgSrc}" alt="Next image" />`;
        previewNext.style.opacity = '0.6';
      } else {
        previewNext.innerHTML = '';
      }
      
      // Add hover effects
      setTimeout(() => {
        previewPrev.style.opacity = previewPrev.innerHTML ? '0.6' : '0';
        previewNext.style.opacity = previewNext.innerHTML ? '0.6' : '0';
      }, 50);
    }

    function goToSlide(index, direction) {
      if (isAnimating) return;
      
      isAnimating = true;
      
      // Temporarily hide previews during transition to prevent confusion
      previewPrev.style.opacity = '0';
      previewNext.style.opacity = '0';
      
      currentIndex = index;
      
      // Use improved transition timing
      track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Preload next images for smoother experience
      const slides = track.querySelectorAll('.gallery-slide');
      const currentImg = slides[currentIndex].querySelector('img[data-src]');
      if (currentImg) {
        currentImg.src = currentImg.getAttribute('data-src');
        currentImg.removeAttribute('data-src');
      }
      
      // Preload adjacent images
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;
      const nextIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;
      
      [prevIndex, nextIndex].forEach(idx => {
        const img = slides[idx].querySelector('img[data-src]');
        if (img) {
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
        }
      });

      track.addEventListener('transitionend', function onTransitionEnd() {
        track.removeEventListener('transitionend', onTransitionEnd);
        
        // Handle infinite loop clone jumps
        if (currentIndex === slides.length - 1) {
          // At clone of first slide, jump to real first slide
          requestAnimationFrame(() => {
            track.style.transition = 'none';
            track.style.transform = `translateX(-${1 * 100}%)`;
            currentIndex = 1;
            void track.offsetWidth;
            requestAnimationFrame(() => {
              track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
              isAnimating = false;
              updatePreviews();
            });
          });
        } else if (currentIndex === 0) {
          // At clone of last slide, jump to real last slide
          requestAnimationFrame(() => {
            track.style.transition = 'none';
            track.style.transform = `translateX(-${(slides.length - 2) * 100}%)`;
            currentIndex = slides.length - 2;
            void track.offsetWidth;
            requestAnimationFrame(() => {
              track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
              isAnimating = false;
              updatePreviews();
            });
          });
        } else {
          isAnimating = false;
          updatePreviews();
        }
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

    const slides = track.querySelectorAll('.gallery-slide');
    slides.forEach(slide => observer.observe(slide));

    // Initial preview update
    updatePreviews();
  }
});