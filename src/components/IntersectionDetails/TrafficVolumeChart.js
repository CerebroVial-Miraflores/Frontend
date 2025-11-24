import React, { useState } from 'react';

function TrafficVolumeChart() {
  // 1. Estado para controlar la visibilidad del video
  // (Comienza 'apagado' por defecto)
  const [isVideoVisible, setIsVideoVisible] = useState(false);

  // 2. Convertimos la URL de YouTube a una URL "embed"
  // Original: https://www.youtube.com/watch?v=qMYlpMsWsBE
  // Embed:    https://www.youtube.com/embed/qMYlpMsWsBE
  // Añadimos parámetros para que parezca un stream en vivo:
  // autoplay=1: Intenta iniciar automáticamente (requiere mute=1)
  // mute=1: Inicia en silencio
  // controls=0: Oculta los controles de YouTube
  const embedUrl = "http://localhost:8080/video_feed"; 

  return (
    // Usamos la misma <section> que ya tenías
    <section className="traffic-volume">
      
      {/* 3. Contenedor para el título y los nuevos botones */}
      <div className="chart-header-controls">
        <h2>Traffic Volume • Last 60 minutes</h2>
        <div className="video-toggle-buttons">
          <button 
            className="video-toggle-button toggle-on"
            // Se ejecuta al hacer clic
            onClick={() => setIsVideoVisible(true)}
            // Se deshabilita si el video YA está visible
            disabled={isVideoVisible}
          >
            <span role="img" aria-label="play">▶</span> Encender Cámara
          </button>
          <button 
            className="video-toggle-button toggle-off"
            // Se ejecuta al hacer clic
            onClick={() => setIsVideoVisible(false)}
            // Se deshabilita si el video YA está apagado
            disabled={!isVideoVisible}
          >
            <span role="img" aria-label="stop">■</span> Apagar Cámara
          </button>
        </div>
      </div>
      
      {/* 4. Contenedor del gráfico/video */}
      <div className="chart-container">
        {/* 5. Lógica de renderizado condicional */}
        {isVideoVisible ? (
          // Si isVideoVisible es true, muestra el video
          <img
            className="video-iframe"
            src={embedUrl}
            title="Live Traffic Feed (CerebroVial)"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></img>
        ) : (
          // Si isVideoVisible es false, muestra el placeholder
          <div className="chart-placeholder">
            <span>(Cámara Apagada)</span>
          </div>
        )}
      </div>

      {/* La leyenda original (puedes dejarla o quitarla) */}
      <div className="chart-legend">
        <span className="legend-dot"></span> Vehicles / min
      </div>
    </section>
  );
}

export default TrafficVolumeChart;
