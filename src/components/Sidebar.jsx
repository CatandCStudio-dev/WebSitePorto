import { NavLink } from 'react-router-dom';

export default function Sidebar({ isOpen, toggleSidebar, onLogout }) {
  const activeClass = ({ isActive }) => 
    isActive ? "block py-2.5 px-4 rounded transition duration-200 bg-blue-600 text-white" 
             : "block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-500 hover:text-white text-gray-300";

  return (
    <>
      {/* Overlay Gelap: Muncul di HP saat sidebar ditarik keluar */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Kontainer Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 w-64 bg-gray-800 min-h-screen flex flex-col justify-between`}>
        
        {/* Menu Atas */}
        <div className="px-4 py-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Dashboard Riset</h2>
          <nav className="space-y-2">
            {/* Navigasi disesuaikan dengan prefix /ar-historian-app */}
            <NavLink to="/ar-historian-app" onClick={toggleSidebar} className={activeClass} end>📊 Overview</NavLink>
            <NavLink to="/ar-historian-app/puzzle" onClick={toggleSidebar} className={activeClass}>🧩 Data Puzzle</NavLink>
            <NavLink to="/ar-historian-app/ar-arkeo" onClick={toggleSidebar} className={activeClass}>🏛️ AR Arkeo Nusantara</NavLink>
          </nav>
        </div>
        
        {/* Tombol Logout di Bawah */}
        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={onLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200 flex items-center justify-center gap-2"
          >
            🚪 Keluar Akun
          </button>
        </div>

      </div>
    </>
  );
}