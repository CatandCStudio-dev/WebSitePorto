import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase'; 
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State untuk kontrol animasi entry
  const [animateIn, setAnimateIn] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Email dan Password wajib diisi.');
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setAnimateIn(false); 
      setTimeout(() => navigate('/ar-historian-app'), 400); 
    } catch (error) {
      console.error("Login Error:", error.code);
      switch (error.code) {
        case 'auth/invalid-email':
          setError('Format email tidak valid.');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Email atau Password salah.');
          break;
        case 'auth/too-many-requests':
          setError('Terlalu banyak percobaan. Coba lagi nanti.');
          break;
        default:
          setError('Terjadi kesalahan. Gagal masuk.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Latar belakang cerah yang sangat lembut (Soft Green/Cream tint)
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#f4f7f6] font-sans relative overflow-hidden">
      
      {/* KOTAK UTAMA (SPLIT SCREEN LAYOUT) */}
      <div 
        className={`flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden 
                   transform transition-all duration-1000 ease-out
                   ${animateIn ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
      >
        
        {/* BAGIAN KIRI: BRANDING (Logo & Animasi Puzzle) */}
        <div className="w-full md:w-5/12 bg-[#fdfbf7] p-10 flex flex-col items-center justify-center relative min-h-[300px] md:min-h-full border-r border-gray-100">
          
          {/* Efek Puzzle Melayang (Sesuai Referensi Mobile) */}
          <i className="bi bi-puzzle-fill absolute top-12 left-12 text-[#b38b59] text-3xl opacity-40 animate-[bounce_4s_infinite]"></i>
          <i className="bi bi-puzzle-fill absolute bottom-20 right-16 text-[#b38b59] text-5xl opacity-30 animate-[bounce_5s_infinite]"></i>
          <i className="bi bi-puzzle-fill absolute top-32 right-12 text-[#b38b59] text-2xl opacity-50 animate-[bounce_3.5s_infinite]"></i>
          <i className="bi bi-puzzle-fill absolute bottom-12 left-20 text-[#b38b59] text-xl opacity-40 animate-[bounce_4.5s_infinite]"></i>

          {/* Logo Utama */}
          <div className="relative z-10 flex flex-col items-center transform transition-transform duration-700 hover:scale-105">
            <img 
              src="/assets/media/arkeno nusantara.png" 
              alt="Arkeo Nusantara" 
              className="w-56 md:w-64 object-contain drop-shadow-sm"
            />
            <div className="mt-6 text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#1a2b4c]/10 text-[#1a2b4c] text-xs font-bold tracking-widest uppercase">
                Research Portal
              </span>
            </div>
          </div>
        </div>

        {/* BAGIAN KANAN: FORMULIR LOGIN */}
        <div className="w-full md:w-7/12 p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white relative">
          
          <div className="max-w-md w-full mx-auto">
            <h2 className="text-3xl font-extrabold text-[#1a2b4c] mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-8 text-sm">Masuk untuk mengakses data analitik dan riset.</p>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg text-sm mb-6 flex items-start gap-3 animate-pulse">
                <i className="bi bi-exclamation-circle-fill mt-0.5"></i>
                <p className="font-medium">{error}</p>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Akses</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@arkeonusantara.com"
                  className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:bg-white focus:border-[#1a2b4c] focus:ring-2 focus:ring-[#1a2b4c]/20 outline-none transition-all duration-200"
                  disabled={loading}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-bold text-gray-700">Password</label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 bg-gray-50 text-gray-900 rounded-xl border border-gray-200 focus:bg-white focus:border-[#1a2b4c] focus:ring-2 focus:ring-[#1a2b4c]/20 outline-none transition-all duration-200"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1a2b4c] text-white font-bold py-3.5 px-6 rounded-xl mt-4
                           hover:bg-[#111c33] transform hover:-translate-y-0.5 shadow-lg shadow-[#1a2b4c]/30
                           transition-all duration-300 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Memeriksa Kredensial...
                  </>
                ) : (
                  <>
                    Sign In <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>
            </form>

            {/* SEPARATOR & FOOTER */}
            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-400">Arkeo Nusantara Dashboard</span>
                </div>
              </div>

              <div className="text-center mt-6">
                <Link 
                  to="/" 
                  className="text-[#b38b59] hover:text-[#8f6e45] font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 group"
                >
                  <i className="bi bi-arrow-left-short text-lg transition-transform group-hover:-translate-x-1"></i>
                  Kembali ke Website Utama
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}