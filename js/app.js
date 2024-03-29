// Add target blank to all post links
window.onload = function () {
    document.querySelectorAll('.blog a:not(.footnote):not(.reversefootnote)').forEach(a => a.setAttribute('target', '_blank'));
}

var text = document.querySelector('title') || '';

if (text) {
    text = text.textContent;
}

var twitterShare = document.querySelector('#twitter');

twitterShare.onclick = function(e) {
  e.preventDefault();
  var twitterWindow = window.open('https://twitter.com/share?text=' + text  + '&url=' + document.URL + '&via=Ope__O', 'twitter-popup', 'height=350,width=600');
  if(twitterWindow.focus) { twitterWindow.focus(); }
    return false;
  }

var facebookShare = document.querySelector('#facebook');

facebookShare.onclick = function(e) {
  e.preventDefault();
  var facebookWindow = window.open('https://www.facebook.com/sharer/sharer.php?u=' + document.URL, 'facebook-popup', 'height=350,width=600');
  if(facebookWindow.focus) { facebookWindow.focus(); }
    return false;
}

var linkedinShare = document.querySelector('#linkedin');

linkedinShare.onclick = function(e) {
  e.preventDefault();
  var linkedinWindow = window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${document.URL}&title=${text}&source=${window.location.host}`, 'linkedin-popup', 'height=350,width=600');
  if(linkedinWindow.focus) { linkedinWindow.focus(); }
    return false;
}

// add lightbox
const images = document.querySelectorAll('main img');
for (let i=0; i< images.length; i++) {
  const image = images[i];
  image.classList.add('mklbItem');
  // mklb.js
  image.addEventListener('click', () => _mklbOpen(image));
}