document.addEventListener("DOMContentLoaded", () => {
  const langToggle = document.getElementById("lang-toggle");
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  // Load saved language from localStorage, default to 'fr'
  let currentLang = localStorage.getItem("lang") || "fr";

  // Set the toggle button label
  langToggle.textContent = currentLang === "en" ? "FR" : "EN";

  // Apply the language to the page
  updateLanguage();

  // Language toggle functionality
  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "fr" : "en";
    localStorage.setItem("lang", currentLang); // Save the new language
    langToggle.textContent = currentLang === "en" ? "FR" : "EN";
    updateLanguage();
  });

  // Mobile menu toggle functionality
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });
  }

  function updateLanguage() {
    document.querySelectorAll("[data-en]").forEach(el => {
      const newContent = el.getAttribute(`data-${currentLang}`);

      if (el.tagName === "A" && newContent.startsWith("./")) {
        el.setAttribute("href", newContent);
      } else {
        el.textContent = newContent;
      }
    });
  }
});
