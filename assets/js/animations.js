// assets/js/animations.js

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

/**
 * ==========================================================
 * FUNGSI BARU: Membuat efek jejak kaki kucing saat diklik
 * ==========================================================
 */
const initializeProjectSlider = () => {
    const nextBtn = document.querySelector('.next');
    const prevBtn = document.querySelector('.prev');
    const slideContainer = document.querySelector('.slide');

    if (!nextBtn || !prevBtn || !slideContainer) {
        console.warn("Slider elements not found. Project slider not initialized.");
        return;
    }

    nextBtn.onclick = function() {
        // Ambil daftar item TERBARU setiap kali tombol diklik
        let items = document.querySelectorAll('.slide .item');
        // Pindahkan item pertama ke posisi terakhir
        slideContainer.appendChild(items[0]);
    }

    prevBtn.onclick = function() {
        // Ambil daftar item TERBARU setiap kali tombol diklik
        let items = document.querySelectorAll('.slide .item');
        // Pindahkan item terakhir ke posisi pertama
        slideContainer.prepend(items[items.length - 1]);
    }
};


// Menjalankan semua fungsi setelah konten HTML selesai dimuat oleh browser.
document.addEventListener('DOMContentLoaded', () => {
    console.log("Website Loaded (MPA Mode)");
    hidePreload();
    handleScrollAnimation();
    initializeScrollIndicator();
    createCatFootprintOnClick();
    initializeProjectSlider(); // Panggil fungsi slider baru
});

const createCatFootprintOnClick = () => {
    // Menambahkan event listener ke seluruh halaman
    window.addEventListener('click', (event) => {
        // Membuat elemen gambar baru setiap kali ada klik
        const footprint = document.createElement('img');
        footprint.src = 'assets/media/catfootprint32.png';

        // Menghitung rotasi acak antara -12 dan +12 derajat
        const randomRotation = Math.random() * 32 - 16;

        // **PERUBAHAN UTAMA DI SINI**
        // Hitung posisi klik relatif terhadap seluruh dokumen, bukan hanya layar
        const clickX = event.clientX + window.scrollX;
        const clickY = event.clientY + window.scrollY;

        // Menerapkan style pada jejak kaki
        Object.assign(footprint.style, {
            position: 'absolute', // **DIUBAH**: dari 'fixed' menjadi 'absolute'
            left: `${clickX - 16}px`, // Gunakan posisi X yang sudah dihitung
            top: `${clickY - 16}px`,  // Gunakan posisi Y yang sudah dihitung
            width: '32px',
            height: '32px',
            opacity: '0',
            transform: `rotate(${randomRotation}deg)`,
            pointerEvents: 'none',
            zIndex: '9999',
            transition: 'opacity 0.25s ease-in-out'
        });

        // Menambahkan jejak kaki ke dalam body
        document.body.appendChild(footprint);

        // Fase 1: Fade-in (setelah jeda singkat agar transisi terpicu)
        setTimeout(() => {
            footprint.style.opacity = '1';
        }, 10);

        // Fase 2: Fade-out (setelah fade-in selesai dalam 0.25 detik)
        setTimeout(() => {
            footprint.style.transition = 'opacity 2s ease-in-out';
            footprint.style.opacity = '0';
        }, 250);

        // Fase 3: Hapus elemen dari DOM setelah semua animasi selesai
        setTimeout(() => {
            footprint.remove();
        }, 2250);
    });
};


// Menjalankan semua fungsi setelah konten HTML selesai dimuat oleh browser.
document.addEventListener('DOMContentLoaded', () => {
    console.log("Website Loaded (MPA Mode)");
    hidePreload();
    handleScrollAnimation();
    initializeScrollIndicator();
    createCatFootprintOnClick();
});
// Add this to your existing JavaScript file

document.addEventListener('DOMContentLoaded', function() {
    const profilesContainer = document.querySelector('.about-profiles');
    const profiles = document.querySelectorAll('.about-profile');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentIndex = 0;

    // Hide all profiles except the first one
    profiles.forEach((profile, index) => {
        if (index !== 0) {
            profile.style.opacity = '0';
        }
    });

    function updateSlider() {
        profilesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update opacity for smooth transition
        profiles.forEach((profile, index) => {
            if (index === currentIndex) {
                profile.style.opacity = '1';
            } else {
                profile.style.opacity = '0';
            }
        });
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : profiles.length - 1;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = currentIndex < profiles.length - 1 ? currentIndex + 1 : 0;
        updateSlider();
    });
});