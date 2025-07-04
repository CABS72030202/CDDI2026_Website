/**
 * Accordion functionality for the Things to Do section
 */

document.addEventListener('DOMContentLoaded', function() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    // Initialize accordion functionality
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        // Add click event listener to header
        header.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all accordion items
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherContent = otherItem.querySelector('.accordion-content');
                otherContent.style.maxHeight = '0';
            });
            
            // If this item wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                
                // Remove any inline max-height to let CSS handle it
                content.style.maxHeight = '';
                
                // Scroll the accordion item into view smoothly
                setTimeout(() => {
                    item.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 100);
            }
        });
        
        // Add keyboard accessibility
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
        
        // Make header focusable for keyboard navigation
        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
        
        // Add aria-label for screen readers
        const categoryText = header.querySelector('h3').textContent;
        header.setAttribute('aria-label', `Toggle ${categoryText} section`);
        
        // Update aria-expanded when item becomes active
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isActive = item.classList.contains('active');
                    header.setAttribute('aria-expanded', isActive.toString());
                }
            });
        });
        
        observer.observe(item, {
            attributes: true,
            attributeFilter: ['class']
        });
    });
    
    // Optional: Auto-open first accordion item on page load
    // Uncomment the lines below if you want the first item to be open by default
    /*
    if (accordionItems.length > 0) {
        const firstItem = accordionItems[0];
        const firstContent = firstItem.querySelector('.accordion-content');
        firstItem.classList.add('active');
        firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
    }
    */
    
    // Handle window resize to recalculate heights
    window.addEventListener('resize', function() {
        accordionItems.forEach(item => {
            if (item.classList.contains('active')) {
                const content = item.querySelector('.accordion-content');
                
                // Remove any inline max-height to let CSS handle it
                content.style.maxHeight = '';
            }
        });
    });
    
    // Animation observer for activity cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    };
    
    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.querySelectorAll('.activity-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.animation = `slideInFade 0.5s ease forwards`;
                    }, index * 100);
                });
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe activity grids for animation
    const activityGrids = document.querySelectorAll('.activity-grid');
    activityGrids.forEach(grid => {
        cardObserver.observe(grid);
    });
});
