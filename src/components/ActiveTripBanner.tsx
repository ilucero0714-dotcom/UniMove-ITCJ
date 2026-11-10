import React from 'react';
import { Navigation, Pause, Play, Bike as BikeIcon, Zap, CheckCircle2 } from 'lucide-react';
import { ActiveRental } from '../types/bike';
import { playSound } from '../utils/sound';

interface ActiveTripBannerProps {
  rental: ActiveRental;
  elapsedSeconds: number;
  onOpenDetails: () => void;
  onTogglePause: () => void;
  onFinishTrip: () => void;
}

export const ActiveTripBanner: React.FC<ActiveTripBannerProps> = ({
  rental,
  elapsedSeconds,
  onOpenDetails,
  onTogglePause,
  onFinishTrip
}) => {
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 animate-slideUp">
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl border border-slate-700 shadow-2xl flex items-center justify-between gap-3">
        {/* Left: Indicator & Time */}
        <div 
          onClick={() => {
            playSound('click');
            onOpenDetails();
          }}
          className="flex items-center gap-3 cursor-pointer min-w-0"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              {rental.bikeType === 'electric' ? (
                <Zap className="w-5 h-5 fill-amber-300" />
              ) : (
                <BikeIcon className="w-5 h-5" />
              )}
            </div>
            {rental.isPaused && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-900" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 font-mono tabular-nums text-sm">
                {formatTime(elapsedSeconds)}
              </span>
              <span className="text-[10px] text-slate-400 truncate">
                {rental.bikeId}
              </span>
            </div>
            <span className="text-[11px] text-slate-300 block truncate font-medium">
              {rental.isPaused ? 'Pausa temporal activa' : `Rumbo a clases · ${rental.currentKm.toFixed(1)} km`}
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              onTogglePause();
            }}
            className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
              rental.isPaused
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title={rental.isPaused ? 'Reanudar viaje' : 'Pausar temporalmente'}
          >
            {rental.isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              playSound('click');
              onOpenDetails();
            }}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-sm"
          >
            Ver Viaje
          </button>
        </div>
      </div>
    </div>
  );
};
