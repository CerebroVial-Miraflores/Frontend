// CameraView.js
import React from 'react';

function CameraView() {
  return (
    <section className="camera-view">
      <h2>Camera View</h2>
      <div className="video-placeholder">
        {/* En un producto real, aquí iría tu componente 
            de Video Stream (p.ej. <video> o HLS.js) */}
        <img src="https://i.imgur.com/g0jHqGk.png" alt="Video placeholder" />
        <div className="video-overlay">
          <h3>Cam-07 • Av. Larco x Benavides</h3>
          <p>Live stream placeholder<br />Video unavailable in this prototype</p>
        </div>
      </div>
    </section>
  );
}
export default CameraView;