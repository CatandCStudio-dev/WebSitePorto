import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

export default function ArData() {
  const [detailedData, setDetailedData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMarker, setFilterMarker] = useState('All');
  
  // State untuk Paginasi (Batas tampilan data)
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
      const details = [];
      const aggregatedMarkers = {};

      statsSnapshot.forEach(doc => {
        const data = doc.data();
        const userId = doc.id;
        const playerName = usersMap[userId] || userId;

        if (data.arTotalScannedMarkers) {
          Object.entries(data.arTotalScannedMarkers).forEach(([markerName, stats]) => {
            details.push({
              id: `${userId}-${markerName}`,
              playerName: playerName,
              markerName: markerName,
              scanCount: stats.scanCount || 0,
              dwellTime: stats.dwellTimeSeconds || 0,
              inspectTime: stats.inspectTimeSeconds || 0,
              totalDuration: stats.totalDurationSeconds || 0
            });

            if (!aggregatedMarkers[markerName]) {
              aggregatedMarkers[markerName] = { name: markerName, TotalScans: 0 };
            }
            aggregatedMarkers[markerName].TotalScans += (stats.scanCount || 0);
          });
        }
      });

      setDetailedData(details);
      setChartData(Object.values(aggregatedMarkers));
    } catch (error) {
      console.error("Gagal mengambil data AR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredDetails = filterMarker === 'All' 
    ? detailedData 
    : detailedData.filter(item => item.markerName === filterMarker);

  // Memotong array data sesuai jumlah visibleItems (Paginasi Klien)
  const displayedDetails = filteredDetails.slice(0, visibleItems);

  const uniqueMarkers = ['All', ...new Set(detailedData.map(item => item.markerName))];

  // Fungsi untuk menambah batas tampilan saat tombol diklik
  const handleLoadMore = () => {
    setVisibleItems(prev => prev + 10);
  };

  if (loading) return <div className="flex h-full items-center justify-center font-bold text-gray-500">Memuat data AR...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Analisis AR Arkeo Nusantara</h1>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Popularitas Objek AR</h2>
        <div className="w-full mt-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="TotalScans" fill="#8b5cf6" name="Total Pemindaian" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500">Belum ada data.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-gray-700">Rincian Metrik Interaksi AR</h2>
          <div className="flex items-center gap-3">
            <label className="font-semibold text-gray-700 text-sm">Objek:</label>
            <select 
              className="border border-gray-300 rounded-md p-1.5 text-sm"
              value={filterMarker}
              onChange={(e) => {
                setFilterMarker(e.target.value);
                setVisibleItems(10); // Reset paginasi jika filter ganti
              }}
            >
              {uniqueMarkers.map(marker => (
                <option key={marker} value={marker}>{marker === 'All' ? 'Semua Objek' : marker}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Nama Pemain</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Objek AR</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Scan</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Dwell Time</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Total Durasi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedDetails.map((row) => (
                <tr key={row.id}>
                  <td className="px-6 py-4 text-sm font-medium">{row.playerName}</td>
                  <td className="px-6 py-4 text-sm font-bold text-purple-600">{row.markerName}</td>
                  <td className="px-6 py-4 text-sm font-bold">{row.scanCount}x</td>
                  <td className="px-6 py-4 text-sm">{row.dwellTime}s</td>
                  <td className="px-6 py-4 text-sm">{row.totalDuration}s</td>
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
              className="bg-purple-100 text-purple-700 hover:bg-purple-200 font-semibold py-2 px-6 rounded-md transition duration-200"
            >
              Tampilkan Lebih Banyak ({filteredDetails.length - visibleItems} tersisa)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}