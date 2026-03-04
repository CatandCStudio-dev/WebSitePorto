import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function ArData() {
  const [userSummaries, setUserSummaries] = useState([]);
  const [objectDetails, setObjectDetails] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Fitur Baru
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'scanCount', direction: 'desc' });
  const [filterMarker, setFilterMarker] = useState('All');
  const [visibleItems, setVisibleItems] = useState(10);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, "Users"));
      const usersMap = {};
      usersSnapshot.forEach(doc => {
        usersMap[doc.id] = doc.data().fullName || 'Anonim';
      });

      const statsSnapshot = await getDocs(collection(db, "UserStats"));
      const summaries = [];
      const details = [];
      const aggregatedMarkers = {};

      statsSnapshot.forEach(doc => {
        const data = doc.data();
        const userId = doc.id;
        const playerName = usersMap[userId] || userId;

        let userTotalScans = 0;
        let userTotalArDuration = 0;

        if (data.arTotalScannedMarkers) {
          Object.entries(data.arTotalScannedMarkers).forEach(([markerName, stats]) => {
            const scans = stats.scanCount || 0;
            const duration = stats.totalDurationSeconds || 0;
            userTotalScans += scans;
            userTotalArDuration += duration;

            details.push({
              id: `${userId}-${markerName}`,
              playerName,
              markerName,
              scanCount: scans,
              dwellTime: stats.dwellTimeSeconds || 0,
              inspectTime: stats.inspectTimeSeconds || 0,
              totalDuration: duration
            });

            if (!aggregatedMarkers[markerName]) {
              aggregatedMarkers[markerName] = { name: markerName, TotalScans: 0 };
            }
            aggregatedMarkers[markerName].TotalScans += scans;
          });
        }

        summaries.push({
          id: userId,
          playerName,
          aiCount: data.aiTotalInteractionCount || 0,
          aiDuration: data.aiTotalInteractionDuration || 0,
          totalScans: userTotalScans,
          totalArDuration: userTotalArDuration
        });
      });

      setUserSummaries(summaries);
      setObjectDetails(details);
      setChartData(Object.values(aggregatedMarkers));
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // LOGIKA PENCARIAN & FILTER
  const filteredData = objectDetails.filter(item => {
    const matchesSearch = item.playerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.markerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMarker = filterMarker === 'All' || item.markerName === filterMarker;
    return matchesSearch && matchesMarker;
  });

  // LOGIKA SORTING
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const displayedDetails = sortedData.slice(0, visibleItems);
  const uniqueMarkers = ['All', ...new Set(objectDetails.map(item => item.markerName))];

  // FITUR DOWNLOAD CSV
  const downloadCSV = () => {
    const headers = ["Pemain,Objek AR,Total Scan,Dwell Time (s),Inspect Time (s),Total Durasi (s)"];
    const rows = sortedData.map(item => 
      `${item.playerName},${item.markerName},${item.scanCount},${item.dwellTime},${item.inspectTime},${item.totalDuration}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "data_arkeo_nusantara.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Memuat data riset...</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Analisis AR Arkeo Nusantara</h1>
        <button 
          onClick={downloadCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 font-bold transition-all shadow-md"
        >
          📥 Download CSV
        </button>
      </div>

      {/* SEARCH & GLOBAL FILTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Cari pemain atau objek..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        <select 
          className="border border-gray-300 rounded-lg p-2 outline-none"
          value={filterMarker}
          onChange={(e) => setFilterMarker(e.target.value)}
        >
          {uniqueMarkers.map(m => <option key={m} value={m}>{m === 'All' ? 'Semua Objek' : m}</option>)}
        </select>

        <select 
          className="border border-gray-300 rounded-lg p-2 outline-none font-bold text-purple-700"
          value={`${sortConfig.key}-${sortConfig.direction}`}
          onChange={(e) => {
            const [key, direction] = e.target.value.split('-');
            setSortConfig({ key, direction });
          }}
        >
          <option value="scanCount-desc">Urutkan: Scan Terbanyak</option>
          <option value="scanCount-asc">Urutkan: Scan Terendah</option>
          <option value="dwellTime-desc">Urutkan: Dwell Terlama</option>
          <option value="inspectTime-desc">Urutkan: Inspect Terlama</option>
          <option value="totalDuration-desc">Urutkan: Durasi Terlama</option>
        </select>
      </div>

      {/* GRAFIK POPULARITAS */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Popularitas Objek (Total Scans)</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="TotalScans" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABEL RINCIAN */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4 text-left">Pemain</th>
                <th className="px-6 py-4 text-left">Objek AR</th>
                <th className="px-6 py-4 text-center">Scan</th>
                <th className="px-6 py-4 text-center">Dwell</th>
                <th className="px-6 py-4 text-center bg-blue-50 text-blue-700">Inspect</th>
                <th className="px-6 py-4 text-center">Durasi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedDetails.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.playerName}</td>
                  <td className="px-6 py-4 text-sm font-bold text-purple-600">{row.markerName}</td>
                  <td className="px-6 py-4 text-sm text-center font-bold">{row.scanCount}x</td>
                  <td className="px-6 py-4 text-sm text-center text-gray-500">{row.dwellTime}s</td>
                  <td className="px-6 py-4 text-sm text-center font-black text-blue-600 bg-blue-50/30">{row.inspectTime}s</td>
                  <td className="px-6 py-4 text-sm text-center font-medium">{row.totalDuration}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sortedData.length > visibleItems && (
          <div className="p-4 text-center bg-gray-50 border-t">
            <button 
              onClick={() => setVisibleItems(v => v + 10)} 
              className="text-purple-600 font-bold hover:bg-purple-100 px-6 py-2 rounded-lg transition-all"
            >
              Tampilkan Lebih Banyak ({sortedData.length - visibleItems} tersisa)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}