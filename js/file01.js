"use strict";

const showToast = () => {
    const toastElement = document.getElementById('toast-interactive');
    if (toastElement) {
        toastElement.classList.add('md:block');
    }
};

const showVideo = () => {
    const demoElement = document.getElementById('demo');
    if (demoElement) {
        demoElement.addEventListener('click', () => {
            window.open('https://www.youtube.com', '_blank');
        });
    }
};

(() => {
    showToast();
    showVideo();
})();


