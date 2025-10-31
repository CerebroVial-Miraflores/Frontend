import React, { useState, useEffect } from 'react';
import Dashboard from '../../components/IntersectionDetails/Dashboard';

const IntersectionDetails = () => {
  // --- Simulación de Datos del Backend ---
  // En la vida real, estos datos vendrían de tu API.
  const [kpiData, setKpiData] = useState({
    vehicles: 36,
    speed: 22,
    congestion: 'HIGH'
  });

  // Aquí es donde conectarías tu backend (como el de CerebroVial)
  /*
  useEffect(() => {
    // Inicia un intervalo para pedir datos cada 5 segundos
    const intervalId = setInterval(() => {
      fetch('https://tu-api.com/datos-interseccion')
        .then(res => res.json())
        .then(data => {
          setKpiData(data.kpis);
        })
        .catch(console.error);
    }, 5000);

    // Función de limpieza para detener el intervalo si el componente se desmonta
    return () => clearInterval(intervalId);
  }, []); // El array vacío [] significa que esto se ejecuta solo una vez (al montar)
  */
  
  return (
    <div className="App">
      <Dashboard kpiData={kpiData} />
    </div>
  );
};

export default IntersectionDetails;

