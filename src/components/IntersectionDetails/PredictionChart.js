import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mapeo de niveles de tráfico a valores numéricos para el gráfico
const trafficLevelMapping = {
  'low': 1,
  'normal': 2,
  'high': 3,
  'heavy': 4,
};

// Etiquetas para el eje Y
const yAxisLabels = {
  1: 'Low',
  2: 'Normal',
  3: 'High',
  4: 'Heavy',
};

function PredictionChart() {
  const [predictionData, setPredictionData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrediction = () => {
      // Este es un ejemplo de las 'features' que tu modelo espera.
      // En una aplicación real, estos datos vendrían del estado de la aplicación.
      const requestBody = {
        features: [0.0, 25, 2, 70, 8, 3, 22, 103, 1]
      };

      fetch('http://localhost:8080/api/predict_traffic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Transformamos los datos para que recharts los entienda
        const formattedData = [
          { name: '+15 min', level: trafficLevelMapping[data.predicted_15_min] || 0 },
          { name: '+30 min', level: trafficLevelMapping[data.predicted_30_min] || 0 },
          { name: '+45 min', level: trafficLevelMapping[data.predicted_45_min] || 0 },
        ];
        setPredictionData(formattedData);
        setError(null);
      })
      .catch(err => {
        console.error("Error fetching prediction:", err);
        setError("Could not fetch prediction data.");
        setPredictionData([]);
      });
    };

    fetchPrediction();
    // Actualizar la predicción cada 30 segundos
    const intervalId = setInterval(fetchPrediction, 30000);

    return () => clearInterval(intervalId);
  }, []);

  if (error) {
    return <div className="chart-placeholder"><span>{error}</span></div>;
  }

  return (
    <section className="traffic-volume">
      <h2>Future Traffic Prediction</h2>
      <div className="chart-container" style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={predictionData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis dataKey="name" stroke="var(--text-secondary)" />
            {/* Eje Y personalizado con las etiquetas de texto */}
            <YAxis stroke="var(--text-secondary)" domain={[0, 4]} ticks={[1, 2, 3, 4]} tickFormatter={(value) => yAxisLabels[value]} />
            <Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} contentStyle={{backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)'}}/>
            <Bar dataKey="level" fill="var(--accent-blue)" barSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default PredictionChart;
