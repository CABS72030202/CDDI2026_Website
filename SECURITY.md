# Politique de sécurité / Security Policy

## FRANÇAIS

### 🔍 Signalement d'une vulnérabilité

Merci de contribuer à la sécurité de ce site.

Si vous découvrez une faille de sécurité (ex. script malicieux, image vulnérable, fichier exposé...), veuillez la signaler immédiatement à :

📧 **communications@cse.cfes.ca**

Nous vous remercions de ne pas divulguer publiquement la vulnérabilité tant qu’elle n’a pas été corrigée.

---

### 📌 Portée

Ce site est statique (HTML, CSS, JS), sans base de données ni serveur dynamique. Les principaux vecteurs de risque concernent :

- Scripts externes ou injections (XSS),
- Fichiers accessibles par erreur (archives, sauvegardes, fichiers temporaires),
- Mauvaise configuration de l’hébergement.

---

### 🔐 Bonnes pratiques appliquées

- HTTPS activé par défaut (via GitHub Pages),
- Politique CSP (Content-Security-Policy) ajoutée à chaque page,
- Aucun fichier sensible présent dans le dépôt.

---

### 📋 Résumé des fonctionnalités et pratiques de sécurité

- **Politique de sécurité du contenu (CSP) et en-têtes de sécurité** :
  - Tous les fichiers HTML définissent une politique de sécurité du contenu (CSP) stricte pour restreindre les sources des scripts, styles, polices, images et autres ressources, aidant à prévenir les attaques XSS et les injections de données.
  - En-têtes supplémentaires :
    - `X-Content-Type-Options: nosniff`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy` désactive la caméra, le microphone, la géolocalisation et le suivi des cohortes d'intérêts.
    - `X-UA-Compatible: IE=edge`
- **Protection des images et du contenu** :
  - Le CSS désactive la sélection et le glisser-déposer pour les images et le contenu sensible.
  - JavaScript désactive le clic droit, le glisser-déposer et certains raccourcis clavier (F12, Ctrl+Shift+I/J/C, Ctrl+U) pour empêcher l'accès aux outils de développement et à la visualisation du code source.
  - La console est effacée et un avertissement de copyright est affiché.
- **Protections lors de l'impression et en mode développeur** :
  - Les images et les éléments `.no-print` sont masqués lors de l'impression.
  - Les barres de défilement sont masquées en cas de détection du mode développeur.
- **Sécurité des formulaires** :
  - Le formulaire de contact utilise des requêtes POST vers Formspree avec `Accept: application/json` et désactive le bouton de soumission pendant l'envoi pour éviter les soumissions doubles.
- **Restrictions d'accès aux répertoires et fichier Robots.txt** :
  - `robots.txt` interdit le crawl des répertoires sensibles comme `/assets/`, `/.git/`, et `/node_modules/`.
- **Mise à niveau et blocage du contenu mixte** :
  - La CSP inclut `upgrade-insecure-requests` et `block-all-mixed-content` pour imposer HTTPS et prévenir le contenu mixte.
- **Pas d'analytique ou de trackers tiers** :
  - Aucun script d'analytique ou de suivi n'est présent dans le code.
- **Intégrité des ressources externes** :
  - Il existe une fonction dans `security.js` pour vérifier l'intégrité des ressources externes (bien que les attributs SRI réels ne soient pas affichés dans le HTML).

---

Merci pour votre vigilance.

## ENGLISH

### 🔍 Reporting a Vulnerability

Thank you for helping keep this site secure.

If you discover a security vulnerability (e.g., malicious script, exposed file, vulnerable image...), please report it immediately to:

📧 **communications@cse.cfes.ca**

We kindly ask you **not to publicly disclose the vulnerability** until it has been properly addressed.

---

### 📌 Scope

This website is static (HTML, CSS, JS), with no database or dynamic backend. The main potential risks include:

- External scripts or injection (XSS),
- Mistakenly exposed files (archives, backups, temporary files),
- Improper hosting configuration.

---

### 🔐 Applied Security Measures

- HTTPS enforced by default (via GitHub Pages),
- Content-Security-Policy (CSP) headers applied to all pages,
- No sensitive files are present in the repository.

---

### 📋 Summary of Security Features and Practices

- **Content Security Policy (CSP) and Security Headers**:
  - All HTML files set a strict Content Security Policy (CSP) to restrict sources for scripts, styles, fonts, images, and other resources, helping to prevent XSS and data injection attacks.
  - Additional headers include:
    - `X-Content-Type-Options: nosniff`
    - `Referrer-Policy: strict-origin-when-cross-origin`
    - `Permissions-Policy` disables camera, microphone, geolocation, and interest-cohort.
    - `X-UA-Compatible: IE=edge`
- **Image and Content Protection**:
  - CSS disables user selection and dragging for images and sensitive content.
  - JavaScript disables right-click, drag-and-drop, and certain keyboard shortcuts (F12, Ctrl+Shift+I/J/C, Ctrl+U) to hinder developer tools and source viewing.
  - Console is cleared and a copyright warning is displayed.
- **Print and Developer Mode Protections**:
  - Images and `.no-print` elements are hidden when printing.
  - Scrollbars are hidden in developer mode detection.
- **Form Security**:
  - The contact form uses POST requests to Formspree with `Accept: application/json` and disables the submit button during submission to prevent double submissions.
- **Robots.txt and Directory Access Restrictions**:
  - `robots.txt` disallows crawling of sensitive directories like `/assets/`, `/.git/`, and `/node_modules/`.
- **Upgrade and Block Mixed Content**:
  - CSP includes `upgrade-insecure-requests` and `block-all-mixed-content` to enforce HTTPS and prevent mixed content.
- **No Third-Party Analytics or Trackers**:
  - No analytics or tracking scripts are present in the codebase.
- **External Resource Integrity**:
  - There is a function in `security.js` for verifying the integrity of external resources (though actual SRI attributes are not shown in the HTML).

---

Thank you for your vigilance.
