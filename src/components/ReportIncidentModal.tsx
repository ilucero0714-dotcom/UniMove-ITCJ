import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Camera, 
  Bike as BikeIcon, 
  MapPin, 
  Send 
} from 'lucide-react';
import { Bike, CampusStation, IncidentReport } from '../types/bike';
import { playSound } from '../utils/sound';

interface ReportIncidentModalProps {
  isOpen: boolean;
  bikes: Bike[];
  stations: CampusStation[];
  initialBikeId?: string | null;
  onClose: () => void;
  onSubmitReport: (report: Omit<IncidentReport, 'id' | 'reportedAt' | 'status'>) => void;
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen,
  bikes,
  stations,
  initialBikeId,
  onClose,
  onSubmitReport
}) => {
  const [bikeId, setBikeId] = useState(initialBikeId || bikes[0]?.id || '');
  const [stationName, setStationName] = useState(stations[0]?.name || '');
  const [issueType, setIssueType] = useState<IncidentReport['issueType']>('frenos');
  const [description, setDescription] = useState('');
  const [photoAttached, setPhotoAttached] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    playSound('success');
    onSubmitReport({
      bikeId,
      stationName,
      issueType,
      description
    });

    const ticketId = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedTicket(ticketId);
  };

  const handleResetAndClose = () => {
    playSound('click');
    setSubmittedTicket(null);
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                Reportar Falla o Avería
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                Taller y Soporte de Movilidad Estudiantil
              </span>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 flex-1 overflow-y-auto">
          {submittedTicket ? (
            <div className="py-6 text-center space-y-3 animate-scaleUp">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Reporte #{submittedTicket} Registrado
              </h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                Gracias por cuidar la flota del campus. La bicicleta <strong>{bikeId}</strong> ha sido marcada para revisión técnica y retirada temporalmente de circulación.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Entendido
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Bike & Station selectors */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Bicicleta
                  </label>
                  <select
                    value={bikeId}
                    onChange={(e) => setBikeId(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  >
                    {bikes.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.id} ({b.name.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Ubicación / Estación
                  </label>
                  <select
                    value={stationName}
                    onChange={(e) => setStationName(e.target.value)}
                    className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 truncate"
                  >
                    {stations.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Issue Category Chips */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1.5">
                  Tipo de Desperfecto
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'frenos', label: 'Frenos' },
                    { id: 'neumatico', label: 'Neumático' },
                    { id: 'cadena', label: 'Cadena' },
                    { id: 'asiento', label: 'Asiento' },
                    { id: 'luces', label: 'Luces' },
                    { id: 'muelle', label: 'Dock Trabado' }
                  ].map((cat) => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => {
                        playSound('click');
                        setIssueType(cat.id as IncidentReport['issueType']);
                      }}
                      className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                        issueType === cat.id
                          ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Describe brevemente el problema
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ej: El pedal izquierdo se siente flojo al pedalear o el candado no abrió bien..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-800 placeholder-slate-400 resize-none"
                  required
                />
              </div>

              {/* Photo Upload Simulation */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-slate-500" />
                  <span className="text-xs text-slate-600 font-medium">
                    {photoAttached ? 'Foto adjunta: falla_bici.jpg' : 'Adjuntar fotografía (opcional)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playSound('click');
                    setPhotoAttached(!photoAttached);
                  }}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  {photoAttached ? 'Quitar' : 'Tomar Foto'}
                </button>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={!description.trim()}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-200 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-amber-600/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Reporte a Mantenimiento</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
