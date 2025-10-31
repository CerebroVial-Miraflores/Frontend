// Header.js
import React from 'react';

function Header() {
  return (
    <header className="header">
      <div className="header-title">
        <span className="icon" role="img" aria-label="pin">📍</span>
        <h1>Detail: Intersection Av. Larco / Av. Benavides</h1>
      </div>
      <a href="#" className="back-link">&larr; Back to Dashboard</a>
    </header>
  );
}
export default Header;