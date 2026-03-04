import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Projects() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="block w-full">
      <div className="scroll-indicator visible"><span></span></div>
      <section id="portfolio" className="project-section">
        <div className="container">
          <h2 className="section-title">PROJECT CATEGORIES</h2>
          
          <div className="project-category-list">
            <Link to="/projects/games" className="category-item">
                <span className="category-name">Games</span>
                <span className="category-arrow">→</span>
            </Link>
            <Link to="/projects/designs" className="category-item">
                <span className="category-name">Designs</span>
                <span className="category-arrow">→</span>
            </Link>
            <Link to="/projects/mobiles" className="category-item">
                <span className="category-name">Mobile Apps</span>
                <span className="category-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}