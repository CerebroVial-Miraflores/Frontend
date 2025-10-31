import React from 'react';
import { Line } from 'react-chartjs-2';
import "./../../components/IntersectionDetails/Dashboard.css"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Importar Filler para el área bajo la curva
} from 'chart.js';

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Este es el componente que renderiza el gráfico
function ForecastChart({ data }) {

  // "Entonces debe ver un gráfico de líneas que muestre el nivel de congestión (eje Y) 
  // contra el tiempo (eje X, ej. 'Ahora', '+5min', '+10min', '+15min')."
  const chartData = {
    labels: ['Ahora', '+5 min', '+10 min', '+15 min'],
    datasets: [
      {
        label: 'Nivel de Congestión',
        data: data, // Los datos vienen como prop desde el componente padre
        borderColor: 'rgba(47, 128, 237, 1)', // --accent-blue
        backgroundColor: 'rgba(47, 128, 237, 0.2)', // Relleno azul traslúcido
        fill: true, // Activa el relleno
        tension: 0.3, // Suaviza la línea
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Ocultamos la leyenda (ya tenemos una personalizada abajo)
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Nivel de Congestión: ${context.parsed.y.toFixed(0)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100, // Eje Y va de 0 a 100 (Nivel de Congestión)
        grid: {
          color: 'rgba(224, 224, 224, 0.2)', // --border-color
        },
        ticks: {
          color: 'rgba(224, 224, 224, 0.7)', // --text-secondary
          callback: function (value) {
            return value + '%'; // Añadir símbolo de % al eje Y
          },
        },
      },
      x: {
        grid: {
          display: false, // Ocultar grid vertical
        },
        ticks: {
          color: 'rgba(224, 224, 224, 0.7)', // --text-secondary
        },
      },
    },
  };

  return <Line options={chartOptions} data={chartData} />;
}

export default ForecastChart;