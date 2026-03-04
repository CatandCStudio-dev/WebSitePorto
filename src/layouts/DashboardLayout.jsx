import { useState, useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/ar-historian-app/login');
    } catch (err) {
      console.error('Logout gagal', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="flex h-screen w-full items-center justify-center bg-gray-100 font-bold">Memeriksa Akses...</div>;
  
  // Jika belum login, tendang kembali ke halaman login khusus AR
  if (!user) return <Navigate to="/ar-historian-app/login" replace />;

// src/layouts/DashboardLayout.jsx

    return (
    /* Tambahkan min-h-screen dan pastikan bg-gray-100 menutupi background body lama */
    <div className="flex min-h-screen w-full bg-gray-100! text-gray-800 overflow-hidden relative border-none">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} onLogout={handleLogout} />
        
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="bg-white shadow-sm border-b md:hidden flex items-center justify-between p-4 z-10 w-full">
            <h1 className="text-xl font-bold text-gray-800">Dashboard Riset</h1>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-2xl text-gray-800">☰</button>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 w-full p-4 md:p-8">
            <div className="w-full max-w-7xl mx-auto"> 
            <Outlet /> 
            </div>
        </main>
        </div>
    </div>
    );
}