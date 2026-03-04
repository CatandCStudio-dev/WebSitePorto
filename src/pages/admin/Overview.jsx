import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

export default function Overview() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPuzzleSessions: 0,
    totalArSessions: 0,
    totalArDuration: 0,
  });
  
  const [puzzleRatio, setPuzzleRatio] = useState([]);
  const [arInteractionData, setArInteractionData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Ambil Data Total User
      const usersSnapshot = await getDocs(collection(db, "Users"));
      const totalUsers = usersSnapshot.size;

      // 2. Ambil Data Global Puzzle (GameData)
      const gameDataSnapshot = await getDocs(collection(db, "GameData"));
      const totalPuzzleSessions = gameDataSnapshot.size;
      
      let globalSuccess = 0;
      let globalFailure = 0;

      gameDataSnapshot.forEach(doc => {
        const data = doc.data();
        globalSuccess += (data.totalPuzzleSuccess || 0);
        globalFailure += (data.totalPuzzleFailure || 0);
      });

      // 3. Ambil Data Global AR (UserStats)
      const statsSnapshot = await getDocs(collection(db, "UserStats"));
      
      let globalArSessions = 0;
      let globalArDurationSeconds = 0;
      let globalAiInteractions = 0;

      statsSnapshot.forEach(doc => {
        const data = doc.data();
        globalArSessions += (data.sessionTotalCount || 0);
        globalArDurationSeconds += (data.sessionTotalDuration || 0);
        globalAiInteractions += (data.aiTotalInteractionCount || 0);
      });

      // Update State Angka Statistik
      setStats({
        totalUsers,
        totalPuzzleSessions,
        totalArSessions: globalArSessions,
        totalArDuration: Math.floor(globalArDurationSeconds / 60) // Konversi ke Menit
      });

      // Update State Data Grafik Puzzle (Pie Chart)
      setPuzzleRatio([
        { name: 'Berhasil', value: globalSuccess, color: '#10b981' }, // Hijau
        { name: 'Gagal', value: globalFailure, color: '#ef4444' }   // Merah
      ]);

      // Update State Data Grafik AR (Bar Chart)
      setArInteractionData([
        { name: 'Sesi AR', Total: globalArSessions },
        { name: 'Interaksi AI', Total: globalAiInteractions }
      ]);

    } catch (error) {
      console.error("Gagal mengambil data Overview:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full text-xl font-bold text-gray-500">Menghitung statistik global...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Overview Dashboard</h1>
        <p className="text-gray-500 mt-2">Rangkuman metrik global dari Puzzle dan AR Arkeo Nusantara.</p>
      </div>

      {/* Grid Kartu Statistik Utama (KPI Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Pemain Terdaftar</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Sesi Puzzle</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalPuzzleSessions}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Sesi AR Dibuka</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalArSessions}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Waktu Main AR</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalArDuration} <span className="text-lg text-gray-500 font-normal">Menit</span></p>
        </div>

      </div>

      {/* Grid Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Grafik 1: Rasio Sukses vs Gagal Puzzle */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center">
          <h2 className="text-xl font-bold text-gray-700 w-full mb-4">Rasio Keberhasilan Puzzle</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={puzzleRatio}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {puzzleRatio.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grafik 2: Perbandingan Interaksi AR dan AI */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Total Sesi AR vs Interaksi AI</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={arInteractionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Total" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}