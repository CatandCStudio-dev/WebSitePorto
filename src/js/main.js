console.log("Website Loaded");

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
 * Muncul setelah 5 detik TIDAK AKTIF di posisi mana pun, dan hilang saat scroll.
 */
const initializeScrollIndicator = () => {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    let inactivityTimeout = null;

    const manageIndicator = () => {
        // 1. Setiap kali user scroll, langsung sembunyikan indikator
        scrollIndicator.classList.remove('visible');

        // 2. Hapus timer lama agar tidak tumpang tindih
        clearTimeout(inactivityTimeout);

        // 3. Atur timer baru. Ini akan berjalan 5 detik SETELAH scroll terakhir.
        inactivityTimeout = setTimeout(() => {
            // 4. Setelah 5 detik tidak aktif, langsung tampilkan indikator
            //    tanpa memeriksa posisi scroll.
            scrollIndicator.classList.add('visible');
        }, 2000); // 2000 milidetik = 2 detik
    };

    // Panggil fungsi sekali saat halaman dimuat untuk memulai timer pertama
    manageIndicator();

    // Tambahkan event listener yang akan memanggil fungsi setiap kali ada scroll
    window.addEventListener('scroll', manageIndicator);
};


// Menggunakan MutationObserver untuk memastikan semua skrip dijalankan
// setelah konten halaman (home.html) selesai dimuat oleh router.js.
const appContainer = document.getElementById('app');
const observerConfig = { childList: true, subtree: true };

const mutationCallback = (mutationsList, observer) => {
    if (document.querySelector('.scroll-indicator')) {
        console.log("Page content loaded. Initializing scripts.");
        
        // Jalankan semua fungsi inisialisasi di sini
        handleScrollAnimation();
        initializeScrollIndicator();

        // Hentikan pengamatan setelah berhasil
        observer.disconnect();
    }
};

const mutationObserver = new MutationObserver(mutationCallback);
mutationObserver.observe(appContainer, observerConfig);