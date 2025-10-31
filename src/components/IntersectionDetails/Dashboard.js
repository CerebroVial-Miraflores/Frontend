import React from 'react';
import Header from './Header';
import KpiCard from './KpiCard';
import TrafficLightStatus from './TrafficLightStatus';
import CameraView from './CameraView';
import TrafficVolumeChart from './TrafficVolumeChart';
import './Dashboard.css';

// Recibe kpiData como un "prop"
function Dashboard({ kpiData }) {
  return (
    <div className="dashboard-container">
      
      {/* 1. Encabezado */}
      <Header />

      {/* 2. KPIs (Usando el componente reutilizable) */}
      <section className="kpi-section">
        <h2>Real-time KPIs</h2>
        <div className="kpi-grid">
          <KpiCard 
            label="Vehicles per minute" 
            value={`${kpiData.vehicles} vpm`} 
          />
          <KpiCard 
            label="Average Speed" 
            value={`${kpiData.speed} km/h`} 
          />
          <KpiCard
            label="Current Congestion Level"
            value={kpiData.congestion}
            // Pasamos un prop booleano para el estilo especial
            highlight={kpiData.congestion === 'HIGH'} 
          />
        </div>
      </section>

      {/* 3. Estado del Semáforo */}
      <TrafficLightStatus />

      {/* 4. Vista de Cámara */}
      <CameraView />

      {/* 5. Gráfico de Tráfico */}
      <TrafficVolumeChart />

    </div>
  );
}

export default Dashboard;