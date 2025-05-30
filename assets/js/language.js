let currentLang = "fr";

document.addEventListener("DOMContentLoaded", () => {
  const langToggle = document.getElementById("lang-toggle");
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  // Language toggle functionality
  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "fr" : "en";
    langToggle.textContent = currentLang === "en" ? "FR" : "EN";
    updateLanguage();
  });

  // Mobile menu toggle functionality
  menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('active');
  });

  function updateLanguage() {
    document.querySelectorAll("[data-en]").forEach(el => {
      el.textContent = el.getAttribute(`data-${currentLang}`);
    });
  }

  updateLanguage(); // set FR initially
});
