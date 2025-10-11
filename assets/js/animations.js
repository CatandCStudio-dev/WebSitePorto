// src/js/animations.js

/**
 * Menangani animasi fade-in untuk elemen saat di-scroll ke dalam viewport.
 * Digunakan untuk project cards.
 */
const handleScrollAnimation = () => {
    const elementsToAnimate = document.querySelectorAll('.project-card');
    if (!elementsToAnimate.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    elementsToAnimate.forEach(element => {
        observer.observe(element);
    });
};

/**
 * Mengatur perilaku scroll indicator.
 */
const initializeScrollIndicator = () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    let inactivityTimeout = null;

    const manageIndicator = () => {
        scrollIndicator.classList.remove('visible');
        clearTimeout(inactivityTimeout);
        inactivityTimeout = setTimeout(() => {
            scrollIndicator.classList.add('visible');
        }, 2000);
    };

    manageIndicator(); // Panggil sekali untuk memulai timer
    window.addEventListener('scroll', manageIndicator);
};

/**
 * Mengatur preloader agar hilang setelah beberapa saat.
 */
const hidePreload = () => {
    const preload = document.getElementById('preload');
    if (preload) {
        setTimeout(() => {
            preload.style.display = 'none';
        }, 2000); // Penundaan 2 detik
    }
};

// Menjalankan semua fungsi setelah konten HTML selesai dimuat oleh browser.
document.addEventListener('DOMContentLoaded', () => {
    console.log("Website Loaded (MPA Mode)");
    hidePreload();
    handleScrollAnimation();
    initializeScrollIndicator();
});