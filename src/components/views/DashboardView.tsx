import React from 'react';
import { Car, TrendingDown, Activity, ShieldCheck, TrendingUp, Settings, Video, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

// --- DATOS MOCK ---
const intersections = [
    { id: 1, name: 'Av. Larco / Av. Benavides', status: 'critical', speed: 12, flow: 45, cam: 'CAM-01', prediction: 'Alta Congestión en 5 min' },
    { id: 2, name: 'Av. Pardo / Av. Espinar', status: 'moderate', speed: 25, flow: 28, cam: 'CAM-02', prediction: 'Estable' },
    { id: 3, name: 'Av. Arequipa / Av. Angamos', status: 'good', speed: 35, flow: 15, cam: 'CAM-03', prediction: 'Fluido' },
    { id: 4, name: 'Ovalo Gutiérrez', status: 'moderate', speed: 22, flow: 30, cam: 'CAM-04', prediction: 'Tendencia al alza' },
];

const alerts = [
    { id: 1, type: 'Congestión', msg: 'Nivel crítico detectado en Av. Larco', time: 'Hace 2 min', details: 'Velocidad flujo < 10km/h por más de 5 minutos.' },
    { id: 2, type: 'IA', msg: 'Predicción: Bloqueo en 10 min (Pardo)', time: 'Hace 5 min', details: 'Modelo GRU detecta patrón de saturación inminente.' },
    { id: 3, type: 'Hardware', msg: 'Latencia alta en Nodo Edge #4', time: 'Hace 12 min', details: 'Ping > 500ms en dispositivo Raspberry Pi intersección 4.' },
];

export const DashboardView = ({ onSelectCamera }: { onSelectCamera: (id: number) => void }) => {
    return (
        <div className="space-y-6">
            {/* FILA DE KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-indigo-900/40 to-slate-800/40 border-indigo-500/20">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-indigo-500/20 rounded-lg"><Car className="text-indigo-400" size={20} /></div>
                    </div>
                    <h3 className="text-3xl font-bold text-white">1,245</h3>
                    <p className="text-sm text-slate-400">Vehículos detectados (Hora)</p>
                </Card>

                <Card className="bg-gradient-to-br from-rose-900/40 to-slate-800/40 border-rose-500/20">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-rose-500/20 rounded-lg"><TrendingDown className="text-rose-400" size={20} /></div>
                        <span className="text-xs text-slate-400 font-mono">KPI-02</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white">22 km/h</h3>
                    <p className="text-sm text-slate-400">Velocidad Promedio (Red)</p>
                </Card>

                <Card className="bg-gradient-to-br from-amber-900/40 to-slate-800/40 border-amber-500/20">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-amber-500/20 rounded-lg"><Activity className="text-amber-400" size={20} /></div>
                    </div>
                    <h3 className="text-3xl font-bold text-white">ALTA</h3>
                    <p className="text-sm text-slate-400">Predicción Congestión (15m)</p>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-900/40 to-slate-800/40 border-emerald-500/20">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-emerald-500/20 rounded-lg"><ShieldCheck className="text-emerald-400" size={20} /></div>
                    </div>
                    <h3 className="text-3xl font-bold text-white">34/34</h3>
                    <p className="text-sm text-slate-400">Semáforos Conectados</p>
                </Card>
            </div>

            {/* ÁREA PRINCIPAL: MAPA Y LISTA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                {/* Contenedor del Mapa */}
                <Card className="lg:col-span-2 relative p-0 overflow-hidden group">
                    <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur px-3 py-1 rounded border border-slate-700 text-xs text-white">
                        Vista Satelital: Miraflores Centro
                    </div>
                    {/* Mapa Simulado */}
                    <div className="w-full h-full bg-slate-800 relative">
                        <div className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                        {/* Simulación de Calles */}
                        <div className="absolute top-1/2 left-0 w-full h-2 bg-slate-700/50 transform -translate-y-1/2"></div>
                        <div className="absolute top-0 left-1/3 w-2 h-full bg-slate-700/50 transform rotate-12"></div>
                        <div className="absolute top-0 right-1/4 w-2 h-full bg-slate-700/50"></div>

                        {/* Marcadores de Intersección */}
                        {intersections.map((int) => (
                            <div key={int.id} className="absolute group cursor-pointer"
                                style={{ top: `${20 + int.id * 15}%`, left: `${15 + int.id * 18}%` }}
                                onClick={() => onSelectCamera(int.id)}
                            >
                                <div className={`w-4 h-4 rounded-full ${int.status === 'critical' ? 'bg-red-500 animate-ping' : 'bg-emerald-500'} absolute`}></div>
                                <div className={`relative w-4 h-4 rounded-full border-2 border-white ${int.status === 'critical' ? 'bg-red-500' : int.status === 'moderate' ? 'bg-yellow-500' : 'bg-emerald-500'}`}></div>

                                {/* Tooltip al pasar el mouse */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-48 bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                    <h4 className="font-bold text-white text-xs mb-1">{int.name}</h4>
                                    <div className="flex justify-between text-[10px] text-slate-400">
                                        <span>Vel: {int.speed} km/h</span>
                                        <span>Flujo: {int.flow} vpm</span>
                                    </div>
                                    <div className="mt-2 text-[10px] text-indigo-300 bg-indigo-900/30 p-1 rounded">
                                        Pred: {int.prediction}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Controles Flotantes */}
                    <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                        <button className="p-2 bg-slate-900/90 text-white rounded hover:bg-indigo-600 transition-colors"><TrendingUp size={18} /></button>
                        <button className="p-2 bg-slate-900/90 text-white rounded hover:bg-indigo-600 transition-colors"><Settings size={18} /></button>
                    </div>
                </Card>

                {/* Lista Lateral */}
                <div className="flex flex-col gap-4 h-full">
                    <Card className="flex-1 flex flex-col">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Video size={16} className="text-indigo-400" /> Cámaras en Vivo
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                            {intersections.map((int) => (
                                <div key={int.id}
                                    className="p-3 bg-slate-900/50 rounded-lg border border-slate-800 hover:border-indigo-500/50 transition-colors cursor-pointer group"
                                    onClick={() => onSelectCamera(int.id)}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-mono text-slate-500">{int.cam}</span>
                                        <Badge status={int.status} />
                                    </div>
                                    <h4 className="text-sm font-semibold text-white mb-1">{int.name}</h4>
                                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${int.status === 'critical' ? 'bg-red-500' : 'bg-emerald-500'}`}
                                            style={{ width: `${(int.flow / 60) * 100}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1 text-right">{int.flow} vehículos/min</p>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="h-1/3 bg-slate-800/30">
                        <h3 className="font-bold text-white mb-2 text-sm flex items-center gap-2">
                            <AlertTriangle size={14} className="text-yellow-400" /> Alertas Recientes
                        </h3>
                        <div className="space-y-2">
                            {alerts.map(alert => (
                                <div key={alert.id} className="flex gap-2 items-start p-2 bg-slate-900/50 rounded border-l-2 border-yellow-500">
                                    <div className="flex-1">
                                        <p className="text-xs text-white">{alert.msg}</p>
                                        <p className="text-[10px] text-slate-500">{alert.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
