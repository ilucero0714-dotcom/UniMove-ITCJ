import React from 'react';
import { 
  X, 
  Zap, 
  Bike as BikeIcon, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Navigation, 
  Package, 
  ShieldCheck, 
  AlertCircle,
  Sparkles,
  Lock
} from 'lucide-react';
import { Bike, CampusStation, ActiveRental } from '../types/bike';
import { playSound } from '../utils/sound';

interface StationDetailModalProps {
  station: CampusStation | null;
  bikes: Bike[];
  activeRental: ActiveRental | null;
  reservedBikeId: string | null;
  onClose: () => void;
  onUnlockBike: (bike: Bike) => void;
  onReserveBike: (bike: Bike) => void;
  onCancelReservation: () => void;
  onReturnBikeToStation: (stationId: string) => void;
}

export const StationDetailModal: React.FC<StationDetailModalProps> = ({
  station,
  bikes,
  activeRental,
  reservedBikeId,
  onClose,
  onUnlockBike,
  onReserveBike,
  onCancelReservation,
  onReturnBikeToStation
}) => {
  if (!station) return null;

  const stationBikes = bikes.filter((b) => b.stationId === station.id && b.status !== 'maintenance');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-xl max-h-[92vh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden w-12 h-1 bg-slate-300 rounded-full mx-auto my-2.5" />

        {/* Station Hero / Header */}
        <div className="relative p-5 pb-4 border-b border-slate-100 bg-gradient-to-br from-emerald-50/60 via-white to-slate-50">
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shadow-xs"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                  {station.zone}
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  3 min a pie desde tu ubicación
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {station.name}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                {station.description}
              </p>
            </div>
          </div>

          {/* Graphical Dock Bay Visualizer */}
          <div className="mt-4 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold mb-2">
              <span className="text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {station.availableBikes} Bicis Disponibles
              </span>
              <span className="text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-300" />
                {station.availableDocks} Muelles Libres
              </span>
            </div>

            {/* Micro bay slots indicator */}
            <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5">
              {Array.from({ length: station.totalDocks }).map((_, idx) => {
                const isBike = idx < station.availableBikes;
                const isElectric = idx < station.electricAvailable;
                return (
                  <div
                    key={idx}
                    title={isBike ? (isElectric ? 'E-Bike disponible' : 'Bici estándar') : 'Muelle libre'}
                    className={`h-5 rounded-md flex items-center justify-center transition-colors ${
                      isBike
                        ? isElectric
                          ? 'bg-amber-400 text-amber-950 font-bold text-[9px]'
                          : 'bg-emerald-500 text-white'
                        : 'bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {isBike && (isElectric ? <Zap className="w-3 h-3" /> : <BikeIcon className="w-3 h-3" />)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* If the student currently has an active rental, offer immediate return! */}
          {activeRental && (
            <div className="mt-3 p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-xs font-bold text-amber-900 block truncate">
                  ¿Deseas entregar tu bici ({activeRental.bikeId}) aquí?
                </span>
                <span className="text-[11px] text-amber-700">
                  {station.availableDocks > 0
                    ? `Hay ${station.availableDocks} muelles listos para anclar.`
                    : 'Atención: Estación casi llena, verifica muelle libre.'}
                </span>
              </div>
              <button
                onClick={() => {
                  playSound('lock');
                  onReturnBikeToStation(station.id);
                  onClose();
                }}
                disabled={station.availableDocks <= 0}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0"
              >
                Anclar y Finalizar
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Bike List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Flota Acoplada en esta Estación
            </h3>
            <span className="text-[11px] text-slate-500">
              Primeros 45 min gratis para alumnos
            </span>
          </div>

          {stationBikes.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <BikeIcon className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-semibold text-slate-700">No hay bicicletas en este momento</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Los alumnos han tomado todas las unidades. Puedes esperar una devolución o revisar la estación más cercana.
              </p>
            </div>
          ) : (
            stationBikes.map((bike) => {
              const isReservedByMe = reservedBikeId === bike.id;
              const isEbike = bike.type === 'electric';
              const isCargo = bike.type === 'cargo';

              return (
                <div
                  key={bike.id}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isReservedByMe
                      ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/20'
                      : 'bg-white hover:bg-slate-50/90 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isEbike
                          ? 'bg-amber-100 text-amber-700'
                          : isCargo
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {isEbike ? (
                        <Zap className="w-5 h-5 fill-amber-500" />
                      ) : isCargo ? (
                        <Package className="w-5 h-5" />
                      ) : (
                        <BikeIcon className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">
                          {bike.id}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs font-semibold text-slate-700">
                          {bike.name}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                        {isEbike && (
                          <span className="font-bold text-amber-700 flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-amber-500" />
                            Batería: {bike.batteryLevel}%
                          </span>
                        )}
                        <span>{bike.gearCount} Vel Shimano</span>
                        {bike.hasBasket && (
                          <>
                            <span className="text-slate-300">·</span>
                            <span>Canastilla para Mochila</span>
                          </>
                        )}
                        <span className="text-slate-300">·</span>
                        <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                          <ShieldCheck className="w-3 h-3" />
                          Revisada {bike.lastServiceDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions for this bike */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {isReservedByMe ? (
                      <button
                        onClick={() => {
                          playSound('click');
                          onCancelReservation();
                        }}
                        className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors"
                      >
                        Cancelar Reserva
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          playSound('click');
                          onReserveBike(bike);
                        }}
                        disabled={!!activeRental || !!reservedBikeId}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl transition-colors"
                        title="Apartar por 15 minutos mientras caminas a la estación"
                      >
                        Apartar 15m
                      </button>
                    )}

                    <button
                      onClick={() => {
                        playSound('click');
                        onUnlockBike(bike);
                        onClose();
                      }}
                      disabled={!!activeRental}
                      className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Desbloquear</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info strip */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Usa siempre ciclovías autorizadas y respeta el límite de 20 km/h en el campus.
        </div>
      </div>
    </div>
  );
};
