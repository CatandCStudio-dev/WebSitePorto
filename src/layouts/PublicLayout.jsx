import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';

// helper untuk men‑inject link CSS dari folder public
function usePublicStyles() {
  useEffect(() => {
    const hrefs = [
      '/assets/css/style.css',
      '/assets/css/home.css',
      '/assets/css/projects.css',
      '/assets/css/project-item.css',
      '/assets/css/item-detail.css',
    ];

    const links = hrefs.map((href) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
      return link;
    });

    return () => {
      links.forEach((link) => document.head.removeChild(link));
    };
  }, []);
}

export default function PublicLayout() {
  // hanya inject gaya ketika berada di layout publik
  usePublicStyles();

  return (
    // Gunakan "block" agar elemen otomatis menyusun ke bawah
    <div className="block w-full min-h-screen text-white bg-[#141E30]">
      <Navbar />
      <main className="block w-full">
        <Outlet />
      </main>
    </div>
  );
}