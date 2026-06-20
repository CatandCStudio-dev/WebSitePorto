import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/public/Home';
import Projects from './pages/public/Projects';
import ProjectCategory from './pages/public/ProjectCategory';
import ProjectDetail from './pages/public/ProjectDetail';
import GameLobby from './pages/public/GameLobby';
import GameRoom from './pages/public/GameRoom';
import Login from './pages/admin/Login';
import Overview from './pages/admin/Overview';
import PuzzleData from './pages/admin/PuzzleData';
import UserData from './pages/admin/UserData';
import ArData from './pages/admin/ArData';

// 1. IMPORT HALAMAN 404 DI SINI
import NotFound from './pages/public/NotFound'; 
import Analytics from './components/Analytics';

function App() {
  return (
    <Router>
      <Analytics />
      <Routes>
        {/* JALUR PUBLIK (Website Utama) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:category" element={<ProjectCategory />} />
          <Route path="/projects/:category/:id" element={<ProjectDetail />} />
        </Route>

        {/* JALUR GAME (Standalone without layout wrapper) */}
        <Route path="/games/codenames" element={<GameLobby />} />
        <Route path="/games/codenames/:roomId" element={<GameRoom />} />

        {/* JALUR PRIVAT (Dashboard Riset) */}
        <Route path="/ar-historian-app/login" element={<Login />} />
        <Route path="/ar-historian-app" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="users" element={<UserData />} />
          <Route path="puzzle" element={<PuzzleData />} />
          <Route path="ar-arkeo" element={<ArData />} />
        </Route>

        {/* ========================================== */}
        {/* 2. TAMBAHKAN CATCH-ALL ROUTE (404) DI SINI */}
        {/* ========================================== */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;