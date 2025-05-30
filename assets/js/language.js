let currentLang = "en";

document.addEventListener("DOMContentLoaded", () => {
  const langToggle = document.getElementById("lang-toggle");

  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "fr" : "en";
    langToggle.textContent = currentLang === "en" ? "FR" : "EN";
    updateLanguage();
  });

  function updateLanguage() {
    document.querySelectorAll("[data-en]").forEach(el => {
      el.textContent = el.getAttribute(`data-${currentLang}`);
    });
  }
});
