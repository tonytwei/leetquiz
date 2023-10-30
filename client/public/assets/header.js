function toggleNavOverlay() {
    const navOverlay = document.querySelector('.nav-overlay');
    if (navOverlay.style.display === 'block') {
        navOverlay.style.display = 'none';
    } else {
        navOverlay.style.display = 'block';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const menuOpen = document.querySelector('.menu-open');
    menuOpen.addEventListener("click", toggleNavOverlay);

    const menuClose = document.querySelector(".menu-close");
    menuClose.addEventListener("click", toggleNavOverlay);

});
