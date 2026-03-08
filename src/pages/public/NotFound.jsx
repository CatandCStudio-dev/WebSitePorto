import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#141E30] text-white p-6 relative overflow-hidden font-sans">
      
      {/* Animasi Cahaya Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
        {/* Ikon Kopi Tumpah / Kucing Kaget (Menggunakan icon Bootstrap) */}
        <div className="text-8xl text-gray-500 mb-6 animate-bounce">
          <i className="bi bi-cup-hot"></i>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-2">404</h1>
        <h2 className="text-xl md:text-2xl font-bold tracking-widest uppercase text-gray-400 mb-6">
          Oops! Page Not Found
        </h2>
        
        <p className="text-gray-400 max-w-md mb-10 text-sm md:text-base">
          Sepertinya kucing kami menyembunyikan halaman yang Anda cari, atau URL tersebut memang belum diseduh.
        </p>

        <Link 
          to="/" 
          className="bg-white text-[#141E30] font-black py-3 px-8 rounded-full hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-3"
        >
          <i className="bi bi-house-door-fill"></i> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}