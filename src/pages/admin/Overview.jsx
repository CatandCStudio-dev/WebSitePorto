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
  const [topArMarkers, setTopArMarkers] = useState([]); // State Baru: Top 5 AR
  const [puzzleStatsSummary, setPuzzleStatsSummary] = useState({ mostCorrect: '-', mostIncorrect: '-' }); // State Baru: Puzzle Stats
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);

      // 1. Data User
      const usersSnapshot = await getDocs(collection(db, "Users"));
      const totalUsers = usersSnapshot.size;

      // 2. Data Puzzle (GameData) & Agregasi per Jenis Puzzle
      const gameDataSnapshot = await getDocs(collection(db, "GameData"));
      const totalPuzzleSessions = gameDataSnapshot.size;
      
      let globalSuccess = 0;
      let globalFailure = 0;
      const puzzlePerformance = {}; // { 'Nama Puzzle': { success: 0, failure: 0 } }

      gameDataSnapshot.forEach(doc => {
        const data = doc.data();
        globalSuccess += (data.totalPuzzleSuccess || 0);
        globalFailure += (data.totalPuzzleFailure || 0);

        // Agregasi per Nama Puzzle (seperti logika di PuzzleData.jsx)
        if (data.puzzleRecord) {
          Object.values(data.puzzleRecord).forEach(puzzles => {
            Object.entries(puzzles).forEach(([puzzleName, stats]) => {
              if (!puzzlePerformance[puzzleName]) {
                puzzlePerformance[puzzleName] = { success: 0, failure: 0 };
              }
              if (stats.isSuccess) puzzlePerformance[puzzleName].success += 1;
              else puzzlePerformance[puzzleName].failure += 1;
            });
          });
        }
      });

      // Cari Puzzle Terbaik & Terburuk
      let mostCorrect = { name: '-', val: -1 };
      let mostIncorrect = { name: '-', val: -1 };

      Object.entries(puzzlePerformance).forEach(([name, p]) => {
        if (p.success > mostCorrect.val) mostCorrect = { name, val: p.success };
        if (p.failure > mostIncorrect.val) mostIncorrect = { name, val: p.failure };
      });

      setPuzzleStatsSummary({ mostCorrect: mostCorrect.name, mostIncorrect: mostIncorrect.name });

      // 3. Data Global AR (UserStats) & Top 5 Markers
      const statsSnapshot = await getDocs(collection(db, "UserStats"));
      
      let globalArSessions = 0;
      let globalArDurationSeconds = 0;
      let globalAiInteractions = 0;
      const markerScanCounts = {}; // { 'Nama Objek': totalScan }

      statsSnapshot.forEach(doc => {
        const data = doc.data();
        globalArSessions += (data.sessionTotalCount || 0);
        globalArDurationSeconds += (data.sessionTotalDuration || 0);
        globalAiInteractions += (data.aiTotalInteractionCount || 0);

        // Agregasi Marker (seperti logika di ArData.jsx)
        if (data.arTotalScannedMarkers) {
          Object.entries(data.arTotalScannedMarkers).forEach(([name, stats]) => {
            markerScanCounts[name] = (markerScanCounts[name] || 0) + (stats.scanCount || 0);
          });
        }
      });

      // Ambil Top 5 Marker Berdasarkan Scan
      const top5Markers = Object.entries(markerScanCounts)
        .map(([name, Total]) => ({ name, Total }))
        .sort((a, b) => b.Total - a.Total)
        .slice(0, 5);

      setTopArMarkers(top5Markers);

      setStats({
        totalUsers,
        totalPuzzleSessions,
        totalArSessions: globalArSessions,
        totalArDuration: Math.floor(globalArDurationSeconds / 60)
      });

      setPuzzleRatio([
        { name: 'Berhasil', value: globalSuccess, color: '#10b981' },
        { name: 'Gagal', value: globalFailure, color: '#ef4444' }
      ]);

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

  useEffect(() => { fetchData(); }, []);

  if (loading) return <div className="flex justify-center items-center h-full text-xl font-bold text-gray-500">Menghitung statistik global...</div>;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Overview Dashboard</h1>
        <p className="text-gray-500 mt-2">Rangkuman metrik global dari Puzzle dan AR Arkeo Nusantara.</p>
      </div>

      {/* KPI Cards */}
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
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Sesi AR</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalArSessions}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Total Waktu AR</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalArDuration} <span className="text-lg text-gray-500 font-normal">Menit</span></p>
        </div>
      </div>

      {/* Baris Informasi Tambahan (Puzzle Stats Baru) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-6 rounded-xl border border-green-200 flex items-center gap-4">
          <div className="bg-green-500 text-white h-12 w-12 rounded-full flex items-center justify-center text-2xl font-bold">✓</div>
          <div>
            <h4 className="text-green-800 font-bold uppercase text-xs">Puzzle Paling Akurat (Banyak Benar)</h4>
            <p className="text-lg font-black text-green-900">{puzzleStatsSummary.mostCorrect}</p>
          </div>
        </div>
        <div className="bg-red-50 p-6 rounded-xl border border-red-200 flex items-center gap-4">
          <div className="bg-red-500 text-white h-12 w-12 rounded-full flex items-center justify-center text-2xl font-bold">!</div>
          <div>
            <h4 className="text-red-800 font-bold uppercase text-xs">Puzzle Paling Sulit (Banyak Gagal)</h4>
            <p className="text-lg font-black text-red-900">{puzzleStatsSummary.mostIncorrect}</p>
          </div>
        </div>
      </div>

      {/* Grid Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top 5 Objek AR (Bar Chart Baru) */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Top 5 Objek AR Terpopuler (Total Scan)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topArMarkers} layout="vertical" margin={{ left: 40, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" fontSize={12} width={100} />
                <Tooltip />
                <Bar dataKey="Total" fill="#8b5cf6" radius={[0, 4, 4, 0]} label={{ position: 'right', fontSize: 12, fill: '#666' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rasio Keberhasilan Puzzle (Pie Chart) */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 flex flex-col items-center">
          <h2 className="text-xl font-bold text-gray-700 w-full mb-4">Rasio Keberhasilan Puzzle Global</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={puzzleRatio}
                  cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {puzzleRatio.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Perbandingan Interaksi AR dan AI (Bar Chart) */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 lg:col-span-2">
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