import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase'; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function PuzzleData() {
  const [sessionData, setSessionData] = useState([]);
  const [detailedData, setDetailedData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Fitur Baru (Sama seperti ArData)
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'score', direction: 'desc' });
  const [filterStage, setFilterStage] = useState('All');
  const [filterPuzzleName, setFilterPuzzleName] = useState('All');
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
                puzzleName: puzzleName,
                duration: puzzleStats.durationSeconds || 0,
                isSuccess: puzzleStats.isSuccess ? 1 : 0, // Diubah ke angka untuk sorting
                isSuccessText: puzzleStats.isSuccess ? 'Berhasil' : 'Gagal',
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

  useEffect(() => { fetchData(); }, []);

  // LOGIKA PENCARIAN & FILTER
  const filteredData = detailedData.filter(item => {
    const matchesSearch = item.playerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.puzzleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'All' || item.stage === filterStage;
    const matchesPuzzle = filterPuzzleName === 'All' || item.puzzleName === filterPuzzleName;
    return matchesSearch && matchesStage && matchesPuzzle;
  });

  // LOGIKA SORTING
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const displayedDetails = sortedData.slice(0, visibleItems);

  // Opsi Unik untuk Dropdown
  const uniqueStages = ['All', ...new Set(detailedData.map(item => item.stage))];
  const availablePuzzles = detailedData
    .filter(item => filterStage === 'All' || item.stage === filterStage)
    .map(item => item.puzzleName);
  const uniquePuzzleNames = ['All', ...new Set(availablePuzzles)];

  // FITUR DOWNLOAD CSV
  const downloadCSV = () => {
    const headers = ["Pemain,Stage,Puzzle,Skor,Waktu (s),Status"];
    const rows = sortedData.map(item => 
      `${item.playerName},${item.stage},${item.puzzleName},${item.score},${item.duration},${item.isSuccessText}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data_puzzle_riset.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Memuat data riset...</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Analisis Data Puzzle</h1>
        {/* Ubah tombol download menjadi Gold */}
        <button 
          onClick={downloadCSV}
          className="bg-[#b38b59] hover:bg-[#8f6e45] text-white px-5 py-2 rounded-xl flex items-center gap-2 font-bold transition-all shadow-md shadow-[#b38b59]/20"
        >
          📥 Download CSV
        </button>
      </div>

      {/* SEARCH, FILTER & SORT BOX */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            {/* Ubah kotak search menjadi lebih melengkung dan outline Navy */}
            <input 
              type="text" 
              placeholder="Cari nama pemain atau puzzle..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#1a2b4c]/20 focus:border-[#1a2b4c] outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>

          <select 
            className="border border-gray-300 rounded-lg p-2 outline-none font-bold text-blue-700"
            value={`${sortConfig.key}-${sortConfig.direction}`}
            onChange={(e) => {
              const [key, direction] = e.target.value.split('-');
              setSortConfig({ key, direction });
            }}
          >
            <option value="score-desc">Urutkan: Skor Tertinggi</option>
            <option value="score-asc">Urutkan: Skor Terendah</option>
            <option value="duration-asc">Urutkan: Waktu Tercepat</option>
            <option value="duration-desc">Urutkan: Waktu Terlama</option>
            <option value="isSuccess-desc">Urutkan: Status Berhasil</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-4 border-t pt-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-gray-600">Stage:</label>
            <select className="border rounded p-1.5 text-sm bg-gray-50" value={filterStage} onChange={(e) => { setFilterStage(e.target.value); setFilterPuzzleName('All'); setVisibleItems(10); }}>
              {uniqueStages.map(s => <option key={s} value={s}>{s === 'All' ? 'Semua Stage' : s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-gray-600">Jenis Puzzle:</label>
            <select className="border rounded p-1.5 text-sm bg-gray-50 max-w-[200px]" value={filterPuzzleName} onChange={(e) => { setFilterPuzzleName(e.target.value); setVisibleItems(10); }}>
              {uniquePuzzleNames.map(p => <option key={p} value={p}>{p === 'All' ? 'Semua Puzzle' : p}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* GRAFIK SKOR */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Grafik Skor Permainan (Per Sesi)</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sessionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="playerName" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalScore" fill="#1a2b4c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABEL RINCIAN */}
      {/* Tabel kini bersudut membulat dengan header Navy/Gray soft */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-[#fcfdfd] border-b border-gray-100">
              <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 text-left">Nama Pemain</th>
                <th className="px-6 py-4 text-left">Stage & Puzzle</th>
                <th className="px-6 py-4 text-center">Skor</th>
                <th className="px-6 py-4 text-center">Waktu</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-50">
              {displayedDetails.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.playerName}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="font-bold block text-gray-800">{row.stage}</span>
                    <span className="text-xs text-blue-600 font-semibold">{row.puzzleName}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center font-black text-blue-600">{row.score}</td>
                  <td className="px-6 py-4 text-sm text-center text-gray-600">{row.duration}s</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${row.isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {row.isSuccessText}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sortedData.length > visibleItems && (
          <div className="p-4 text-center bg-gray-50 border-t">
            <button 
              onClick={() => setVisibleItems(v => v + 10)} 
              className="text-blue-600 font-bold hover:bg-blue-100 px-6 py-2 rounded-lg transition-all"
            >
              Tampilkan Lebih Banyak ({sortedData.length - visibleItems} tersisa)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}