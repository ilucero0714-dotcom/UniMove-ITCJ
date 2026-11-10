import React from 'react';
import { Bike, Shield, User, Wrench, Sparkles, Navigation } from 'lucide-react';
import { ActiveRental, UserProfile } from '../types/bike';
import { playSound } from '../utils/sound';

interface HeaderProps {
  user: UserProfile;
  activeRental: ActiveRental | null;
  activeTab: 'map' | 'trips' | 'rules' | 'incidents' | 'operator';
  onSelectTab: (tab: 'map' | 'trips' | 'rules' | 'incidents' | 'operator') => void;
  onOpenUnlock: () => void;
  onOpenTripModal: () => void;
  onOpenStudentCard: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  activeRental,
  activeTab,
  onSelectTab,
  onOpenUnlock,
  onOpenTripModal,
  onOpenStudentCard
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand wordmark (single element) */}
        <button
          onClick={() => {
            playSound('click');
            onSelectTab('map');
          }}
          className="flex items-center gap-2.5 text-left text-emerald-600 hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Bike className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 block leading-none">
              Ciclo<span className="text-emerald-600">Campus</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mt-0.5">
              Movilidad Universitaria
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation links (single line text) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button
            onClick={() => {
              playSound('click');
              onSelectTab('map');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-emerald-600 ${
              activeTab === 'map' ? 'text-emerald-600 font-bold border-b-2 border-emerald-600' : ''
            }`}
          >
            Estaciones y Mapa
          </button>
          <button
            onClick={() => {
              playSound('click');
              onOpenStudentCard();
            }}
            className="whitespace-nowrap shrink-0 transition-colors py-1 hover:text-emerald-600 flex items-center gap-1.5"
          >
            <User className="w-4 h-4 text-slate-400" />
            <span>Mi Carnet</span>
          </button>
          <button
            onClick={() => {
              playSound('click');
              onSelectTab('rules');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-emerald-600 flex items-center gap-1.5 ${
              activeTab === 'rules' ? 'text-emerald-600 font-bold border-b-2 border-emerald-600' : ''
            }`}
          >
            <Shield className="w-4 h-4 text-slate-400" />
            <span>Reglamento</span>
          </button>
          <button
            onClick={() => {
              playSound('click');
              onSelectTab('incidents');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-emerald-600 flex items-center gap-1.5 ${
              activeTab === 'incidents' ? 'text-emerald-600 font-bold border-b-2 border-emerald-600' : ''
            }`}
          >
            <Wrench className="w-4 h-4 text-slate-400" />
            <span>Reportar Falla</span>
          </button>
          <button
            onClick={() => {
              playSound('click');
              onSelectTab('operator');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-indigo-600 text-xs font-medium text-slate-500 ${
              activeTab === 'operator' ? 'text-indigo-600 font-bold' : ''
            }`}
          >
            Panel Operador
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick wallet/points preview button */}
          <button
            onClick={() => {
              playSound('click');
              onOpenStudentCard();
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 transition-colors text-xs font-semibold text-slate-700"
            title="Ver monedero y saldo estudiantil"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>${user.balance.toFixed(2)}</span>
            <span className="text-slate-400">·</span>
            <span className="text-amber-600 flex items-center gap-0.5">
              <Sparkles className="w-3 h-3" />
              {user.biciPoints} pts
            </span>
          </button>

          {activeRental ? (
            <button
              onClick={() => {
                playSound('click');
                onOpenTripModal();
              }}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-all shadow-sm shadow-amber-500/20 flex items-center gap-2 whitespace-nowrap shrink-0 active:scale-95 animate-pulse"
            >
              <Navigation className="w-4 h-4" />
              <span>Viaje Activo ({activeRental.bikeId})</span>
            </button>
          ) : (
            <button
              onClick={() => {
                playSound('click');
                onOpenUnlock();
              }}
              className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm shadow-emerald-600/25 flex items-center gap-2 whitespace-nowrap shrink-0 active:scale-95"
            >
              <Bike className="w-4 h-4" />
              <span>Desbloquear Bici</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
