import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  Zap, 
  Bike as BikeIcon, 
  Flashlight, 
  CheckCircle, 
  AlertCircle, 
  Keyboard, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Bike, CampusStation } from '../types/bike';
import { playSound } from '../utils/sound';

interface QRUnlockModalProps {
  isOpen: boolean;
  bikes: Bike[];
  stations: CampusStation[];
  preselectedStationId?: string | null;
  onClose: () => void;
  onConfirmUnlock: (bike: Bike) => void;
}

export const QRUnlockModal: React.FC<QRUnlockModalProps> = ({
  isOpen,
  bikes,
  stations,
  preselectedStationId,
  onClose,
  onConfirmUnlock
}) => {
  const [mode, setMode] = useState<'scan' | 'manual'>('scan');
  const [manualCode, setManualCode] = useState('');
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [detectedBike, setDetectedBike] = useState<Bike | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [acceptedPledge, setAcceptedPledge] = useState(true);

  // Available bikes that can be rented
  const availableBikes = bikes.filter((b) => b.status === 'available');

  useEffect(() => {
    if (isOpen) {
      setDetectedBike(null);
      setErrorMsg(null);
      setManualCode('');
      setIsScanning(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSimulateScan = (bike: Bike) => {
    playSound('beep');
    setDetectedBike(bike);
    setIsScanning(false);
    setErrorMsg(null);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = manualCode.trim().toUpperCase();
    const found = bikes.find((b) => b.id.toUpperCase() === clean);
    
    if (!found) {
      playSound('alert');
      setErrorMsg(`No se encontró ninguna bicicleta con el código "${clean}". Revisa el manubrio o cuadro.`);
      return;
    }
    if (found.status === 'rented') {
      playSound('alert');
      setErrorMsg(`La bicicleta ${clean} se encuentra actualmente en un viaje activo.`);
      return;
    }
    if (found.status === 'maintenance') {
      playSound('alert');
      setErrorMsg(`La bicicleta ${clean} está en mantenimiento preventivo.`);
      return;
    }

    playSound('beep');
    setDetectedBike(found);
    setErrorMsg(null);
  };

  const handleExecuteUnlock = () => {
    if (!detectedBike) return;
    playSound('unlock');
    onConfirmUnlock(detectedBike);
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
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                Desbloquear Bicicleta
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                Escanea el código QR del manubrio
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              playSound('click');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="p-3 bg-white border-b border-slate-100">
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => {
                playSound('click');
                setMode('scan');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'scan'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Escáner QR</span>
            </button>
            <button
              onClick={() => {
                playSound('click');
                setMode('manual');
                setErrorMsg(null);
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'manual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Ingresar Código</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 overflow-y-auto">
          {!detectedBike ? (
            mode === 'scan' ? (
              <div className="flex flex-col items-center">
                {/* Simulated Camera Viewfinder */}
                <div className="relative w-64 h-64 rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-inner flex items-center justify-center">
                  {/* Subtle background camera noise / grid */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Flashlight toggle */}
                  <button
                    onClick={() => {
                      playSound('click');
                      setFlashlightOn(!flashlightOn);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-colors z-20 ${
                      flashlightOn ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                    title="Linterna"
                  >
                    <Flashlight className="w-4 h-4" />
                  </button>

                  {/* Animated laser line */}
                  {isScanning && (
                    <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent top-0 animate-[scan_2.2s_ease-in-out_infinite] shadow-[0_0_12px_#10b981]" />
                  )}

                  {/* Corner Target Markers */}
                  <div className="absolute inset-8 pointer-events-none border border-emerald-500/30 rounded-2xl flex flex-col justify-between p-2">
                    <div className="flex justify-between">
                      <div className="w-5 h-5 border-t-2 border-l-2 border-emerald-400 rounded-tl-md" />
                      <div className="w-5 h-5 border-t-2 border-r-2 border-emerald-400 rounded-tr-md" />
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] font-semibold text-emerald-400/80 bg-slate-900/80 px-2 py-0.5 rounded-full">
                        Apunta al código en el manubrio
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <div className="w-5 h-5 border-b-2 border-l-2 border-emerald-400 rounded-bl-md" />
                      <div className="w-5 h-5 border-b-2 border-r-2 border-emerald-400 rounded-br-md" />
                    </div>
                  </div>
                </div>

                {/* Quick Simulation Trigger (Tap a bike below to test scan) */}
                <div className="mt-4 w-full">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1.5 text-center">
                    Selecciona una bici cercana para simular el escaneo:
                  </span>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {availableBikes.slice(0, 4).map((b) => (
                      <button
                        key={b.id}
                        onClick={() => handleSimulateScan(b)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg transition-all"
                      >
                        {b.id} ({b.type === 'electric' ? '⚡ E-Bike' : 'Clásica'})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Manual Code Entry Form */
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Código de la Bicicleta (4-6 caracteres)
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Impreso en el cuadro, debajo del manubrio o en la salpicadera trasera.
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                      placeholder="Ej: BC-101, EB-201"
                      className="w-full text-center text-xl font-mono font-bold tracking-widest py-3 px-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all uppercase"
                      autoFocus
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!manualCode.trim()}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white font-bold text-sm rounded-xl transition-all shadow-sm"
                >
                  Verificar y Continuar
                </button>

                <div className="text-center">
                  <span className="text-[11px] text-slate-400">
                    Bicis de ejemplo disponibles: BC-101, BC-104, EB-201, EB-220
                  </span>
                </div>
              </form>
            )
          ) : (
            /* Bike Detected and Ready to Unlock */
            <div className="space-y-4 animate-scaleUp">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  {detectedBike.type === 'electric' ? (
                    <Zap className="w-6 h-6 fill-amber-300" />
                  ) : (
                    <BikeIcon className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-slate-900">
                      {detectedBike.id}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-semibold text-emerald-800">
                      Lista para liberar
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {detectedBike.name}
                  </h4>
                  <div className="text-xs text-slate-600 mt-1 flex flex-wrap gap-2">
                    {detectedBike.batteryLevel !== undefined && (
                      <span className="text-amber-700 font-semibold">
                        Batería: {detectedBike.batteryLevel}%
                      </span>
                    )}
                    <span>{detectedBike.gearCount} Vel Shimano</span>
                    {detectedBike.hasBasket && <span>· Con Cesta</span>}
                  </div>
                </div>
              </div>

              {/* Rate & Student Subsidized Card */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1.5">
                <div className="flex justify-between font-semibold">
                  <span>Tarifa Estudiantil:</span>
                  <span className="text-emerald-700 font-bold">45 min GRATIS</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Tiempo adicional:</span>
                  <span>$0.50 cada 15 min</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Credencial validada:</span>
                  <span className="text-slate-700 font-medium">Activa (Semestre Otoño 2026)</span>
                </div>
              </div>

              {/* Safety Pledge */}
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={acceptedPledge}
                  onChange={(e) => setAcceptedPledge(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>
                  Me comprometo a respetar el límite de 20 km/h, dar prioridad al peatón y anclar la bici en una estación oficial al finalizar.
                </span>
              </label>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    playSound('click');
                    setDetectedBike(null);
                  }}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Cambiar Bici
                </button>
                <button
                  onClick={handleExecuteUnlock}
                  disabled={!acceptedPledge}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Liberar Candado Ahora</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Sistema verificado por Seguridad del Campus Universitario</span>
        </div>
      </div>
    </div>
  );
};
