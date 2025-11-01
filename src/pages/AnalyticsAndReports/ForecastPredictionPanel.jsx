import React, { useState, useEffect } from 'react';
import ForecastChart from './ForecastChart'; // Reutilizamos el gráfico de antes
import './ForecastPredictionPanel.css'; // Nuevos estilos para los filtros y tabla

// --- Función para simular la data de tu modelo (HU005) ---
const getMockForecast = () => {
  const base = 30 + Math.random() * 40; // Congestión base
  return [
    base, // "Ahora"
    base + (Math.random() * 10 - 3), // "+5 min"
    base + (Math.random() * 15 - 5), // "+10 min"
    base + (Math.random() * 20 - 8), // "+15 min"
  ].map(val => Math.max(0, Math.min(100, val)));
};

// --- Datos de ejemplo para el resumen de predicciones ---
const getMockPredictionSummary = (interseccion) => {
    const now = new Date();
    const futureTimes = [0, 5, 10, 15]; // min
    
    // Generamos datos similares a los del gráfico para la tabla
    const forecast = getMockForecast(); 
    
    return futureTimes.map((offset, index) => {
        const predictionTime = new Date(now.getTime() + offset * 60 * 1000); // Añadir minutos
        return {
            time: predictionTime.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'}),
            intersection: interseccion,
            predictedCongestion: `${forecast[index].toFixed(0)}%`,
            expectedVehicles: Math.floor(Math.random() * (20000 - 10000 + 1) + 10000) // Simular conteo
        };
    });
};

function ForecastPredictionPanel() {
  const [fromDate, setFromDate] = useState('2025-07-01'); 
  const [intersection, setIntersection] = useState('Av. Larco x Benavides'); 
  const [forecastData, setForecastData] = useState(getMockForecast());
  const [predictionSummary, setPredictionSummary] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const generatePredictionReport = () => {
    // ... (El contenido de la función se mantiene igual) ...
    console.log(`Generando pronóstico para ${intersection} desde ${fromDate}`);
    setForecastData(getMockForecast()); 
    setPredictionSummary(getMockPredictionSummary(intersection)); 
    setLastUpdated(new Date());
  };

  useEffect(() => {
    // ... (El contenido del useEffect se mantiene igual) ...
    generatePredictionReport(); 

    const intervalId = setInterval(() => {
      setForecastData(getMockForecast());
      setPredictionSummary(getMockPredictionSummary(intersection)); 
      setLastUpdated(new Date());
    }, 10000); 

    return () => clearInterval(intervalId);
  }, [intersection, fromDate]); 

  return (
    // Le añadimos una clase 'forecast-panel-layout' para anular el CSS
    <div className="dashboard-container forecast-panel-layout">
      
      {/* Encabezado del Panel */}
      <header className="header" style={{ gridArea: 'header' }}>
        <div className="header-title">
          <span className="icon" role="img" aria-label="analytics">📈</span>
          <h1>Panel de Pronóstico de Congestión</h1>
        </div>
        <button className="export-button" onClick={() => alert('Generando PDF/Excel de Predicciones...')}>
          <span role="img" aria-label="export">📄</span> Export (PDF/Excel)
        </button>
      </header>

      {/* Área de Filtros */}
      <section className="filter-section" style={{ gridArea: 'filters' }}>
        <div className="filter-group">
          <label htmlFor="fromDate">From</label>
          <input 
            type="date" 
            id="fromDate" 
            className="input-field" 
            value={fromDate} 
            onChange={(e) => setFromDate(e.target.value)} 
          />
        </div>
        <div className="filter-group">
          <label htmlFor="intersection">Intersections</label>
          <input 
            type="text" 
            id="intersection" 
            className="input-field" 
            value={intersection} 
            onChange={(e) => setIntersection(e.target.value)} 
            placeholder="Av. Larco x Benavides, Av. Pardo x Comandante"
          />
        </div>
        <button className="generate-report-button" onClick={generatePredictionReport}>
          <span role="img" aria-label="report">📊</span> Generate Report
        </button>
      </section>
      
      {/* --- CAMBIOS AQUÍ --- */}
      {/* Ya no están dentro de 'main-content-grid', 
           les asignamos su área de grid directamente. */}

      {/* Gráfico de Predicción */}
      <section className="traffic-volume chart-area" style={{ gridArea: 'chart' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Pronóstico de Congestión • Intersección Seleccionada</h2>
          <span style={{ color: '#A0A0A0', fontSize: '0.9rem' }}>
            Última actualización: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
        <div className="chart-container" style={{ minHeight: '350px' }}>
          <ForecastChart data={forecastData} />
        </div>
        <div className="chart-legend">
          <span className="legend-dot" style={{ backgroundColor: '#2F80ED' }}></span>
          Nivel de Congestión Pronosticado
        </div>
        <p className="chart-info">
          <span role="img" aria-label="info">ℹ️</span> Predicción agregada para la intersección seleccionada.
        </p>
      </section>

      {/* Resumen de Predicciones */}
      <section className="report-summary table-area" style={{ gridArea: 'table' }}>
        <h2>Prediction Summary</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Intersection</th>
                <th>Predicted Congestion</th>
                <th>Expected Vehicles</th>
              </tr>
            </thead>
            <tbody>
              {predictionSummary.map((item, index) => (
                <tr key={index}>
                  <td>{item.time}</td>
                  <td>{item.intersection}</td>
                  <td>{item.predictedCongestion}</td>
                  <td>{item.expectedVehicles}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {/* --- FIN DE CAMBIOS --- */}

    </div>
  );
}

export default ForecastPredictionPanel;