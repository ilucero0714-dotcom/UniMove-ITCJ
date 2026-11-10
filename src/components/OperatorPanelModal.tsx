import React, { useState } from 'react';
import { 
  X, 
  BarChart3, 
  Truck, 
  Wrench, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Bike as BikeIcon, 
  Zap, 
  SlidersHorizontal 
} from 'lucide-react';
import { Bike, CampusStation, IncidentReport } from '../types/bike';
import { playSound } from '../utils/sound';

interface OperatorPanelModalProps {
  isOpen: boolean;
  stations: CampusStation[];
  bikes: Bike[];
  incidents: IncidentReport[];
  activeTripsCount: number;
  onClose: () => void;
  onRebalanceFleet: () => void;
  onResolveIncident: (incidentId: string) => void;
  onAddNewBike: (bike: Bike) => void;
}

export const OperatorPanelModal: React.FC<OperatorPanelModalProps> = ({
  isOpen,
  stations,
  bikes,
  incidents,
  activeTripsCount,
  onClose,
  onRebalanceFleet,
  onResolveIncident,
  onAddNewBike
}) => {
  const [rebalanceRunning, setRebalanceRunning] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBikeId, setNewBikeId] = useState(`BC-${Math.floor(140 + Math.random() * 50)}`);
  const [newBikeType, setNewBikeType] = useState<'standard' | 'electric'>('standard');
  const [newBikeStation, setNewBikeStation] = useState(stations[0]?.id || 'st-biblio');

  if (!isOpen) return null;

  const totalBikes = bikes.length;
  const maintenanceCount = bikes.filter((b) => b.status === 'maintenance').length;
  const availableCount = bikes.filter((b) => b.status === 'available').length;
  const rentedCount = bikes.filter((b) => b.status === 'rented').length + activeTripsCount;

  const handleRunRebalance = () => {
    playSound('beep');
    setRebalanceRunning(true);
    setTimeout(() => {
      onRebalanceFleet();
      setRebalanceRunning(false);
      playSound('success');
    }, 1500);
  };

  const handleCreateBike = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Bike = {
      id: newBikeId.toUpperCase(),
      name: newBikeType === 'electric' ? 'EcoRider E-Glide 250W' : 'Campus Cruiser Shimano 3S',
      type: newBikeType,
      stationId: newBikeStation,
      batteryLevel: newBikeType === 'electric' ? 100 : undefined,
      gearCount: newBikeType === 'electric' ? 7 : 3,
      hasBasket: true,
      status: 'available',
      lastServiceDate: 'Hoy',
      totalKm: 0
    };
    playSound('success');
    onAddNewBike(created);
    setShowAddForm(false);
    setNewBikeId(`BC-${Math.floor(150 + Math.random() * 50)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold leading-tight">
                Consola de Operaciones de Campus
              </h2>
              <span className="text-[11px] text-slate-400 font-medium">
                Gestión de Flota, Rebalanceo y Mantenimiento
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

        {/* Operational Telemetry Cards */}
        <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 border-b border-slate-100">
          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Flota Total</span>
            <span className="text-xl font-extrabold text-slate-900 tabular-nums">{totalBikes}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">unidades activas</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] text-emerald-700 font-bold uppercase block">Disponibles</span>
            <span className="text-xl font-extrabold text-emerald-600 tabular-nums">{availableCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">en muelles</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] text-amber-700 font-bold uppercase block">En Tránsito</span>
            <span className="text-xl font-extrabold text-amber-600 tabular-nums">{rentedCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">rodando en campus</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200">
            <span className="text-[10px] text-rose-700 font-bold uppercase block">En Taller</span>
            <span className="text-xl font-extrabold text-rose-600 tabular-nums">{maintenanceCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">por revisar</span>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          {/* Rebalance Module */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-extrabold text-indigo-950 text-sm flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-indigo-600" />
                Rebalanceo Inteligente de Estaciones
              </span>
              <p className="text-xs text-indigo-900/80 mt-1">
                La camioneta de apoyo redistribuye bicicletas entre estaciones saturadas (ej. Comedor) y estaciones con demanda alta (ej. Acceso Norte).
              </p>
            </div>
            <button
              onClick={handleRunRebalance}
              disabled={rebalanceRunning}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${rebalanceRunning ? 'animate-spin' : ''}`} />
              <span>{rebalanceRunning ? 'Redistribuyendo...' : 'Ejecutar Rebalanceo'}</span>
            </button>
          </div>

          {/* Maintenance Queue */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Bicicletas e Incidencias en Taller ({incidents.length})
              </h4>
              <span className="text-[11px] text-slate-500">Mecánicos del campus activos</span>
            </div>

            {incidents.length === 0 ? (
              <div className="p-4 text-center bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500">
                Toda la flota está en estado óptimo. No hay averías reportadas.
              </div>
            ) : (
              <div className="space-y-2">
                {incidents.map((inc) => (
                  <div
                    key={inc.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{inc.bikeId}</span>
                        <span className="text-slate-300">·</span>
                        <span className="font-semibold text-rose-700 uppercase text-[10px]">
                          Falla: {inc.issueType}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-[11px] text-slate-400">{inc.stationName}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{inc.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        playSound('success');
                        onResolveIncident(inc.id);
                      }}
                      className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold rounded-lg text-xs whitespace-nowrap shrink-0"
                    >
                      Marcar Reparada
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add New Bike to Fleet Form */}
          <div>
            {!showAddForm ? (
              <button
                onClick={() => {
                  playSound('click');
                  setShowAddForm(true);
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Incorporar Nueva Bicicleta a la Flota Universitaria</span>
              </button>
            ) : (
              <form onSubmit={handleCreateBike} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase">
                    Alta de Unidad en el Sistema
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancelar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Código ID</label>
                    <input
                      type="text"
                      value={newBikeId}
                      onChange={(e) => setNewBikeId(e.target.value.toUpperCase())}
                      className="w-full p-2 text-xs font-bold bg-white border border-slate-200 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Tipo</label>
                    <select
                      value={newBikeType}
                      onChange={(e) => setNewBikeType(e.target.value as 'standard' | 'electric')}
                      className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg"
                    >
                      <option value="standard">Mecánica Tradicional (3V)</option>
                      <option value="electric">Eléctrica E-Glide 250W</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-1">Muelle Inicial</label>
                    <select
                      value={newBikeStation}
                      onChange={(e) => setNewBikeStation(e.target.value)}
                      className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg truncate"
                    >
                      {stations.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  Registrar e Integrar a Estación
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
          Supervisión de Movilidad Urbana · Sistema CicloCampus
        </div>
      </div>
    </div>
  );
};
