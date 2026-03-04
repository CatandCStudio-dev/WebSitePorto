import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Home from './pages/public/Home';
import Projects from './pages/public/Projects';
import ProjectCategory from './pages/public/ProjectCategory';
import ProjectDetail from './pages/public/ProjectDetail';
import Login from './pages/admin/Login';
import Overview from './pages/admin/Overview';
import PuzzleData from './pages/admin/PuzzleData';
import UserData from './pages/admin/UserData';
import ArData from './pages/admin/ArData';

function App() {
  return (
    <Router>
      <Routes>
        {/* JALUR PUBLIK (Website Utama) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:category" element={<ProjectCategory />} />
          <Route path="/projects/:category/:id" element={<ProjectDetail />} />
        </Route>

        {/* JALUR PRIVAT (Dashboard Riset) */}
        <Route path="/ar-historian-app/login" element={<Login />} />
        <Route path="/ar-historian-app" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="users" element={<UserData />} /> {/* Tambahkan Ini */}
          <Route path="puzzle" element={<PuzzleData />} />
          <Route path="ar-arkeo" element={<ArData />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;