import React, { useState } from 'react';
import { 
  X, 
  Pause, 
  Play, 
  MapPin, 
  Zap, 
  Bike as BikeIcon, 
  Gauge, 
  Flame, 
  Leaf, 
  Clock, 
  CheckCircle2, 
  ShieldAlert,
  Lock
} from 'lucide-react';
import { ActiveRental, CampusStation } from '../types/bike';
import { playSound } from '../utils/sound';

interface ActiveTripModalProps {
  isOpen: boolean;
  rental: ActiveRental | null;
  stations: CampusStation[];
  elapsedSeconds: number;
  onClose: () => void;
  onTogglePause: () => void;
  onFinishRentalAtStation: (stationId: string) => void;
}

export const ActiveTripModal: React.FC<ActiveTripModalProps> = ({
  isOpen,
  rental,
  stations,
  elapsedSeconds,
  onClose,
  onTogglePause,
  onFinishRentalAtStation
}) => {
  const [selectedReturnStationId, setSelectedReturnStationId] = useState<string>('st-biblio');
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);

  if (!isOpen || !rental) return null;

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulated speed between 14 and 19 km/h when not paused
  const currentSpeed = rental.isPaused ? 0 : 16.5;

  const handleFinish = () => {
    playSound('lock');
    onFinishRentalAtStation(selectedReturnStationId);
    setShowConfirmFinish(false);
    onClose();
  };

  const selectedStation = stations.find((s) => s.id === selectedReturnStationId) || stations[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              {rental.bikeType === 'electric' ? <Zap className="w-4 h-4 fill-amber-400" /> : <BikeIcon className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white">
                  {rental.bikeId}
                </span>
                <span className="text-slate-400 text-xs">·</span>
                <span className="text-xs text-slate-300">
                  {rental.bikeName}
                </span>
              </div>
              <span className="text-[11px] text-emerald-400 block font-medium">
                Origen: {rental.startStationName}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Live Digital Stopwatch & Pause state */}
        <div className="p-6 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white text-center border-b border-slate-700">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold block mb-1">
            {rental.isPaused ? 'VIAJE PAUSADO TEMPORALMENTE' : 'TIEMPO TRANSCURRIDO'}
          </span>
          <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white tabular-nums drop-shadow-md">
            {formatTimer(elapsedSeconds)}
          </div>
          
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 rounded-full">
              45 min gratis incluidos con tu carnet
            </span>
          </div>

          {/* Pause / Resume Button */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => {
                onTogglePause();
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                rental.isPaused
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-lg shadow-amber-400/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600'
              }`}
            >
              {rental.isPaused ? (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Reanudar Recorrido</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pausa Temporal (Bloquear candado)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Metrics Quad */}
        <div className="grid grid-cols-4 divide-x divide-slate-100 border-b border-slate-100 bg-slate-50/70 p-3">
          <div className="text-center px-1">
            <div className="flex items-center justify-center text-slate-400 mb-0.5">
              <Gauge className="w-3.5 h-3.5" />
            </div>
            <span className="text-base sm:text-lg font-black text-slate-900 tabular-nums block">
              {currentSpeed.toFixed(1)}
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">km/h</span>
          </div>

          <div className="text-center px-1">
            <div className="flex items-center justify-center text-slate-400 mb-0.5">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <span className="text-base sm:text-lg font-black text-slate-900 tabular-nums block">
              {rental.currentKm.toFixed(1)}
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">km</span>
          </div>

          <div className="text-center px-1">
            <div className="flex items-center justify-center text-amber-500 mb-0.5">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <span className="text-base sm:text-lg font-black text-slate-900 tabular-nums block">
              {rental.caloriesBurned}
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">kcal</span>
          </div>

          <div className="text-center px-1">
            <div className="flex items-center justify-center text-emerald-500 mb-0.5">
              <Leaf className="w-3.5 h-3.5" />
            </div>
            <span className="text-base sm:text-lg font-black text-emerald-700 tabular-nums block">
              {rental.co2SavedGrams}
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-semibold">g CO₂</span>
          </div>
        </div>

        {/* Return & Dock Selection */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1.5">
              Selecciona la Estación de Entrega para Anclar
            </label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {stations.map((st) => (
                <div
                  key={st.id}
                  onClick={() => {
                    playSound('click');
                    setSelectedReturnStationId(st.id);
                  }}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                    selectedReturnStationId === st.id
                      ? 'bg-emerald-50 border-emerald-500 text-slate-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{st.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0 tabular-nums">
                    {st.availableDocks} muelles libres
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Docking Confirmation Box */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-slate-700 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-900 block">
                Instrucciones de Anclaje:
              </span>
              <span>
                Introduce la rueda delantera en cualquier muelle vacío de <strong>{selectedStation.name}</strong> hasta escuchar el chasquido y ver la luz verde.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Finish CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={handleFinish}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Anclar y Finalizar Viaje Ahora</span>
          </button>
        </div>
      </div>
    </div>
  );
};
