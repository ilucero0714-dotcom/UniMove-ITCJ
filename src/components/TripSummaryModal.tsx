import React, { useEffect } from 'react';
import { 
  CheckCircle, 
  Sparkles, 
  Leaf, 
  Clock, 
  MapPin, 
  Award, 
  ThumbsUp, 
  AlertTriangle,
  X
} from 'lucide-react';
import { CompletedTrip } from '../types/bike';
import { playSound } from '../utils/sound';

interface TripSummaryModalProps {
  trip: CompletedTrip | null;
  onClose: () => void;
  onReportIssue: (bikeId: string) => void;
}

export const TripSummaryModal: React.FC<TripSummaryModalProps> = ({
  trip,
  onClose,
  onReportIssue
}) => {
  useEffect(() => {
    if (trip) {
      playSound('success');
    }
  }, [trip]);

  if (!trip) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Celebration Header */}
        <div className="p-6 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white text-center relative">
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center mb-3 shadow-lg">
            <CheckCircle className="w-8 h-8 text-white stroke-[2.5]" />
          </div>
          
          <h2 className="text-xl font-extrabold tracking-tight">
            ¡Viaje Finalizado con Éxito!
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            Bicicleta {trip.bikeId} anclada correctamente en el muelle
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-amber-950 rounded-full text-xs font-black shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+{trip.pointsEarned} BiciPoints Acreditados</span>
          </div>
        </div>

        {/* Route Summary */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center mt-1">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div className="w-0.5 h-6 bg-slate-300 my-0.5" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
            </div>
            <div className="flex-1 space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Origen</span>
                <span className="font-bold text-slate-800">{trip.startStationName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Destino (Anclaje)</span>
                <span className="font-bold text-slate-800">{trip.endStationName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-5 grid grid-cols-3 gap-2 text-center border-b border-slate-100">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Duración</span>
            <span className="text-base font-extrabold text-slate-900 tabular-nums">
              {trip.durationMinutes} min
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Distancia</span>
            <span className="text-base font-extrabold text-slate-900 tabular-nums">
              {trip.distanceKm.toFixed(1)} km
            </span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
            <span className="text-[10px] text-emerald-800 font-semibold uppercase block">CO₂ Ahorrado</span>
            <span className="text-base font-extrabold text-emerald-700 tabular-nums">
              {trip.co2SavedGrams} g
            </span>
          </div>
        </div>

        {/* Cost & Subsidized Receipt */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600">Tarifa de uso:</span>
            <span className="text-slate-400 line-through">$1.00</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-emerald-700 font-semibold">Subsidio Estudiantil Universitario:</span>
            <span className="text-emerald-700 font-semibold">- $1.00</span>
          </div>
          <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100 font-extrabold text-slate-900">
            <span>Total a pagar:</span>
            <span className="text-emerald-600 text-base">$0.00 MXN</span>
          </div>

          {/* Quick Issue Reporting Prompt */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <span>¿Notaste alguna falla mecánica?</span>
            <button
              onClick={() => {
                playSound('click');
                onReportIssue(trip.bikeId);
                onClose();
              }}
              className="text-amber-600 font-semibold hover:underline flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Reportar</span>
            </button>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm"
          >
            Listo, Volver al Campus
          </button>
        </div>
      </div>
    </div>
  );
};
