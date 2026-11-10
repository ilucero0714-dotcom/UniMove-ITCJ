import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  PhoneCall, 
  CheckCircle, 
  Footprints, 
  Gauge, 
  ParkingCircle, 
  Clock, 
  HelpCircle 
} from 'lucide-react';
import { CAMPUS_RULES } from '../data/mockData';
import { playSound } from '../utils/sound';

interface CampusGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CampusGuideModal: React.FC<CampusGuideModalProps> = ({
  isOpen,
  onClose
}) => {
  const [callingSecurity, setCallingSecurity] = useState(false);

  if (!isOpen) return null;

  const handleCallEmergency = () => {
    playSound('beep');
    setCallingSecurity(true);
    setTimeout(() => {
      setCallingSecurity(false);
    }, 4000);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints': return <Footprints className="w-5 h-5" />;
      case 'Gauge': return <Gauge className="w-5 h-5" />;
      case 'ParkingCircle': return <ParkingCircle className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-700 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-extrabold leading-tight">
                Reglamento y Seguridad del Campus
              </h2>
              <span className="text-[11px] text-emerald-100 font-medium">
                Normativa de Convivencia y Movilidad Sostenible
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Rules list */}
          <div className="space-y-3">
            {CAMPUS_RULES.map((rule, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 hover:bg-emerald-50/50 rounded-2xl border border-slate-200 flex items-start gap-3 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  {getIcon(rule.icon)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {rule.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Box */}
          <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-extrabold text-rose-900 flex items-center gap-1.5 text-sm">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Caseta de Seguridad Universitaria
                </span>
                <p className="text-slate-600 mt-1">
                  En caso de accidente, caída o asistencia en el campus, contacta a la patrulla de vigilancia inmediata (Extensión 4444).
                </p>
              </div>
            </div>

            <div className="mt-3">
              {callingSecurity ? (
                <div className="p-2.5 bg-rose-600 text-white font-bold text-center rounded-xl animate-pulse flex items-center justify-center gap-2">
                  <PhoneCall className="w-4 h-4" />
                  <span>Conectando con Caseta Central... (Marcando Ext. 4444)</span>
                </div>
              ) : (
                <button
                  onClick={handleCallEmergency}
                  className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Llamar a Emergencias del Campus</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
          Oficina de Bienestar Estudiantil · CicloCampus 2026
        </div>
      </div>
    </div>
  );
};
