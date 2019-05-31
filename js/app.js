// Add target blank to all post links
window.onload = function () {
    document.querySelectorAll('.blog a').forEach(a => a.setAttribute('target', '_blank'));
}
