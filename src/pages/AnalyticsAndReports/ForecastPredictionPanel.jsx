import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './ForecastPredictionPanel.css'; // Nuevos estilos para los filtros y tabla

// Mapeo de niveles de tráfico a valores numéricos para el gráfico
const trafficLevelMapping = {
  'low': 1,
  'normal': 2,
  'high': 3,
  'heavy': 4,
};

// Etiquetas para el eje Y del gráfico
const yAxisLabels = {
  1: 'Low',
  2: 'Normal',
  3: 'High',
  4: 'Heavy',
};

function ForecastPredictionPanel() {
  const [fromDate, setFromDate] = useState('2025-07-01'); 
  const [intersection, setIntersection] = useState('Av. Larco x Benavides'); 
  const [chartData, setChartData] = useState([]);
  const [predictionSummary, setPredictionSummary] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState(null);

  // --- NUEVA LÓGICA PARA CARGAR DATOS HISTÓRICOS DEL CSV ---
  useEffect(() => {
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    const currentDayName = weekDays[today.getDay()];
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();

    const loadHistoricalData = async () => {
      try {
        // 1. Cargar el archivo CSV desde la carpeta 'public'
        const response = await fetch('/data/test_data.csv');
        const csvText = await response.text();

        // 2. Parsear el CSV a un array de objetos
        const rows = csvText.split('\n').slice(1).filter(rowStr => rowStr); // Omitir cabecera y filtrar líneas vacías
        // Limpiamos las cabeceras de posibles '\r' y espacios
        const headers = csvText.split('\n')[0].split(',').map(h => h.trim());
        const allData = rows.map(rowStr => {
          const values = rowStr.split(',');
          const rowObject = {}; // Crear un nuevo objeto para cada fila
          headers.forEach((header, index) => { // Ahora 'header' está limpio
            rowObject[header.trim()] = values[index] ? values[index].trim() : '';
          });
          return rowObject;
        });

        // 3. Encontrar el primer bloque de datos para el día de la semana actual
        const firstMatchingDayRow = allData.find(row => row['Day of the week'] === currentDayName);
        if (!firstMatchingDayRow) {
          setPredictionSummary([]); // No hay datos para este día
          return;
        }
        const targetDate = firstMatchingDayRow.Date;

        // 4. Filtrar todos los datos para esa fecha y hasta la hora actual
        const historicalDataForToday = allData.filter(row => {
          if (row.Date !== targetDate) return false;

          const [time, period] = row.Time.split(' ');
          let [hour, minute] = time.split(':').map(Number);

          if (period === 'PM' && hour !== 12) hour += 12;
          if (period === 'AM' && hour === 12) hour = 0; // Medianoche

          return hour < currentHour || (hour === currentHour && minute <= currentMinute);
        });

        // 5. Formatear los datos para la tabla
        const formattedSummary = historicalDataForToday.map(row => ({
          time: row.Time,
          intersection: intersection, // Mantenemos la intersección seleccionada
          predictedCongestion: row['Traffic Situation'].charAt(0).toUpperCase() + row['Traffic Situation'].slice(1),
          expectedVehicles: row.Total,
          originalData: row, // Guardamos la fila original para el click
        }));

        // Función robusta para convertir "HH:MM:SS AM/PM" a un número comparable
        const timeToNumber = (timeStr) => {
          const [time, period] = timeStr.split(' ');
          let [hour, minute, second] = time.split(':').map(Number);
          if (period === 'PM' && hour !== 12) hour += 12;
          if (period === 'AM' && hour === 12) hour = 0; // Medianoche
          return hour * 3600 + minute * 60 + second;
        };

        // Ordenamos el array para asegurar que los datos más recientes (horas mayores) estén primero.
        // Usamos nuestra nueva función para evitar el error de las 12 PM.
        formattedSummary.sort((a, b) => timeToNumber(b.time) - timeToNumber(a.time));

        setPredictionSummary(formattedSummary);

      } catch (err) {
        console.error("Error loading historical CSV data:", err);
        setError("Could not load historical data.");
      }
    };

    loadHistoricalData();
    // Actualizar el historial cada minuto para reflejar la hora actual
    const intervalId = setInterval(loadHistoricalData, 60000);
    return () => clearInterval(intervalId);

  }, [intersection]); // Se vuelve a ejecutar si cambia la intersección

  const generatePredictionReport = async () => {
    console.log(`Generando pronóstico para ${intersection}`);
    setError(null);

    // En una aplicación real, estas 'features' serían dinámicas.
    // Por ahora, usamos las de ejemplo para que la API funcione.
    const requestBody = {
      features: [0.0, 25, 2, 70, 8, 3, 22, 103, 1]
    };

    try {
      const response = await fetch('http://localhost:8080/api/predict_traffic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();

      // 1. Formatear datos para el GRÁFICO
      const formattedChartData = [
        { name: '+15 min', level: trafficLevelMapping[data.predicted_15_min] || 0 },
        { name: '+30 min', level: trafficLevelMapping[data.predicted_30_min] || 0 },
        { name: '+45 min', level: trafficLevelMapping[data.predicted_45_min] || 0 },
      ];
      setChartData(formattedChartData);

      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching prediction:", err);
      setError("Could not fetch prediction data.");
      setChartData([]);
      setPredictionSummary([]);
    }
  };

  // --- NUEVA FUNCIÓN PARA MANEJAR EL CLICK EN UNA FILA ---
  const handleRowClick = async (rowData) => {
    console.log("Row clicked. Transforming data and fetching prediction:", rowData.originalData);
    
    const original = rowData.originalData;

    // --- 1. Transformar los datos de la fila según las reglas ---

    // Dato 1: Hora a float
    const [time, period] = original.Time.split(' ');
    let [hour, minute] = time.split(':').map(Number);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    const timeFeature = hour + (minute / 60.0);

    // Dato 2: Fecha (se envía tal cual)
    const dateFeature = parseFloat(original.Date);

    // Dato 3: Día de la semana a número
    const dayMapping = { "Monday": 0, "Tuesday": 1, "Wednesday": 2, "Thursday": 3, "Friday": 4, "Saturday": 5, "Sunday": 6 };
    const dayFeature = dayMapping[original['Day of the week']];

    // Datos 4-8: Conteos de vehículos (se envían tal cual)
    const carCount = parseFloat(original.CarCount);
    const bikeCount = parseFloat(original.BikeCount);
    const busCount = parseFloat(original.BusCount);
    const truckCount = parseFloat(original.TruckCount);
    const totalCount = parseFloat(original.Total);

    // Dato 9: Situación del tráfico a número
    const situationMapping = { "low": 0, "normal": 1, "high": 2, "heavy": 3 };
    const situationFeature = situationMapping[original['Traffic Situation']];

    // Construir el array final de 9 features
    const features = [timeFeature, dateFeature, dayFeature, carCount, bikeCount, busCount, truckCount, totalCount, situationFeature];
    console.log("Transformed features sent to API:", features);

    const requestBody = {
      features: features
    };

    try {
      const response = await fetch('http://localhost:8080/api/predict_traffic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API Error on row click: ${response.statusText}`);
      }

      const data = await response.json();

      // 2. Actualizar solo el gráfico con la nueva predicción.
      const formattedChartData = [
        { name: '+15 min', level: trafficLevelMapping[data.predicted_15_min] || 0 },
        { name: '+30 min', level: trafficLevelMapping[data.predicted_30_min] || 0 },
        { name: '+45 min', level: trafficLevelMapping[data.predicted_45_min] || 0 },
      ];
      setChartData(formattedChartData);
      setLastUpdated(new Date()); // Actualizamos la hora de la última actualización
    } catch (err) {
      console.error("Error fetching prediction on row click:", err);
      setError("Could not update prediction."); // Mostramos un error si falla
    }
  };

  useEffect(() => {
    // Este useEffect ahora solo se encarga del gráfico de predicción
    generatePredictionReport(); 
    const intervalId = setInterval(generatePredictionReport, 30000); 
    return () => clearInterval(intervalId);
  }, [intersection]);

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
        {error ? <div className="chart-placeholder"><span>{error}</span></div> : (
          <div className="chart-container" style={{ minHeight: '350px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" domain={[0, 4]} ticks={[1, 2, 3, 4]} tickFormatter={(value) => yAxisLabels[value]} />
                <Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} contentStyle={{backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)'}}/>
                <Bar dataKey="level" fill="var(--accent-blue)" barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="chart-legend">
          <span className="legend-dot" style={{ backgroundColor: '#2F80ED' }}></span>
          Nivel de Tráfico Pronosticado
        </div>
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
                <tr key={index} onClick={() => handleRowClick(item)} style={{ cursor: 'pointer' }}>
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