import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Sparkles, 
  Coffee, 
  Printer, 
  Zap, 
  CheckCircle, 
  ArrowUpRight, 
  QrCode, 
  History, 
  GraduationCap, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { CompletedTrip, UserProfile } from '../types/bike';
import { playSound } from '../utils/sound';

interface StudentCardModalProps {
  isOpen: boolean;
  user: UserProfile;
  trips: CompletedTrip[];
  onClose: () => void;
  onTopUpBalance: (amount: number) => void;
  onRedeemReward: (cost: number, rewardName: string) => void;
}

export const StudentCardModal: React.FC<StudentCardModalProps> = ({
  isOpen,
  user,
  trips,
  onClose,
  onTopUpBalance,
  onRedeemReward
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'wallet' | 'rewards' | 'history'>('card');
  const [topUpAmount, setTopUpAmount] = useState<number>(10);
  const [redeemSuccessMsg, setRedeemSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTopUp = () => {
    playSound('success');
    onTopUpBalance(topUpAmount);
  };

  const handleRedeem = (cost: number, name: string) => {
    if (user.biciPoints < cost) {
      playSound('alert');
      return;
    }
    playSound('success');
    onRedeemReward(cost, name);
    setRedeemSuccessMsg(`¡Canje exitoso! Se ha enviado tu cupón para "${name}" al correo institucional.`);
    setTimeout(() => setRedeemSuccessMsg(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                Credencial y Monedero
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                Matrícula {user.studentId} · {user.faculty}
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

        {/* Tab switch */}
        <div className="p-2.5 bg-white border-b border-slate-100">
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('card');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'card'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Credencial Digital
            </button>
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('wallet');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'wallet'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recargar Saldo
            </button>
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('rewards');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'rewards'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              BiciPoints ({user.biciPoints})
            </button>
            <button
              onClick={() => {
                playSound('click');
                setActiveTab('history');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Historial
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-5 flex-1 overflow-y-auto">
          {activeTab === 'card' && (
            <div className="space-y-4">
              {/* Virtual University Card (Card UI) */}
              <div className="relative rounded-3xl p-6 bg-gradient-to-tr from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl border border-emerald-500/30 overflow-hidden">
                {/* Background watermark seal */}
                <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none">
                  <GraduationCap className="w-56 h-56 text-white" />
                </div>

                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold block">
                      Universidad Metropolitana
                    </span>
                    <h3 className="text-sm font-extrabold text-white">
                      Credencial de Estudiante Activo
                    </h3>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-4 relative z-10">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400/60 shadow-md"
                  />
                  <div>
                    <h4 className="text-base font-bold text-white leading-tight">
                      {user.name}
                    </h4>
                    <span className="text-xs text-slate-300 block mt-0.5 font-mono">
                      {user.studentId}
                    </span>
                    <span className="text-[11px] text-emerald-300 block font-medium">
                      {user.program}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between text-xs relative z-10">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                      Vigencia
                    </span>
                    <span className="font-semibold text-white">Otoño 2026</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">
                      Beneficio Campus
                    </span>
                    <span className="font-bold text-emerald-400">45 min Gratis x Viaje</span>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div className="mt-4 pt-3 flex flex-col items-center justify-center border-t border-slate-800">
                  <div className="h-6 flex items-center gap-1 opacity-80">
                    {Array.from({ length: 32 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-full bg-white"
                        style={{ width: i % 3 === 0 ? '3px' : '1.5px', opacity: i % 5 === 0 ? 0.3 : 1 }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono tracking-widest text-slate-400 mt-1">
                    *{user.studentId}*
                  </span>
                </div>
              </div>

              {/* Status Note */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-slate-700 flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-950 block">
                    Beca de Movilidad Estudiantil Activa
                  </span>
                  <span>
                    Tienes acceso ilimitado a las 7 cicloestaciones universitarias. Todos los trayectos de menos de 45 minutos no tienen costo.
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-4">
              {/* Balance card */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Saldo Disponible</span>
                  <div className="text-3xl font-extrabold text-white mt-0.5 tabular-nums">
                    ${user.balance.toFixed(2)} <span className="text-sm font-normal text-slate-400">MXN</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 block mt-1">
                    Válido para minutos adicionales y e-bikes
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CreditCard className="w-6 h-6" />
                </div>
              </div>

              {/* Reload options */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">
                  Selecciona Monto a Recargar
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 20].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        playSound('click');
                        setTopUpAmount(amt);
                      }}
                      className={`py-3 rounded-xl border text-center font-bold text-sm transition-all ${
                        topUpAmount === amt
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      +${amt} MXN
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Método de pago:</span>
                  <span className="font-semibold text-slate-800">Tarjeta CampusPay / Débito</span>
                </div>
                <div className="flex justify-between">
                  <span>Facturación:</span>
                  <span className="font-semibold text-slate-800">Cuenta de Alumno</span>
                </div>
              </div>

              <button
                onClick={handleTopUp}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Confirmar Recarga de ${topUpAmount}.00</span>
              </button>
            </div>
          )}

          {activeTab === 'rewards' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-2xl flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs text-amber-100 font-semibold uppercase block">
                    BiciPoints Acumulados
                  </span>
                  <div className="text-3xl font-black mt-0.5 flex items-center gap-1.5">
                    <Sparkles className="w-6 h-6 fill-current" />
                    <span>{user.biciPoints}</span>
                  </div>
                  <span className="text-[11px] text-amber-100 mt-0.5 block">
                    Ganas 15 pts por cada km recorrido pedaleando
                  </span>
                </div>
              </div>

              {redeemSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{redeemSuccessMsg}</span>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Recompensas Universitarias
                </h4>

                {/* Reward 1 */}
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Coffee className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900 leading-tight">
                        Café Americano en Cafetería
                      </h5>
                      <span className="text-xs text-slate-500">
                        Válido en Comedor Central
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRedeem(150, 'Café Americano en Cafetería')}
                    disabled={user.biciPoints < 150}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    150 pts
                  </button>
                </div>

                {/* Reward 2 */}
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                      <Printer className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900 leading-tight">
                        10 Impresiones en Biblioteca
                      </h5>
                      <span className="text-xs text-slate-500">
                        Hojas B/N en sala de cómputo
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRedeem(100, '10 Impresiones en Biblioteca')}
                    disabled={user.biciPoints < 100}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    100 pts
                  </button>
                </div>

                {/* Reward 3 */}
                <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-900 leading-tight">
                        Pase E-Bike Libre Todo el Día
                      </h5>
                      <span className="text-xs text-slate-500">
                        Uso de bicicleta eléctrica sin cargo extra
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRedeem(250, 'Pase E-Bike Libre Todo el Día')}
                    disabled={user.biciPoints < 250}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    250 pts
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Últimos Viajes en el Campus
              </h4>

              {trips.length === 0 ? (
                <div className="p-6 text-center text-slate-400 text-xs">
                  Aún no has registrado viajes. ¡Desbloquea tu primera bici!
                </div>
              ) : (
                trips.map((t) => (
                  <div key={t.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{t.bikeName} ({t.bikeId})</span>
                      <span className="text-emerald-700 font-extrabold">${t.cost.toFixed(2)} MXN</span>
                    </div>
                    <div className="text-slate-600">
                      <span>{t.startStationName}</span>
                      <span className="mx-1 text-slate-400">→</span>
                      <span>{t.endStationName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-200/60">
                      <span>{t.durationMinutes} minutos</span>
                      <span>·</span>
                      <span>{t.distanceKm} km</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium">+{t.pointsEarned} pts</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
