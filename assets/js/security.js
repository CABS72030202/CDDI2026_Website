document.addEventListener('contextmenu', function (e) {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});
console.log("%Images are protected by copyright.", "color: red; font-size: 2em;");
