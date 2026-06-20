import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';

export default function Home() {
  // ==========================================
  // 0. LOGIKA PRELOADER (Mencegah Raw Text Flash)
  // ==========================================
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      // Delay 800ms agar transisi kopi berdenyut terlihat estetik
      setTimeout(() => setIsLoading(false), 800);
    };

    // Cek jika halaman sudah terload sepenuhnya (termasuk CSS & Video)
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  // ==========================================
  // 1. STATE & LOGIKA: PROJECT SLIDER
  // ==========================================
  const [projects, setProjects] = useState([
    { id: 1, name: 'Coming Soon', des: 'Stay with us!', img: '/assets/media/that\'s%20way%20i%20gave%20up%20on%20music%201.png', link: '/projects' },
    { id: 2, name: 'SoulForge', des: 'Game', img: '/assets/media/projects/games/soulforge/SoulForge-logo-bg.png', link: '/projects' },
    { id: 3, name: 'Niflheim - Coffee Shop', des: '3D Art', img: '/assets/media/projects/designs/niflheim/mainroom.jpg', link: '/projects' },
    { id: 4, name: 'Kz - Promotional Photo/Video', des: 'Design', img: '/assets/media/projects/designs/kz/Flyer%20KZ.png', link: '/projects' },
    { id: 5, name: 'Carvis', des: 'Mobile App', img: '/assets/media/projects/mobiles/carvis/Carvis.png', link: '/projects' }
  ]);

  const handleNextProject = () => {
    setProjects(prev => {
      const newArr = [...prev];
      newArr.push(newArr.shift());
      return newArr;
    });
  };

  const handlePrevProject = () => {
    setProjects(prev => {
      const newArr = [...prev];
      newArr.unshift(newArr.pop());
      return newArr;
    });
  };

  // ==========================================
  // 2. STATE & LOGIKA: ABOUT US (TEAM SLIDER)
  // ==========================================
  const aboutProfiles = [
    { name: "LYCHNUS", role: "game artis", img: "/assets/media/Lychnus.png" },
    { name: "luca", role: "Game Developer", img: "/assets/media/Luca.png" },
    { name: "Xevorine", role: "AI Developer", img: "/assets/media/xevorine.png" },
    { name: "April Arn", role: "AI/ML Engineer", img: "/assets/media/Arnold.png" },
    { name: "Machiro", role: "Game Designer", img: "/assets/media/Maul.png" },
    { name: "Karpova", role: "WEB Developer", img: "/assets/media/Radhit.png" },
    { name: "Ciffet", role: "IoT Developer", img: "/assets/media/Nopal.png" }
  ];

  const [currentAboutIndex, setCurrentAboutIndex] = useState(0);

  const handleNextAbout = () => {
    setCurrentAboutIndex(prev => (prev === aboutProfiles.length - 1 ? 0 : prev + 1));
  };

  const handlePrevAbout = () => {
    setCurrentAboutIndex(prev => (prev === 0 ? aboutProfiles.length - 1 : prev - 1));
  };

  // ==========================================
  // 3. FUNGSI: EMAIL CONTACT C&C STUDIO
  // ==========================================
  const handleEmailClick = (e) => {
    e.preventDefault();
    const to = 'coffeecat0005@gmail.com';
    const subject = 'Pemesanan Layanan';
    const body = 'Halo admin,%0A%0A';
    
    const gmailWeb = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
    const gmailApp = `intent://compose?to=${to}&subject=${subject}&body=${body}#Intent;scheme=mailto;package=com.google.android.gm;end`;
    
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (isMobile && navigator.userAgent.includes('Android')) {
      window.location.href = gmailApp;
    } else {
      window.open(gmailWeb, '_blank');
    }
  };

  // ==========================================
  // RENDER PRELOADER
  // ==========================================
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#141E30]">
        <div className="relative">
          <div className="text-6xl text-white animate-bounce">
            <i className="bi bi-cup-hot-fill"></i>
          </div>
          <div className="mt-4 h-1 w-12 bg-white/20 rounded-full blur-sm animate-pulse mx-auto"></div>
        </div>
        <p className="mt-6 text-white font-bold tracking-[0.2em] text-sm animate-pulse">
          JANGAN LUPA NGOPI...
        </p>
      </div>
    );
  }

  // ==========================================
  // RENDER HALAMAN UTAMA
  // ==========================================
  return (
    <div className="animate-in fade-in duration-700">
      <SEO 
        title="Cat and Coffee Studio - Creative & Tech Agency" 
        description="Studio kreatif yang berfokus pada pengembangan teknologi 3D, Desain Grafis, AI, dan Game Development."
      />
      {/* 1. HERO SECTION */}
      <section id="home" className="hero-section">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src="/assets/media/hero-video.mp4" type="video/mp4" />
          Browser Anda tidak mendukung tag video.
        </video>
        <div className="hero-content">
          <h1>PURRING IDEAS,<br />BREWING INNOVATION.</h1>
          <a href="/#projects" className="cta-button">OUR WORKS</a>
        </div>
        <div className="scroll-indicator visible">
          <span></span>
        </div>
      </section>

      {/* 2. SERVICES SECTION */}
      <section id="services" className="services-section">
        <div className="container">
          <h2 className="section-title">OUR SERVICES</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>3D Modelling & Design</h3>
              <p>Kami menyediakan layanan pembuatan model 3D untuk game, animasi, arsitektur, dan produk.</p>
            </div>
            <div className="service-card">
              <h3>Graphic Design</h3>
              <p>Kami membuat desain visual dan identitas brand yang kuat — mulai dari logo, poster, hingga UI.</p>
            </div>
            <div className="service-card">
              <h3>IoT Development</h3>
              <p>Kami mengembangkan dan memberikan servis berbasis Internet of Things (IoT).</p>
            </div>
            <div className="service-card">
              <h3>AI & Machine Learning</h3>
              <p>Kami mengembangkan model Artificial Intelligence dan Machine Learning serta implementasinya.</p>
            </div>
            <div className="service-card">
              <h3>Database Management</h3>
              <p>Kami membantu membangun dan mengelola database yang aman, efisien, dan mudah diintegrasikan.</p>
            </div>
            <div className="service-card">
              <h3>Setup Management</h3>
              <p>Kami membantu membangun server Discord profesional Serta menyediakan jasa pembuatan dan kustomisasi Linktree.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROJECTS SECTION */}
      <section id="projects" className="project-section">
        <div className="project-container">
          <h2 className="section-title">PROJECT CATEGORIES</h2>
          <div className="slide">
            {projects.map((proj) => (
              <div key={proj.id} className="item" style={{ backgroundImage: `url("${proj.img}")` }}>
                <div className="content">
                  <div className="name">{proj.name}</div>
                  <div className="des">{proj.des}</div>
                  <Link to={proj.link}>
                    <button className="cta-button" style={{ padding: '10px 20px', fontSize: '1rem' }}>See More</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="button">
            <button className="prev" onClick={handlePrevProject}><i className="bi bi-chevron-left"></i></button>
            <button className="next" onClick={handleNextProject}><i className="bi bi-chevron-right"></i></button>
          </div>
        </div>
      </section>

      {/* 4. ABOUT US SECTION */}
      <section id="about" className="about-section">
        <div className="container">
          <h2 className="section-title">ABOUT US</h2>
          <div className="about-content">
            <div className="about-text">
              <p>Cat and Coffee Studio adalah sebuah studio kreatif yang berfokus pada pengembangan teknologi dan desain inovatif.</p>
            </div>
          </div>
        </div>
        
        <div className="about-profile-slider">
          <button className="slider-btn prev-btn" onClick={handlePrevAbout}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <div className="overflow-hidden w-full rounded-2xl">
            <div className="about-profiles" style={{ transform: `translateX(-${currentAboutIndex * 100}%)` }}>
              {aboutProfiles.map((profile, index) => (
                <div key={index} className={`about-profile transition-opacity duration-500 ${currentAboutIndex === index ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                  <div className="profile-content">
                    <h1 className="profile-header">{profile.name}</h1>
                    <div className="profile-title">{profile.role}</div>
                  </div>
                  <div className="profile-image">
                    <img src={profile.img} alt={profile.name} loading="lazy" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="slider-btn next-btn" onClick={handleNextAbout}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </section>

      {/* 5. CONTACT SECTION */}
      <section id="contact" className="contact-section">
        <div className="container">
          <h2 className="section-title">Let's Brew Your Project</h2>
          <div className="contact-content">
            <div className="contact-cards">
              <a href="mailto:coffeecat0005@gmail.com" className="contact-card" onClick={handleEmailClick}>
                <div className="icon-wrapper"><i className="bi bi-envelope-fill"></i></div>
                <div className="contact-info"><h4>Email</h4><p>coffeecat0005@gmail.com</p></div>
              </a>
              <a href="https://www.instagram.com/catcoffee_studio/" target="_blank" rel="noopener noreferrer" className="contact-card">
                <div className="icon-wrapper"><i className="bi bi-instagram"></i></div>
                <div className="contact-info"><h4>Instagram</h4><p>catcoffee_studio</p></div>
              </a>
              <a href="https://wa.me/6285117660558" target="_blank" rel="noopener noreferrer" className="contact-card">
                <div className="icon-wrapper"><i className="bi bi-whatsapp"></i></div>
                <div className="contact-info"><h4>WhatsApp</h4><p>+62 851-1766-0558</p></div>
              </a>
            </div>
            <div className="fun-fact">
              <i className="bi bi-cup-hot-fill"></i>
              <p>Kami menjawab pesan sambil ngopi, responsnya hangat dan friendly!</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}