import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header>
      <nav className="navbar">
        <div className="container">
          <Link to="/" className="nav-logo"> 
            <img src="/assets/media/logo2_vectorized.png" alt="C&C Studio" />
            <span>C&C<br />STUDIO</span>
          </Link>
          
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li className="nav-item"><a href="/#home" className="nav-link" onClick={toggleMenu}>HOME</a></li>
            <li className="nav-item"><a href="/#services" className="nav-link" onClick={toggleMenu}>SERVICE</a></li>
            
            <li 
              className={`nav-item dropdown ${isDropdownOpen ? 'active' : ''}`}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <a href="/#projects" className="nav-link" onClick={(e) => e.preventDefault()}>PROJECT ▾</a>
              <ul className="dropdown-menu" style={{ display: isDropdownOpen ? 'block' : '' }}>
                <li><Link to="/projects" onClick={toggleMenu}>see all projects</Link></li>
              </ul>
            </li>
            
            <li className="nav-item"><a href="/#about" className="nav-link" onClick={toggleMenu}>ABOUT</a></li>
            <li className="nav-item"><a href="/#contact" className="nav-link" onClick={toggleMenu}>CONTACT</a></li>
          </ul>
          
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>
    </header>
  );
}