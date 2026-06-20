import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

// Masukkan Measurement ID yang diberikan user
const TRACKING_ID = "G-34VJLKEET8"; 

// Inisialisasi Google Analytics
ReactGA.initialize(TRACKING_ID);

const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Merekam setiap kali user berpindah halaman (Pageview)
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location]);

  return null; // Komponen ini hanya berjalan di background, tidak me-render apapun
};

export default Analytics;
