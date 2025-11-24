import React, { useState, useEffect } from 'react';
import Header from './Header';
import KpiCard from './KpiCard';
import TrafficLightStatus from './TrafficLightStatus';
import CameraView from './CameraView';
import TrafficVolumeChart from './TrafficVolumeChart';
import './Dashboard.css';
 
function Dashboard() {
  // 1. Estado para almacenar los datos de la API
  const [kpiData, setKpiData] = useState({
    vehicles: 0,
    speed: '0.0',
    congestion: '...',
  });
  // Estado para manejar la carga y los errores
  const [apiStatus, setApiStatus] = useState({ loading: true, error: null });
 
  // 2. useEffect para obtener los datos de la API periódicamente
  useEffect(() => {
    const fetchStats = () => {
      fetch('http://localhost:8080/api/stats')
        .then(response => {
          // Si la respuesta no es OK (ej. 503, 404), lanzamos un error para que lo capture el .catch()
          if (!response.ok) {
            // Intentamos leer el cuerpo del error para dar más detalles
            return response.json().then(err => {
              throw new Error(err.error || `HTTP error! status: ${response.status}`);
            });
          }
          return response.json();
        })
        .then(data => {
          // Mapeamos los datos de la API a nuestro estado
          setKpiData({
            vehicles: data.total_count || 0,
            speed: data.average_speed_kmh ? data.average_speed_kmh.toFixed(1) : '0.0',
            // Lógica simple para el nivel de congestión (puedes ajustarla)
            congestion: data.average_speed_kmh < 30 ? 'NORMAL' : 'LOW'
          });
          // Si todo fue bien, limpiamos cualquier error anterior
          setApiStatus({ loading: false, error: null });
        })
        .catch(error => {
          console.error('Error fetching API stats:', error);
          // Guardamos el mensaje de error en el estado para poder mostrarlo en la UI
          setApiStatus({ loading: false, error: error.message });
        });
    };
 
    fetchStats(); // Primera llamada inmediata
    const intervalId = setInterval(fetchStats, 1000); // Actualizar cada 1 segundo
 
    return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez (al montar)

  // Si hay un error, podemos mostrarlo en el KPI de congestión
  const congestionValue = apiStatus.error ? 'API ERROR' : kpiData.congestion;
 
  return (
    <div className="dashboard-container">
      
      {/* 1. Encabezado */}
      <Header />

      {/* 2. KPIs (Usando el componente reutilizable) */}
      <section className="kpi-section">
        <h2>Real-time KPIs</h2>
        <div className="kpi-grid">
          <KpiCard 
            label="Total Vehicles" 
            value={`${kpiData.vehicles}`} 
          />
          <KpiCard 
            label="Average Speed" 
            value={`${kpiData.speed} km/h`} 
          />
          <KpiCard
            label="Current Congestion Level"
            value={congestionValue}
            // Pasamos un prop booleano para el estilo especial
            highlight={congestionValue !== 'HIGH' && congestionValue !== 'API ERROR'} 
          />
        </div>
      </section>

      {/* 3. Estado del Semáforo */}
      <TrafficLightStatus />

      {/* 4. Vista de Cámara */}
      <TrafficVolumeChart />

      {/* 5. Gráfico de Tráfico */}
      <CameraView />

    </div>
  );
}

export default Dashboard;