import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="flex h-screen w-full items-center justify-center bg-[#f4f7f6] text-[#1a2b4c] font-bold">Memeriksa Akses...</div>;
  if (!user) return <Navigate to="/ar-historian-app/login" replace />;

  return (
    <div className="flex min-h-screen w-full bg-[#f4f7f6] text-gray-800 overflow-hidden relative border-none font-sans">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} onLogout={() => signOut(auth)} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="bg-white shadow-sm border-b border-gray-100 md:hidden flex items-center justify-between p-4 z-10 w-full">
          <h1 className="text-xl font-bold text-[#1a2b4c]">Arkeo Dashboard</h1>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-2xl text-[#1a2b4c]"><i className="bi bi-list"></i></button>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full p-4 md:p-8 md:pt-10">
          <div className="w-full max-w-7xl mx-auto"> 
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
}