import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function Overview() {
  const [stats, setStats] = useState({ totalUsers: 0, totalPuzzleSessions: 0, totalArSessions: 0, totalArDuration: 0 });
  const [puzzleRatio, setPuzzleRatio] = useState([]);
  const [arInteractionData, setArInteractionData] = useState([]);
  const [topArMarkers, setTopArMarkers] = useState([]); 
  const [puzzleStatsSummary, setPuzzleStatsSummary] = useState({ mostCorrect: '-', mostIncorrect: '-' }); 
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, "Users"));
      const totalUsers = usersSnapshot.size;

      const gameDataSnapshot = await getDocs(collection(db, "GameData"));
      const totalPuzzleSessions = gameDataSnapshot.size;
      
      let globalSuccess = 0; let globalFailure = 0;
      const puzzlePerformance = {}; 

      gameDataSnapshot.forEach(doc => {
        const data = doc.data();
        globalSuccess += (data.totalPuzzleSuccess || 0);
        globalFailure += (data.totalPuzzleFailure || 0);
        if (data.puzzleRecord) {
          Object.values(data.puzzleRecord).forEach(puzzles => {
            Object.entries(puzzles).forEach(([puzzleName, stats]) => {
              if (!puzzlePerformance[puzzleName]) puzzlePerformance[puzzleName] = { success: 0, failure: 0 };
              if (stats.isSuccess) puzzlePerformance[puzzleName].success += 1;
              else puzzlePerformance[puzzleName].failure += 1;
            });
          });
        }
      });

      let mostCorrect = { name: '-', val: -1 }; let mostIncorrect = { name: '-', val: -1 };
      Object.entries(puzzlePerformance).forEach(([name, p]) => {
        if (p.success > mostCorrect.val) mostCorrect = { name, val: p.success };
        if (p.failure > mostIncorrect.val) mostIncorrect = { name, val: p.failure };
      });
      setPuzzleStatsSummary({ mostCorrect: mostCorrect.name, mostIncorrect: mostIncorrect.name });

      const statsSnapshot = await getDocs(collection(db, "UserStats"));
      let globalArSessions = 0; let globalArDurationSeconds = 0; let globalAiInteractions = 0;
      const markerScanCounts = {}; 

      statsSnapshot.forEach(doc => {
        const data = doc.data();
        globalArSessions += (data.sessionTotalCount || 0);
        globalArDurationSeconds += (data.sessionTotalDuration || 0);
        globalAiInteractions += (data.aiTotalInteractionCount || 0);
        if (data.arTotalScannedMarkers) {
          Object.entries(data.arTotalScannedMarkers).forEach(([name, stats]) => {
            markerScanCounts[name] = (markerScanCounts[name] || 0) + (stats.scanCount || 0);
          });
        }
      });

      const top5Markers = Object.entries(markerScanCounts)
        .map(([name, Total]) => ({ name, Total }))
        .sort((a, b) => b.Total - a.Total)
        .slice(0, 5);

      setTopArMarkers(top5Markers);
      setStats({ totalUsers, totalPuzzleSessions, totalArSessions: globalArSessions, totalArDuration: Math.floor(globalArDurationSeconds / 60) });
      
      setPuzzleRatio([
        { name: 'Diselesaikan', value: globalSuccess, color: '#1a2b4c' }, 
        { name: 'Gagal', value: globalFailure, color: '#cbd5e1' } // Slate-300 agar sedikit lebih kontras dari sebelumnya
      ]);
      
      setArInteractionData([
        { name: 'Sesi AR Berjalan', Total: globalArSessions },
        { name: 'Interaksi AI', Total: globalAiInteractions }
      ]);

    } catch (error) { console.error("Error:", error); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-200">
          <p className="text-sm font-extrabold text-[#1a2b4c]">{`${payload[0].value} Data`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="h-10 w-10 border-4 border-slate-200 border-t-[#1a2b4c] rounded-full animate-spin mb-4"></div>
      <p className="text-sm font-bold text-slate-500 tracking-widest uppercase animate-pulse">Memuat Analitik...</p>
    </div>
  );

  return (
    // Penambahan antialiased agar teks lebih tajam di semua layar
    <div className="space-y-8 pb-12 animate-in fade-in duration-700 font-sans antialiased">
      
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-black text-[#1a2b4c] tracking-tight">Kinerja & Analitik</h1>
          <p className="text-slate-600 text-sm mt-1.5 font-medium">Pantau perkembangan riset dan interaksi pengguna Arkeo Nusantara.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-bold text-slate-700 tracking-wider uppercase">Live Data</span>
        </div>
      </div>

      {/* KPI WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* HERO CARD */}
        <div className="relative bg-[#1a2b4c] rounded-[1.5rem] p-7 overflow-hidden shadow-xl shadow-[#1a2b4c]/20 group">
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* Teks opacity ditingkatkan dari 70% ke 90% (blue-100) agar mudah dibaca */}
            <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-4">Total Pemain</p>
            <h2 className="text-5xl font-black text-white tracking-tighter">{stats.totalUsers}</h2>
          </div>
          <i className="bi bi-people-fill absolute -bottom-4 -right-2 text-7xl text-white/5 transform group-hover:scale-110 transition-transform duration-500"></i>
          <div className="absolute top-0 right-0 w-16 h-1 bg-[#b38b59] rounded-bl-full"></div>
        </div>

        {/* REGULAR CARDS */}
        {[
          { title: "Sesi Permainan Puzzle", val: stats.totalPuzzleSessions, icon: "bi-puzzle-fill", color: "text-[#b38b59]" },
          { title: "Sesi AR Dibuka", val: stats.totalArSessions, icon: "bi-box-seam-fill", color: "text-[#1a2b4c]" },
          { title: "Waktu Eksplorasi AR", val: `${stats.totalArDuration}m`, icon: "bi-stopwatch-fill", color: "text-slate-400" }
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-[1.5rem] p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between group hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
              {/* Warna text dipergelap dari gray-400 ke slate-500 */}
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-snug w-2/3">{kpi.title}</p>
              <i className={`bi ${kpi.icon} ${kpi.color} text-xl opacity-90`}></i>
            </div>
            <h2 className="text-4xl font-black text-[#1a2b4c] tracking-tighter">{kpi.val}</h2>
          </div>
        ))}
      </div>

      {/* INSIGHTS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl p-5 flex items-center gap-5 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="w-1.5 h-full bg-[#b38b59] absolute left-0 top-0"></div>
          <div className="h-12 w-12 rounded-full bg-[#b38b59]/10 flex items-center justify-center text-[#b38b59] text-xl flex-shrink-0">
            <i className="bi bi-star-fill"></i>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Materi Paling Dikuasai</p>
            <p className="text-lg font-black text-[#1a2b4c] leading-tight">{puzzleStatsSummary.mostCorrect}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 flex items-center gap-5 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] relative overflow-hidden">
          <div className="w-1.5 h-full bg-slate-300 absolute left-0 top-0"></div>
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xl flex-shrink-0">
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Materi Perlu Dievaluasi</p>
            <p className="text-lg font-black text-[#1a2b4c] leading-tight">{puzzleStatsSummary.mostIncorrect}</p>
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BAR CHART UTAMA */}
        <div className="lg:col-span-2 bg-white rounded-[1.5rem] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-100">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8">Intensitas Penggunaan</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={arInteractionData} barSize={60}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                {/* Warna label axis dipertegas menjadi slate-600 */}
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 13, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} />
                <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                <Bar dataKey="Total" fill="#1a2b4c" radius={[8, 8, 8, 8]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DONUT CHART */}
        <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col items-center relative">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 w-full text-center">Akurasi Jawaban Global</h3>
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={puzzleRatio} 
                  cx="50%" cy="50%" 
                  innerRadius={65} outerRadius={85} 
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none"
                >
                  {puzzleRatio.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
              <span className="text-3xl font-black text-[#1a2b4c]">
                {puzzleRatio[0]?.value ? Math.round((puzzleRatio[0].value / (puzzleRatio[0].value + puzzleRatio[1].value)) * 100) : 0}%
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Akurasi</span>
            </div>
          </div>
          <div className="flex gap-5 mt-6">
            {puzzleRatio.map((entry, index) => (
              <div key={index} className="flex items-center gap-2.5">
                <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{backgroundColor: entry.color}}></div>
                <span className="text-xs font-bold text-slate-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM CHART */}
      <div className="bg-white rounded-[1.5rem] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-slate-100">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Top 5 Objek Eksplorasi Terpopuler</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topArMarkers} layout="vertical" margin={{ left: 0, right: 30 }} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#334155', fontSize: 13, fontWeight: 700}} width={150} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
              <Bar dataKey="Total" fill="#b38b59" radius={[0, 6, 6, 0]} label={{ position: 'right', fontSize: 14, fill: '#1a2b4c', fontWeight: '900' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}