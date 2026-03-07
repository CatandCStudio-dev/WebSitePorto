import { NavLink } from 'react-router-dom';

export default function Sidebar({ isOpen, toggleSidebar, onLogout }) {
  const activeClass = ({ isActive }) => 
    isActive ? "flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 bg-[#1a2b4c] text-white shadow-lg shadow-[#1a2b4c]/30 font-semibold" 
             : "flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 hover:bg-[#f4f7f6] text-gray-500 font-medium hover:text-[#1a2b4c]";

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-[#1a2b4c]/40 backdrop-blur-sm z-20 md:hidden" onClick={toggleSidebar}></div>}

      <div className={`fixed inset-y-0 left-0 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-30 w-72 bg-white border-r border-gray-100 min-h-screen flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}>
        
        <div className="px-6 py-8">
          {/* Logo Brand */}
          <div className="flex flex-col items-center justify-center mb-10">
            <img src="/assets/media/arkeno nusantara.png" alt="Arkeo Nusantara" className="w-32 object-contain mb-3 drop-shadow-sm" />
            <h2 className="text-xs font-black tracking-widest uppercase text-[#b38b59]">Research Portal</h2>
          </div>

          <nav className="space-y-2">
            <NavLink to="/ar-historian-app" onClick={toggleSidebar} className={activeClass} end>
              <i className="bi bi-grid-1x2-fill text-lg"></i> Overview
            </NavLink>
            <NavLink to="/ar-historian-app/users" onClick={toggleSidebar} className={activeClass}>
              <i className="bi bi-people-fill text-lg"></i> Database Pemain
            </NavLink>
            <NavLink to="/ar-historian-app/puzzle" onClick={toggleSidebar} className={activeClass}>
              <i className="bi bi-puzzle-fill text-lg"></i> Data Puzzle
            </NavLink>
            <NavLink to="/ar-historian-app/ar-arkeo" onClick={toggleSidebar} className={activeClass}>
              <i className="bi bi-box text-lg"></i> AR Arkeo Nusantara
            </NavLink>
          </nav>
        </div>
        
        <div className="p-6 border-t border-gray-100">
          <button onClick={onLogout} className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200">
            <i className="bi bi-box-arrow-left"></i> Keluar Akun
          </button>
        </div>
      </div>
    </>
  );
}