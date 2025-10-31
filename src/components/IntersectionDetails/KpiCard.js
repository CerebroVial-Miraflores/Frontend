import React from 'react';

// Recibe 'label', 'value' y 'highlight' como props
function KpiCard({ label, value, highlight }) {
  
  // Asigna clases de CSS dinámicamente basado en los props
  const valueClassName = `kpi-value ${highlight ? 'kpi-high' : ''}`;

  return (
    <div className="kpi-card">
      <span className="kpi-label">{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}

export default KpiCard;