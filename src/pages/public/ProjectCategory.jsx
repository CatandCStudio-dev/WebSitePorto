import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Data dinamis untuk semua kategori
const categoryData = {
  games: { 
    title: "OUR GAMES", 
    items: [ { id: 'soulforge', title: 'SoulForge', desc: 'Hack & Slash', img: '/assets/media/projects/games/soulforge/SoulForge-logo-bg.png' } ] 
  },
  designs: { 
    title: "OUR DESIGNS", 
    items: [ 
      { id: 'kz', title: 'KZ', desc: 'Promotional Photo/Video', img: '/assets/media/projects/designs/kz/Flyer%20KZ.png' }, 
      { id: 'niflheim', title: 'Niflheim - Coffee Shop', desc: '3D Art', img: '/assets/media/projects/designs/niflheim/mainroom.jpg' },
      { id: 'workshopfinic2022', title: 'Workshop Finic UMS 2022', desc: 'Pamflet', img: '/assets/media/projects/designs/workshopfinic/Pamflet%20Workshop%20Finic%202022.png' }
    ] 
  },
  mobiles: { 
    title: "OUR APPS", 
    items: [ { id: 'carvis', title: 'Carvis', desc: 'Advanced Driver Assistance System (ADAS)', img: '/assets/media/projects/mobiles/carvis/Carvis.png' } ] 
  }
};

export default function ProjectCategory() {
  const { category } = useParams(); // Membaca URL (contoh: 'games' atau 'mobiles')
  const data = categoryData[category];

  useEffect(() => { window.scrollTo(0, 0); }, [category]);

  if (!data) return <div className="min-h-screen flex justify-center items-center text-white">Kategori tidak ditemukan.</div>;

  return (
    <div className="block w-full">
      <div className="scroll-indicator visible"><span></span></div>
      <section id="portfolio" className="project-section">
        <div className="container">
          <h2 className="section-title">{data.title}</h2>
          <div className="project-grid">
            {data.items.map(item => (
              <Link key={item.id} to={`/projects/${category}/${item.id}`} className="project-card">
                <img src={item.img} alt={item.title} />
                <div className="project-info">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}