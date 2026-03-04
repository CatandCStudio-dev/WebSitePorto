import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function PuzzleData() {
  const [sessionData, setSessionData] = useState([]);
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter Ganda
  const [filterStage, setFilterStage] = useState('All');
  const [filterPuzzleName, setFilterPuzzleName] = useState('All');
  
  // State Paginasi
  const [visibleItems, setVisibleItems] = useState(10);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, "Users"));
      const usersMap = {};
      usersSnapshot.forEach(doc => {
        usersMap[doc.id] = doc.data().fullName || 'Anonim';
      });

      const gameDataSnapshot = await getDocs(collection(db, "GameData"));
      const sessions = [];
      const details = [];

      gameDataSnapshot.forEach(doc => {
        const data = doc.data();
        const playerName = usersMap[data.userId] || data.userId;
        
        sessions.push({
          id: doc.id,
          playerName: playerName,
          totalScore: data.totalScore || 0,
        });

        if (data.puzzleRecord) {
          Object.entries(data.puzzleRecord).forEach(([stageName, puzzles]) => {
            Object.entries(puzzles).forEach(([puzzleName, puzzleStats]) => {
              details.push({
                id: `${doc.id}-${stageName}-${puzzleName}`,
                playerName: playerName,
                stage: stageName,
                puzzleName: puzzleName, // Ekstrak nama puzzle spesifik
                duration: puzzleStats.durationSeconds || 0,
                isSuccess: puzzleStats.isSuccess,
                score: puzzleStats.score || 0
              });
            });
          });
        }
      });

      setSessionData(sessions);
      setDetailedData(details);

    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Logika Filter Berlapis (Stage DAN Puzzle Name)
  const filteredDetails = detailedData.filter(item => {
    const matchStage = filterStage === 'All' || item.stage === filterStage;
    const matchPuzzle = filterPuzzleName === 'All' || item.puzzleName === filterPuzzleName;
    return matchStage && matchPuzzle;
  });

  // Terapkan batas tampilan 10 baris
  const displayedDetails = filteredDetails.slice(0, visibleItems);

  // Dapatkan opsi unik untuk dropdown
  const uniqueStages = ['All', ...new Set(detailedData.map(item => item.stage))];
  
  // Ambil nama puzzle yang unik HANYA dari stage yang sedang dipilih
  const availablePuzzles = detailedData
    .filter(item => filterStage === 'All' || item.stage === filterStage)
    .map(item => item.puzzleName);
  const uniquePuzzleNames = ['All', ...new Set(availablePuzzles)];

  const handleLoadMore = () => {
    setVisibleItems(prev => prev + 10);
  };

  // Reset paginasi dan filter turunan jika filter utama berubah
  const handleStageChange = (e) => {
    setFilterStage(e.target.value);
    setFilterPuzzleName('All'); // Reset pilihan puzzle
    setVisibleItems(10);
  };

  if (loading) return <div className="flex justify-center h-full text-xl font-bold">Memuat data riset...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Analisis Data Puzzle</h1>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Grafik Total Skor Permainan (Per Sesi)</h2>
        <div className="w-full mt-4">
          {sessionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sessionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="playerName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalScore" fill="#3b82f6" name="Total Skor" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">Belum ada data skor.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h2 className="text-xl font-bold text-gray-700">Rincian Metrik per Puzzle</h2>
          
          {/* Area Filter Ganda */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="font-semibold text-gray-700 text-sm">Stage:</label>
              <select className="border p-1.5 text-sm bg-white rounded" value={filterStage} onChange={handleStageChange}>
                {uniqueStages.map(s => <option key={s} value={s}>{s === 'All' ? 'Semua Stage' : s}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-semibold text-gray-700 text-sm">Puzzle:</label>
              <select 
                className="border p-1.5 text-sm bg-white rounded max-w-[200px]" 
                value={filterPuzzleName} 
                onChange={(e) => { setFilterPuzzleName(e.target.value); setVisibleItems(10); }}
              >
                {uniquePuzzleNames.map(p => <option key={p} value={p}>{p === 'All' ? 'Semua Jenis Puzzle' : p}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Nama Pemain</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Stage & Puzzle</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Skor</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Waktu</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedDetails.map((row) => (
                <tr key={row.id}>
                  <td className="px-6 py-4 text-sm font-medium">{row.playerName}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="font-semibold block text-gray-800">{row.stage}</span>
                    <span className="text-xs text-blue-600">{row.puzzleName}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-blue-600">{row.score}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{row.duration}s</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${row.isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {row.isSuccess ? 'Berhasil' : 'Gagal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tombol Load More */}
        {filteredDetails.length > visibleItems && (
          <div className="p-4 border-t border-gray-200 flex justify-center bg-gray-50">
            <button 
              onClick={handleLoadMore}
              className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-semibold py-2 px-6 rounded-md transition duration-200"
            >
              Tampilkan Lebih Banyak ({filteredDetails.length - visibleItems} tersisa)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}