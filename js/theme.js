const elems = "body, header, span.theme-switcher, .social-links, main, .about-container, .share-container, footer";

// set the default theme when the doc is ready
docReady(setDefaultTheme);

function docReady(fn) {
  // see if DOM is already available
  if (document.readyState === "complete" || document.readyState === "interactive") {
      // call on next available tick
      setTimeout(fn, 1);
  } else {
      document.addEventListener("DOMContentLoaded", fn);
  }
}    

function setDefaultTheme() {
  let theme = localStorage.getItem('opeonikute-theme');

  // dark is the site default
  if (!theme) {
    theme = 'dark';
  }

  setTheme(theme);
}

function switchTheme() {
  // get current theme from local storage
  let theme = localStorage.getItem('opeonikute-theme');
  
  // switch the theme
  theme = (theme === 'dark') ? 'light' : 'dark';

  setTheme(theme);
}

function setTheme(theme) {
    // if theme is light, add "light-theme" class to all relevant elements
  // if theme is dark, remove light-theme class from all relevant elements  
  switch(theme) {
    case "light":
      addLightClassToThemeElements();
      break;
    case "dark":
      removeLightClassFromThemeElements();
      break;
    default:
      break;
  }

  localStorage.setItem('opeonikute-theme', theme);
  setSwitcherTitle(theme);
}

function setSwitcherTitle(themeName) {
  themeName = (themeName === 'dark') ? 'light' : 'dark';
  const switcher = document.querySelector('span.theme-switcher');
  if (switcher) {
    switcher.title = `Switch to the ${themeName} theme.`;
  }
}

function addLightClassToThemeElements() {
  const elemList = document.querySelectorAll(elems);
  for (const elem of elemList) {
    elem.classList.add('light-theme');
  }
}

function removeLightClassFromThemeElements() {
  const elemList = document.querySelectorAll(elems);
  for (const elem of elemList) {
    elem.classList.remove('light-theme');
  }
}