import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Database Super Lengkap Proyek C&C Studio
const projectDetails = {
  // === KATEGORI GAMES ===
  soulforge: {
    title: "SOULFORGE", subtitle: "",
    mediaType: "video", mediaSrc: "/assets/media/projects/games/soulforge/SoulForge.mp4",
    layout: "horiz", // Horizontal
    about: [
      "SoulForge adalah RPG single-player yang memadukan petualangan epik dengan tes kepribadian interaktif berbasis Big Five Personality Traits. Setiap keputusan yang kamu ambil—mulai dari memilih buff, senjata, hingga cara menghadapi musuh—akan diamati dan dianalisis untuk mengungkap kepribadianmu yang sesungguhnya.",
      "Dikembangkan dengan Unity, game ini menawarkan grafis yang memukau dan gameplay yang imersif."
    ],
    features: [ { label: "Genre", value: "Hack & Slash" }, { label: "Platform", value: "PC" }, { label: "Release Date", value: "September 2025" }, { label: "Player", value: "Single-player" } ],
    link: "https://rizalimaru.itch.io/soulforge", linkText: "Download",
    gallery: ["/assets/media/projects/games/soulforge/soulforge-1.png", "/assets/media/projects/games/soulforge/soulforge-2.png", "/assets/media/projects/games/soulforge/soulforge-3.png", "/assets/media/projects/games/soulforge/soulforge-4.png"]
  },

  // === KATEGORI MOBILES ===
  carvis: {
    title: "CARVIS", subtitle: "intelligence behind the windshield",
    mediaType: "video", mediaSrc: "/assets/media/projects/mobiles/carvis/Carvis.mp4",
    layout: "horiz",
    about: [
      "Carvis adalah aplikasi sistem bantuan pengemudi canggih (ADAS) berbasis Android.",
      "Aplikasi ini meningkatkan keselamatan pengemudi dengan memanfaatkan kamera smartphone untuk mendeteksi 32 jenis rambu lalu lintas di Indonesia dan memberikan saran koreksi titik tengah kendaraan melalui deteksi lajur secara real-time."
    ],
    features: [ { label: "Platform", value: "Android" }, { label: "Release Date", value: "September 2025" } ],
    link: "https://github.com/AprilArn/Carvis/releases", linkText: "Download",
    gallery: ["/assets/media/projects/mobiles/carvis/carvis1.jpg", "/assets/media/projects/mobiles/carvis/carvis2.jpg", "/assets/media/projects/mobiles/carvis/carvis3.jpg"]
  },

  // === KATEGORI DESIGNS ===
  kz: {
    title: "KZ", subtitle: "Promotional Photo/Video",
    mediaType: "video", mediaSrc: "/assets/media/projects/designs/kz/Iklan%20Kz%20mobile.mp4",
    layout: "vert", // Vertikal
    about: [
      "Animasi video motion graphic berformat vertikal (9:16) untuk peluncuran In-Ear Monitor (IEM) KZ EDX PRO. Dibuat khusus untuk platform digital dan e-commerce, fokus utama kami adalah menciptakan visual yang bersih, modern, dan product-centric.",
      "Video looping yang dinamis ini dirancang untuk menarik perhatian audiens secara instan di platform mobile (seperti Instagram Stories atau iklan feed), menyoroti desain produk dan ketersediaan eksklusifnya di Tokopedia."
    ],
    features: [ { label: "Release Date", value: "Q4 2025" } ],
    link: null, // Tidak ada tombol link
    gallery: ["/assets/media/projects/designs/kz/Flyer%20KZ.png"]
  },
  niflheim: {
    title: "NIFLHEIM - COFFEE SHOP", subtitle: "3D Art",
    mediaType: "image", mediaSrc: "/assets/media/projects/designs/niflheim/mainroom.jpg",
    layout: "horiz",
    about: [
      "Model 3D yang mengambil konsep Cafe, dibalut dengan estetika. Projek melingkupi texturing, shadering, hingga modeling untuk menciptakan atmosfer yang nyaman"
    ],
    features: [ { label: "Release Date", value: "September 2024" } ],
    link: null,
    gallery: ["/assets/media/projects/designs/niflheim/mainroom.jpg", "/assets/media/projects/designs/niflheim/bedroom.jpg", "/assets/media/projects/designs/niflheim/hall.jpg"]
  },
  workshopfinic2022: {
    title: "Workshop Finic UMS 2022 Design", subtitle: "Pamflet",
    mediaType: "image", mediaSrc: "/assets/media/projects/designs/workshopfinic/Pamflet%20Workshop%20Finic%202022.png",
    layout: "vert",
    about: [
      "Deskripsi projek", "Deskripsi projek"
    ],
    features: [ { label: "Release Date", value: "Q4 2025" } ],
    link: null,
    gallery: ["/assets/media/projects/designs/workshopfinic/Pamflet%20Workshop%20Finic%202022.png"]
  }
};

export default function ProjectDetail() {
  const { id } = useParams(); 
  const data = projectDetails[id];
  const [lightboxImg, setLightboxImg] = useState(null); 

  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, [id]);

  if (!data) return <div className="min-h-screen flex justify-center items-center text-white text-2xl font-bold bg-[#141E30]">Proyek tidak ditemukan.</div>;

  // Menentukan Layout (Vertikal atau Horizontal) sesuai data asli HTML kamu
  const layoutClass = data.layout === 'vert' ? 'item-content-layout-vert' : 'item-content-layout';

  return (
    <div className="block w-full bg-[#141E30] text-white min-h-screen">
      <div className="scroll-indicator visible"><span></span></div>
      
      <section className="item-detail-section">
        <div className="container">
          <div className="item-hero">
            <h1 className="item-title">{data.title}</h1>
            {data.subtitle && <p className="item-subtitle">{data.subtitle}</p>}
          </div>
        </div>

        {/* Dynamic Layout & Media Reader */}
        <div className={layoutClass}>
          <div className="item-media">
            {data.mediaType === 'video' ? (
              <video width="100%" playsInline autoPlay muted loop className="rounded-2xl border-2 border-white/20">
                <source src={data.mediaSrc} type="video/mp4" />
                Browser Anda tidak mendukung tag video.
              </video>
            ) : (
              <img src={data.mediaSrc} alt={data.title} className="w-full rounded-2xl border-2 border-white/20" />
            )}
          </div>
          
          <div className="item-info">
            <h2>About {data.title === "CARVIS" ? "App" : (data.title === "SOULFORGE" ? "Game" : "Design")}</h2>
            {data.about.map((p, idx) => <p key={idx}>{p}</p>)}
            
            <h3>Key Features</h3>
            <ul className="key-details">
              {data.features.map((feat, idx) => (
                <li key={idx}><strong>{feat.label}:</strong> {feat.value}</li>
              ))}
            </ul>
            
            {/* Hanya tampilkan tombol jika link tersedia */}
            {data.link && (
              <a href={data.link} target="_blank" rel="noopener noreferrer" className="cta-button">
                {data.linkText || "Visit"}
              </a>
            )}
          </div>
        </div>

        <div className="container">
          <div className="item-gallery">
            <h2>Gallery</h2>
            <div className="gallery-grid">
              {data.gallery.map((imgUrl, idx) => (
                <img 
                  key={idx} 
                  src={imgUrl} 
                  alt={`Gallery ${idx + 1}`} 
                  onClick={() => setLightboxImg(imgUrl)} 
                  className="cursor-pointer hover:scale-105 transition-transform duration-300 rounded-xl"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Pop-up */}
      <div className={`lightbox-overlay ${lightboxImg ? 'visible' : ''}`} onClick={() => setLightboxImg(null)}>
        <span className="lightbox-close" onClick={() => setLightboxImg(null)}>&times;</span>
        {lightboxImg && <img className="lightbox-content" src={lightboxImg} alt="Enlarged view" />}
      </div>
    </div>
  );
}