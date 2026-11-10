import React, { useState } from 'react';
import { 
  Zap, 
  MapPin, 
  Navigation, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Search, 
  Compass, 
  CheckCircle2, 
  Clock,
  Sparkles
} from 'lucide-react';
import { CampusStation } from '../types/bike';
import { playSound } from '../utils/sound';

interface CampusMapProps {
  stations: CampusStation[];
  selectedStationId: string | null;
  onSelectStation: (station: CampusStation) => void;
  onOpenUnlock: (stationId?: string) => void;
}

export const CampusMap: React.FC<CampusMapProps> = ({
  stations,
  selectedStationId,
  onSelectStation,
  onOpenUnlock
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [filter, setFilter] = useState<'all' | 'electric' | 'docks'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationPulse] = useState(true);

  // Filter stations based on selection and search
  const filteredStations = stations.filter((station) => {
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          station.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          station.popularFor.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === 'electric') return station.electricAvailable > 0;
    if (filter === 'docks') return station.availableDocks > 0;
    return true;
  });

  const handleZoom = (delta: number) => {
    playSound('click');
    setZoomLevel((prev) => Math.min(Math.max(prev + delta, 0.85), 1.6));
  };

  const handleResetZoom = () => {
    playSound('click');
    setZoomLevel(1);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar facultad, biblioteca o zona..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 placeholder-slate-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Filter segment buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto">
          <button
            onClick={() => {
              playSound('click');
              setFilter('all');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas ({stations.length})
          </button>
          <button
            onClick={() => {
              playSound('click');
              setFilter('electric');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              filter === 'electric'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Eléctricas</span>
          </button>
          <button
            onClick={() => {
              playSound('click');
              setFilter('docks');
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              filter === 'docks'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Con Docks Libres</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Campus Map Canvas Container */}
      <div className="relative w-full h-[520px] sm:h-[620px] rounded-3xl overflow-hidden border border-slate-200 bg-slate-950 shadow-md select-none group">
        
        {/* Map Controls Overlay (Top Right) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => handleZoom(0.15)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            title="Acercar mapa"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.15)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            title="Alejar mapa"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors"
            title="Restablecer vista"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Legend / Status Overlay (Top Left) */}
        <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-800 text-xs text-white shadow-lg pointer-events-none">
          <div className="flex items-center gap-2 mb-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold tracking-tight">Campus Universitario Central</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Bicis Disponibles
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              E-Bikes
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
              Ciclovías
            </span>
          </div>
        </div>

        {/* Student Location Pill (Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200 text-xs text-slate-800 shadow-md flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-500/20 animate-pulse" />
          <div>
            <span className="font-bold text-slate-900 block leading-tight">Tu Ubicación</span>
            <span className="text-[10px] text-slate-500">Plaza Central (Cerca de Biblioteca)</span>
          </div>
        </div>

        {/* Quick Unlock FAB (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-20">
          <button
            onClick={() => onOpenUnlock()}
            className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Escanear QR de Bici</span>
          </button>
        </div>

        {/* The Scalable Map Content */}
        <div
          className="w-full h-full transition-transform duration-200 ease-out origin-center flex items-center justify-center overflow-hidden"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <div className="relative w-full max-w-[900px] h-full aspect-[4/3] p-4 flex items-center justify-center">
            
            {/* SVG Illustration of Campus Grounds */}
            <svg
              viewBox="0 0 1000 750"
              className="w-full h-full drop-shadow-2xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Grass pattern */}
                <pattern id="campus-grass" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect width="20" height="20" fill="#0f1f18" />
                  <circle cx="2" cy="2" r="1" fill="#132a21" opacity="0.6" />
                  <circle cx="12" cy="14" r="1.5" fill="#132a21" opacity="0.5" />
                </pattern>
                
                {/* Building gradient */}
                <linearGradient id="building-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>

                <linearGradient id="athletic-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#991b1b" />
                  <stop offset="100%" stopColor="#7f1d1d" />
                </linearGradient>

                <linearGradient id="pool-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>

                {/* Bike lane glow */}
                <filter id="lane-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Campus Base Terrain / Lawns */}
              <rect x="0" y="0" width="1000" height="750" fill="url(#campus-grass)" rx="32" />

              {/* Forest / Green Grove Clusters */}
              <circle cx="120" cy="140" r="75" fill="#14532d" opacity="0.45" />
              <circle cx="180" cy="180" r="50" fill="#15803d" opacity="0.35" />
              <circle cx="860" cy="180" r="85" fill="#14532d" opacity="0.45" />
              <circle cx="890" cy="300" r="60" fill="#15803d" opacity="0.3" />
              <circle cx="360" cy="670" r="70" fill="#14532d" opacity="0.4" />

              {/* Campus Main Pedestrian Plaza (Central Quad) */}
              <ellipse cx="480" cy="360" rx="140" ry="90" fill="#1e293b" opacity="0.75" />
              <ellipse cx="480" cy="360" rx="90" ry="50" fill="#334155" opacity="0.5" />
              {/* Fountain Center */}
              <circle cx="480" cy="360" r="18" fill="#0284c7" opacity="0.9" />
              <circle cx="480" cy="360" r="28" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />

              {/* Campus Roadways (Asphalt) */}
              <path
                d="M 480 0 L 480 750"
                stroke="#1e293b"
                strokeWidth="24"
                fill="none"
              />
              <path
                d="M 50 360 L 950 360"
                stroke="#1e293b"
                strokeWidth="24"
                fill="none"
              />
              <path
                d="M 120 700 Q 480 620 850 700"
                stroke="#1e293b"
                strokeWidth="20"
                fill="none"
              />

              {/* Protected Bike Lanes (Dedicated Cyan/Emerald Corridors) */}
              <path
                d="M 470 20 L 470 730"
                stroke="#06b6d4"
                strokeWidth="4"
                strokeDasharray="8 4"
                fill="none"
                filter="url(#lane-glow)"
                opacity="0.85"
              />
              <path
                d="M 60 370 L 940 370"
                stroke="#06b6d4"
                strokeWidth="4"
                strokeDasharray="8 4"
                fill="none"
                opacity="0.85"
              />
              {/* Diagonal Express Bike Paths */}
              <path
                d="M 480 120 Q 300 320 220 580"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeDasharray="6 3"
                fill="none"
                opacity="0.7"
              />
              <path
                d="M 480 120 Q 680 260 760 410"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeDasharray="6 3"
                fill="none"
                opacity="0.7"
              />
              <path
                d="M 760 410 Q 820 560 810 700"
                stroke="#10b981"
                strokeWidth="3.5"
                strokeDasharray="6 3"
                fill="none"
                opacity="0.7"
              />

              {/* Athletic Track & Pool Complex (South-West) */}
              <rect x="90" y="520" width="160" height="95" rx="45" fill="none" stroke="url(#athletic-grad)" strokeWidth="18" opacity="0.8" />
              <rect x="110" y="540" width="120" height="55" rx="27" fill="#14532d" opacity="0.6" />
              <rect x="130" y="635" width="80" height="40" rx="6" fill="url(#pool-grad)" opacity="0.85" />
              <text x="170" y="660" fill="#e0f2fe" fontSize="10" fontWeight="bold" textAnchor="middle">ALBERCA</text>

              {/* Campus Buildings (Clean 2D architectural footprints) */}
              {/* 1. Biblioteca Central & Rectoría */}
              <rect x="410" y="220" width="140" height="65" rx="6" fill="url(#building-grad)" stroke="#475569" strokeWidth="1.5" />
              <text x="480" y="258" fill="#f8fafc" fontSize="11" fontWeight="700" textAnchor="middle">BIBLIOTECA CENTRAL</text>
              <text x="480" y="272" fill="#94a3b8" fontSize="8" textAnchor="middle">Y RECTORÍA</text>

              {/* 2. Facultad de Ingeniería (East) */}
              <polygon points="680,260 840,260 840,340 760,340 760,380 680,380" fill="url(#building-grad)" stroke="#475569" strokeWidth="1.5" />
              <text x="750" y="300" fill="#f8fafc" fontSize="11" fontWeight="700" textAnchor="middle">FACULTAD DE</text>
              <text x="750" y="315" fill="#f8fafc" fontSize="11" fontWeight="700" textAnchor="middle">INGENIERÍA</text>
              <text x="750" y="328" fill="#94a3b8" fontSize="8" textAnchor="middle">AULAS 400</text>

              {/* 3. Comedor & Centro Estudiantil (West) */}
              <rect x="230" y="360" width="120" height="80" rx="8" fill="url(#building-grad)" stroke="#475569" strokeWidth="1.5" />
              <text x="290" y="400" fill="#f8fafc" fontSize="11" fontWeight="700" textAnchor="middle">COMEDOR CENTRAL</text>
              <text x="290" y="416" fill="#94a3b8" fontSize="8" textAnchor="middle">CENTRO ESTUDIANTIL</text>

              {/* 4. Complejo Deportivo Aulas */}
              <rect x="70" y="450" width="100" height="50" rx="4" fill="url(#building-grad)" stroke="#475569" strokeWidth="1.5" />
              <text x="120" y="480" fill="#f8fafc" fontSize="9" fontWeight="700" textAnchor="middle">GIMNASIO & GYM</text>

              {/* 5. Acceso Norte / Metrobus Station */}
              <rect x="390" y="20" width="180" height="40" rx="6" fill="#1e293b" stroke="#059669" strokeWidth="2" />
              <text x="480" y="45" fill="#34d399" fontSize="10" fontWeight="700" textAnchor="middle">ACCESO NORTE - METROBUS</text>

              {/* 6. Laboratorios de Ciencias */}
              <rect x="740" y="500" width="130" height="70" rx="6" fill="url(#building-grad)" stroke="#475569" strokeWidth="1.5" />
              <text x="805" y="535" fill="#f8fafc" fontSize="10" fontWeight="700" textAnchor="middle">CIENCIAS EXACTAS</text>
              <text x="805" y="550" fill="#94a3b8" fontSize="8" textAnchor="middle">BIO-LABORATORIOS</text>

              {/* 7. Residencias Universitarias */}
              <rect x="420" y="640" width="120" height="55" rx="6" fill="url(#building-grad)" stroke="#475569" strokeWidth="1.5" />
              <text x="480" y="670" fill="#f8fafc" fontSize="10" fontWeight="700" textAnchor="middle">DORMITORIOS SUR</text>
              <text x="480" y="683" fill="#94a3b8" fontSize="8" textAnchor="middle">RESIDENCIAS</text>

              {/* Student Location Indicator on SVG */}
              {showLocationPulse && (
                <g transform="translate(460, 330)">
                  <circle cx="0" cy="0" r="18" fill="#3b82f6" opacity="0.25">
                    <animate attributeName="r" values="10;28;10" dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="0" cy="0" r="7" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
                </g>
              )}
            </svg>

            {/* Station Interactive Pin Elements (Absolute Overlays) */}
            {filteredStations.map((station) => {
              const isSelected = selectedStationId === station.id;
              const hasBikes = station.availableBikes > 0;

              return (
                <div
                  key={station.id}
                  style={{
                    left: `${station.x}%`,
                    top: `${station.y}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer group/pin"
                  onClick={() => {
                    playSound('click');
                    onSelectStation(station);
                  }}
                >
                  {/* Outer selection ring */}
                  {isSelected && (
                    <div className="absolute inset-0 -m-3 rounded-full border-2 border-emerald-400 animate-ping opacity-75 pointer-events-none" />
                  )}

                  {/* Pin button */}
                  <div
                    className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full shadow-lg transition-transform transform hover:scale-110 active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-400/40'
                        : hasBikes
                        ? 'bg-slate-900/95 text-white hover:bg-slate-800 border border-slate-700'
                        : 'bg-rose-900/90 text-rose-200 border border-rose-700'
                    }`}
                  >
                    {/* Bike icon / Station marker */}
                    <div className="flex items-center justify-center">
                      <MapPin className={`w-3.5 h-3.5 ${hasBikes ? 'text-emerald-400' : 'text-rose-400'}`} />
                    </div>

                    {/* Available count */}
                    <span className="font-extrabold text-xs tabular-nums">
                      {station.availableBikes}
                    </span>

                    {/* Electric badge if electric bikes are docked */}
                    {station.electricAvailable > 0 && (
                      <span className="flex items-center text-amber-400" title={`${station.electricAvailable} eléctricas disponibles`}>
                        <Zap className="w-3 h-3 fill-amber-400" />
                      </span>
                    )}
                  </div>

                  {/* Station Label Tooltip */}
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover/pin:flex flex-col items-center pointer-events-none z-30">
                    <div className="bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded-md whitespace-nowrap shadow-md border border-slate-700">
                      <span>{station.name}</span>
                      <span className="text-slate-400 text-[10px] block font-normal">
                        {station.availableBikes} bicis · {station.availableDocks} muelles libres
                      </span>
                    </div>
                    <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-0.5 border-r border-b border-slate-700" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Station Cards Carousel for Rapid Mobile Access */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-slate-800 tracking-tight">
            Cicloestaciones en el Campus ({filteredStations.length})
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Toca una estación para reservar o ver muelles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredStations.map((station) => {
            const isSelected = selectedStationId === station.id;
            return (
              <div
                key={station.id}
                onClick={() => {
                  playSound('click');
                  onSelectStation(station);
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left relative ${
                  isSelected
                    ? 'bg-emerald-50/70 border-emerald-500 shadow-sm'
                    : 'bg-white hover:bg-slate-50/80 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-emerald-700 block uppercase tracking-wider">
                      {station.zone}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm truncate">
                      {station.name}
                    </h4>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-black text-slate-900 tabular-nums">
                      {station.availableBikes}
                    </span>
                    <span className="text-[10px] text-slate-500 block leading-none">
                      /{station.totalDocks} bicis
                    </span>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <strong className="text-slate-700 font-semibold">{station.electricAvailable}</strong>
                      <span className="text-[11px]">e-bikes</span>
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      <strong className="text-slate-700 font-semibold">{station.availableDocks}</strong>
                      <span className="text-[11px]">docks</span>
                    </span>
                  </div>

                  <span className="text-emerald-700 font-semibold text-[11px] group-hover:underline">
                    Ver detalles →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
