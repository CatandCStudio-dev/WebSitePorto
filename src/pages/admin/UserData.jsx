import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export default function UserData() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, "Users"));
      const usersData = {};
      usersSnapshot.forEach(doc => {
        usersData[doc.id] = { id: doc.id, ...doc.data() };
      });

      const statsSnapshot = await getDocs(collection(db, "UserStats"));
      const combinedData = [];

      statsSnapshot.forEach(doc => {
        const stats = doc.data();
        const profile = usersData[doc.id] || {};

        combinedData.push({
          id: doc.id,
          name: profile.fullName || 'Anonim',
          email: profile.email || '-',
          joinDate: profile.joinDate || profile.createdAt || null,
          lastLogin: profile.lastLogin || null,
          pp: profile.pp || profile.profilePicture || null,
          sessionCount: stats.sessionTotalCount || 0,
          sessionDuration: stats.sessionTotalDuration || 0,
          aiCount: stats.aiTotalInteractionCount || 0,
          aiDuration: stats.aiTotalInteractionDuration || 0
        });
      });

      setUsers(combinedData);
    } catch (error) {
      console.error("Gagal memuat data user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('id-ID', { 
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}j ${mins}m ${secs}s`;
  };

  if (loading) return <div className="p-8 text-center font-bold text-gray-500">Memproses Database Pemain...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Database Pemain</h1>
        <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold text-sm">
          Total: {users.length} Pemain
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 text-left">Profil</th>
                <th className="px-6 py-4 text-left">Info Akun</th>
                <th className="px-6 py-4 text-left">Akses Terakhir</th>
                <th className="px-6 py-4 text-center bg-blue-50/50">Sesi App</th>
                <th className="px-6 py-4 text-center bg-purple-50/50">Interaksi AI</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex-shrink-0">
                        {user.pp ? (
                          <img src={user.pp} alt="PP" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400 font-bold text-xl uppercase">
                            {user.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-400 font-mono">{user.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 font-medium">{user.email}</div>
                    <div className="text-xs text-gray-400 italic">Terdaftar: {formatDate(user.joinDate)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-green-100 text-green-700">
                      {formatDate(user.lastLogin)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center bg-blue-50/30">
                    <div className="text-sm font-bold text-blue-700">{user.sessionCount} Sesi</div>
                    <div className="text-xs text-blue-500">{formatDuration(user.sessionDuration)}</div>
                  </td>
                  <td className="px-6 py-4 text-center bg-purple-50/30">
                    <div className="text-sm font-bold text-purple-700">{user.aiCount} Interaksi</div>
                    <div className="text-xs text-purple-500">{formatDuration(user.aiDuration)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}