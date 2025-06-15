document.addEventListener('DOMContentLoaded', function() {
  const tabItems = document.querySelectorAll('.tab-item');
  
  tabItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remove active class from all tabs and content
      document.querySelectorAll('.tab-item').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked tab
      this.classList.add('active');
      
      // Show corresponding content
      const tabId = this.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
});