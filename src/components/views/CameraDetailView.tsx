import React from 'react';
import { ArrowLeft, Car, Activity, Zap, Users, AlertTriangle, Camera } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface CameraDetailViewProps {
    cameraId: string;
    onBack: () => void;
}

export const CameraDetailView = ({ cameraId, onBack }: CameraDetailViewProps) => {
    const [metrics, setMetrics] = React.useState({
        vehiclesPerHour: 0,
        avgSpeed: 0,
        congestionLevel: 'Bajo',
        density: '0%',
        pedestrians: 0,
        incidents: 0
    });

    const [viewMode, setViewMode] = React.useState<'raw' | 'processed'>('processed');

    // cameraId comes as "CAM_001", so we use it directly.
    // If it were a number, we would pad it. But now we enforce string.
    const formattedCameraId = cameraId;

    React.useEffect(() => {
        // Connect to SSE stream
        const eventSource = new EventSource(`http://localhost:8000/stream/${formattedCameraId}`);

        eventSource.addEventListener('analysis', (event) => {
            try {
                console.log("SSE Message received:", event.data);
                const data = JSON.parse(event.data);
                console.log("Parsed SSE Data:", data);
                setMetrics({
                    vehiclesPerHour: data.total_vehicles || 0,
                    avgSpeed: data.avg_speed || 0,
                    congestionLevel: data.congestion_level || 'Bajo',
                    density: data.density || '0%',
                    pedestrians: data.pedestrians || 0,
                    incidents: data.incidents || 0
                });
            } catch (e) {
                console.error("Error parsing SSE data", e);
            }
        });

        eventSource.onerror = (e) => {
            console.error("SSE Error:", e);
        };

        return () => {
            eventSource.close();
        };
    }, [formattedCameraId]);

    const cameraData = {
        id: cameraId,
        name: cameraId === 'CAM_001' ? 'Av. Larco / Av. Benavides' :
            cameraId === 'CAM_002' ? 'Av. Pardo / Av. Espinar' :
                cameraId === 'CAM_003' ? 'Av. Arequipa / Av. Angamos' : 'Ovalo Gutiérrez',
        status: cameraId === 'CAM_001' ? 'critical' : cameraId === 'CAM_002' ? 'moderate' : 'good',
        streamUrl: `http://localhost:8000/video/${formattedCameraId}?type=${viewMode}`,
        metrics: metrics
    };

    const getCongestionStyles = (level: string) => {
        switch (level.toLowerCase()) {
            case 'alto':
                return { width: '100%', color: 'bg-red-500', text: 'text-red-400' };
            case 'moderado':
                return { width: '66%', color: 'bg-amber-500', text: 'text-amber-400' };
            case 'bajo':
            default:
                return { width: '33%', color: 'bg-emerald-500', text: 'text-emerald-400' };
        }
    };

    const congestionStyle = getCongestionStyles(cameraData.metrics.congestionLevel);

    return (
        <div className="h-full flex flex-col gap-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            {cameraData.name}
                            <Badge status={cameraData.status} />
                        </h2>
                        <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                            <Camera className="w-4 h-4" />
                            <span>ID: {cameraData.id}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-emerald-400">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                En vivo
                            </span>
                        </div>
                    </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                    <button
                        onClick={() => setViewMode('raw')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'raw'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Vista Original
                    </button>
                    <button
                        onClick={() => setViewMode('processed')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === 'processed'
                            ? 'bg-indigo-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Vista Procesada
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Video Stream Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-0 overflow-hidden border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.1)]">
                        <div className="relative aspect-video bg-slate-900">
                            {/* Live Badge */}
                            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-red-500/90 text-white px-3 py-1 rounded text-xs font-bold animate-pulse">
                                <span className="w-2 h-2 bg-white rounded-full"></span>
                                EN VIVO
                            </div>

                            {/* Overlay Info */}
                            <div className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur text-white px-3 py-1 rounded text-xs font-mono border border-white/10">
                                {new Date().toLocaleTimeString()}
                            </div>

                            {/* Stream Placeholder */}
                            <img
                                src={cameraData.streamUrl}
                                alt="Camera Stream"
                                className="w-full h-full object-cover opacity-80"
                            />

                        </div>

                        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
                            <div className="flex gap-4 text-sm text-slate-400">
                                <span>FPS: <span className="text-emerald-400 font-mono">24</span></span>
                                <span>Bitrate: <span className="text-emerald-400 font-mono">4.5 Mbps</span></span>
                                <span>Latency: <span className="text-emerald-400 font-mono">120ms</span></span>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded transition-colors">
                                    Analítica en Tiempo Real
                                </button>
                                <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition-colors">
                                    Histórico
                                </button>
                            </div>
                        </div>
                    </Card>

                    {/* AI Insights */}
                    <Card className="bg-gradient-to-r from-indigo-900/20 to-slate-800/40 border-indigo-500/20">
                        <h3 className="text-sm font-bold text-indigo-400 mb-3 flex items-center gap-2">
                            <Zap size={16} /> Insights de IA (CerebroVial)
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Se detecta un incremento del <span className="text-amber-400 font-bold">15%</span> en la densidad vehicular respecto al promedio histórico de los martes a esta hora.
                            El modelo predictivo sugiere ajustar el semáforo en <span className="text-emerald-400 font-bold">Av. Larco</span> para dar 10s adicionales de luz verde y descongestionar el flujo hacia el sur.
                        </p>
                    </Card>
                </div>

                {/* Metrics Sidebar */}
                <div className="space-y-4">
                    <Card>
                        <h3 className="font-bold text-white mb-4 text-sm">Métricas en Tiempo Real</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-slate-900/50 rounded border border-slate-800">
                                <div className="text-slate-400 text-xs mb-1 flex items-center gap-1"><Car size={12} /> Vehículos/h</div>
                                <div className="text-xl font-bold text-white">{cameraData.metrics.vehiclesPerHour}</div>
                            </div>
                            <div className="p-3 bg-slate-900/50 rounded border border-slate-800">
                                <div className="text-slate-400 text-xs mb-1 flex items-center gap-1"><Activity size={12} /> Vel. Promedio</div>
                                <div className="text-xl font-bold text-white">{cameraData.metrics.avgSpeed} <span className="text-xs font-normal text-slate-500">km/h</span></div>
                            </div>
                            <div className="p-3 bg-slate-900/50 rounded border border-slate-800">
                                <div className="text-slate-400 text-xs mb-1 flex items-center gap-1"><Users size={12} /> Peatones</div>
                                <div className="text-xl font-bold text-white">{cameraData.metrics.pedestrians}</div>
                            </div>
                            <div className="p-3 bg-slate-900/50 rounded border border-slate-800">
                                <div className="text-slate-400 text-xs mb-1 flex items-center gap-1"><AlertTriangle size={12} /> Incidentes</div>
                                <div className="text-xl font-bold text-amber-400">{cameraData.metrics.incidents}</div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-bold text-white mb-4 text-sm">Estado del Tráfico</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs text-slate-400 mb-1">
                                    <span>Congestión</span>
                                    <span className={`${congestionStyle.text} font-bold`}>{cameraData.metrics.congestionLevel}</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div
                                        className={`${congestionStyle.color} h-full transition-all duration-500`}
                                        style={{ width: congestionStyle.width }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-slate-400 mb-1">
                                    <span>Densidad Vehicular</span>
                                    <span className="text-white font-bold">{cameraData.metrics.density}</span>
                                </div>
                                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-indigo-500 h-full transition-all duration-500"
                                        style={{ width: cameraData.metrics.density }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="bg-slate-800/30">
                        <h3 className="font-bold text-white mb-3 text-sm">Control de Dispositivo</h3>
                        <div className="space-y-2">
                            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-300 transition-colors">
                                Reiniciar Nodo Edge
                            </button>
                            <button className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs text-slate-300 transition-colors">
                                Calibrar Cámara
                            </button>
                            <button className="w-full py-2 bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 rounded text-xs text-red-400 transition-colors">
                                Reportar Fallo
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
