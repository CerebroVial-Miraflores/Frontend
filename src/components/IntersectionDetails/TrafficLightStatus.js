import React, { useState, useEffect } from 'react';

function TrafficLightStatus() {
  // Este componente maneja su propio estado para el timer
  const [phase, setPhase] = useState({
    current: 'Red',
    remaining: 18,
    next: 'Green (N-S) → 45s'
  });

  // Efecto para manejar el temporizador
  useEffect(() => {
    // No hacer nada si el tiempo ya es 0
    if (phase.remaining <= 0) return;

    // Crear un intervalo que se ejecute cada segundo
    const timerId = setInterval(() => {
      // Usar la función de callback para actualizar el estado
      // basado en el estado anterior
      setPhase(prevPhase => ({
        ...prevPhase,
        remaining: prevPhase.remaining - 1
      }));
    }, 1000);

    // Función de limpieza: se ejecuta cuando el componente se desmonta
    // o antes de que el efecto se vuelva a ejecutar.
    return () => clearInterval(timerId);

  }, [phase.remaining]); // Dependencia: El efecto se re-ejecuta si 'phase.remaining' cambia

  // Formatear el tiempo a 00:00
  const formattedTime = `00:${phase.remaining.toString().padStart(2, '0')}`;

  return (
    <section className="traffic-light-status">
      <h2>Traffic Light Status</h2>
      <div className="light-container">
        {/* Clases dinámicas para activar la luz correcta */}
        <div className={`light red ${phase.current === 'Red' ? 'active' : ''}`}></div>
        <div className={`light yellow ${phase.current === 'Yellow' ? 'active' : ''}`}></div>
        <div className={`light green ${phase.current === 'Green' ? 'active' : ''}`}></div>
      </div>
      <div className="status-details">
        <p>Current Phase: <strong>{phase.current}</strong></p>
        <div className="timer" id="phase-timer">
          <span role="img" aria-label="timer">⏱️</span> {formattedTime} remaining
        </div>
        <p className="next-phase" id="next-phase">Next: {phase.next}</p>
      </div>
    </section>
  );
}

export default TrafficLightStatus;