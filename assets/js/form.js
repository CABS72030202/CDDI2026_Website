// Form submission handler
    document.addEventListener('DOMContentLoaded', function() {
      const form = document.getElementById('contactForm');
      const successMessage = document.getElementById('success-message');
      const errorMessage = document.getElementById('error-message');
      
      if(form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Show loading state
          const submitBtn = form.querySelector('button[type="submit"]');
          const originalText = submitBtn.innerHTML;
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + (submitBtn.getAttribute('data-en') || submitBtn.textContent);
          submitBtn.disabled = true;
          
          // Prepare form data
          const formData = new FormData(form);

          // MOCK fetch for testing (choose one: success or error)
          /* --- Success mock ---
          setTimeout(() => {
            form.style.display = 'none';
            successMessage.style.display = 'block';
            errorMessage.style.display = 'none';
            successMessage.scrollIntoView({ behavior: 'smooth' });
          }, 1000); */

          /* --- Error mock ---
          setTimeout(() => {
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            errorMessage.scrollIntoView({ behavior: 'smooth' });
          }, 1000); */

          // Uncomment below for real submission
          fetch('https://formspree.io/f/xqabworl', {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          })
          .then(response => {
            if (response.ok) {
              form.style.display = 'none';
              successMessage.style.display = 'block';
              errorMessage.style.display = 'none';
              successMessage.scrollIntoView({ behavior: 'smooth' });
            } else {
              throw new Error('Network response was not ok');
            }
          })
          .catch(() => {
            errorMessage.style.display = 'block';
            successMessage.style.display = 'none';
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            errorMessage.scrollIntoView({ behavior: 'smooth' });
          });
        });
      }
    });