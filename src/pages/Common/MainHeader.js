import React from 'react';
// Importa NavLink para la navegación
import { NavLink } from 'react-router-dom';
import './MainHeader.css'; // Crearemos este archivo ahora

function MainHeader() {
  return (
    <header className="main-header">
      <div className="header-logo">
        <span role="img" aria-label="brain">🧠</span>
        <h1>CerebroVial</h1>
      </div>
      <nav className="main-nav">
        <NavLink 
          to="/" 
          // 'end' es importante para que no se mantenga activo en /forecast
          end 
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Dashboard de Intersección
        </NavLink>
        <NavLink 
          to="/forecast"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Panel de Pronóstico
        </NavLink>
      </nav>
    </header>
  );
}

export default MainHeader;