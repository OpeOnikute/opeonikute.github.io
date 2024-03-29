/**
 * MK Lightbox
 */

const svgIcons = {
    close: '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" xml:space="preserve"><g><g><path d="M505.943,6.058c-8.077-8.077-21.172-8.077-29.249,0L6.058,476.693c-8.077,8.077-8.077,21.172,0,29.249C10.096,509.982,15.39,512,20.683,512c5.293,0,10.586-2.019,14.625-6.059L505.943,35.306C514.019,27.23,514.019,14.135,505.943,6.058z"/></g></g><g><g><path d="M505.942,476.694L35.306,6.059c-8.076-8.077-21.172-8.077-29.248,0c-8.077,8.076-8.077,21.171,0,29.248l470.636,470.636c4.038,4.039,9.332,6.058,14.625,6.058c5.293,0,10.587-2.019,14.624-6.057C514.018,497.866,514.018,484.771,505.942,476.694z"/></g></g></svg>'
}

let lightboxContainer;
let auto = 0;
let interval;

function _mklbOpen(mklbItem) {
    lightboxContainer = document.createElement('div');
    lightboxContainer.id = "mkLightboxContainer";

    let overlay = document.createElement('div');
    overlay.id = 'overlay';
    lightboxContainer.appendChild(overlay);

    lightboxContainer.appendChild(_mklbAddImage(mklbItem));

    let closeIconContainer = document.createElement('div');
    closeIconContainer.id = "closeIconContainer";
    closeIconContainer.innerHTML = svgIcons.close;
    lightboxContainer.appendChild(closeIconContainer);
    closeIconContainer.addEventListener('click', _closeLightbox)

    document.body.appendChild(lightboxContainer);
    overlay.addEventListener('click', _closeLightbox)
}

function _mklbAddImage(item) {
    let image = document.createElement('img');
    image.id = 'mklbImage';
    image.src = ('src' in item.dataset) ? item.dataset.src : item.src;
    return image;
}

function _closeLightbox() {
    document.getElementById('mkLightboxContainer').remove();
	clearInterval(interval);
}
