import React, { useState, useEffect } from 'react';
import { 
  Bike as BikeIcon, 
  Zap, 
  Leaf, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  MapPin, 
  QrCode, 
  ChevronRight, 
  User, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { 
  Bike, 
  CampusStation, 
  ActiveRental, 
  CompletedTrip, 
  UserProfile, 
  IncidentReport 
} from './types/bike';
import { 
  INITIAL_STATIONS, 
  INITIAL_BIKES, 
  INITIAL_USER, 
  INITIAL_TRIPS, 
  INITIAL_INCIDENTS 
} from './data/mockData';
import { playSound } from './utils/sound';

import { Header } from './components/Header';
import { CampusMap } from './components/CampusMap';
import { StationDetailModal } from './components/StationDetailModal';
import { QRUnlockModal } from './components/QRUnlockModal';
import { ActiveTripBanner } from './components/ActiveTripBanner';
import { ActiveTripModal } from './components/ActiveTripModal';
import { TripSummaryModal } from './components/TripSummaryModal';
import { StudentCardModal } from './components/StudentCardModal';
import { ReportIncidentModal } from './components/ReportIncidentModal';
import { CampusGuideModal } from './components/CampusGuideModal';
import { OperatorPanelModal } from './components/OperatorPanelModal';

export default function App() {
  // Load state from localStorage or initial mock data
  const [stations, setStations] = useState<CampusStation[]>(() => {
    try {
      const saved = localStorage.getItem('ciclocampus_stations');
      return saved ? JSON.parse(saved) : INITIAL_STATIONS;
    } catch {
      return INITIAL_STATIONS;
    }
  });

  const [bikes, setBikes] = useState<Bike[]>(() => {
    try {
      const saved = localStorage.getItem('ciclocampus_bikes');
      return saved ? JSON.parse(saved) : INITIAL_BIKES;
    } catch {
      return INITIAL_BIKES;
    }
  });

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('ciclocampus_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [trips, setTrips] = useState<CompletedTrip[]>(() => {
    try {
      const saved = localStorage.getItem('ciclocampus_trips');
      return saved ? JSON.parse(saved) : INITIAL_TRIPS;
    } catch {
      return INITIAL_TRIPS;
    }
  });

  const [incidents, setIncidents] = useState<IncidentReport[]>(() => {
    try {
      const saved = localStorage.getItem('ciclocampus_incidents');
      return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  });

  const [activeRental, setActiveRental] = useState<ActiveRental | null>(() => {
    try {
      const saved = localStorage.getItem('ciclocampus_active_rental');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation & Modal States
  const [activeTab, setActiveTab] = useState<'map' | 'trips' | 'rules' | 'incidents' | 'operator'>('map');
  const [selectedStation, setSelectedStation] = useState<CampusStation | null>(null);
  const [reservedBikeId, setReservedBikeId] = useState<string | null>(null);
  const [reservationTimer, setReservationTimer] = useState<number | null>(null);

  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isActiveTripModalOpen, setIsActiveTripModalOpen] = useState(false);
  const [completedTripToShow, setCompletedTripToShow] = useState<CompletedTrip | null>(null);
  const [isStudentCardOpen, setIsStudentCardOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isOperatorModalOpen, setIsOperatorModalOpen] = useState(false);
  const [preselectedBikeForReport, setPreselectedBikeForReport] = useState<string | null>(null);

  // Active trip elapsed time counter
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('ciclocampus_stations', JSON.stringify(stations));
  }, [stations]);

  useEffect(() => {
    localStorage.setItem('ciclocampus_bikes', JSON.stringify(bikes));
  }, [bikes]);

  useEffect(() => {
    localStorage.setItem('ciclocampus_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ciclocampus_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('ciclocampus_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    if (activeRental) {
      localStorage.setItem('ciclocampus_active_rental', JSON.stringify(activeRental));
    } else {
      localStorage.removeItem('ciclocampus_active_rental');
    }
  }, [activeRental]);

  // Trip timer interval effect
  useEffect(() => {
    if (!activeRental) {
      setElapsedSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      if (!activeRental.isPaused) {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          // Calculate incremental distance (approx 16 km/h)
          const kmAdded = 0.0044; // ~16 km/h
          const caloriesAdded = 0.15;
          const co2Added = 0.8;

          setActiveRental((curr) => {
            if (!curr) return null;
            return {
              ...curr,
              currentKm: Number((curr.currentKm + kmAdded).toFixed(2)),
              caloriesBurned: Math.round(curr.caloriesBurned + caloriesAdded),
              co2SavedGrams: Math.round(curr.co2SavedGrams + co2Added)
            };
          });

          return next;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeRental]);

  // Handle Bike Unlock & Start Ride
  const handleStartRental = (bike: Bike) => {
    const startStation = stations.find((s) => s.id === bike.stationId) || stations[0];

    const newRental: ActiveRental = {
      id: `ride-${Date.now()}`,
      bikeId: bike.id,
      bikeName: bike.name,
      bikeType: bike.type,
      startStationId: startStation.id,
      startStationName: startStation.name,
      startTime: Date.now(),
      isPaused: false,
      totalPausedSeconds: 0,
      currentKm: 0.1,
      caloriesBurned: 4,
      co2SavedGrams: 20
    };

    // Update bike status
    setBikes((prev) =>
      prev.map((b) => (b.id === bike.id ? { ...b, status: 'rented' } : b))
    );

    // Update station count
    setStations((prev) =>
      prev.map((st) => {
        if (st.id === startStation.id) {
          return {
            ...st,
            availableBikes: Math.max(0, st.availableBikes - 1),
            availableDocks: Math.min(st.totalDocks, st.availableDocks + 1),
            electricAvailable:
              bike.type === 'electric'
                ? Math.max(0, st.electricAvailable - 1)
                : st.electricAvailable,
            standardAvailable:
              bike.type === 'standard'
                ? Math.max(0, st.standardAvailable - 1)
                : st.standardAvailable
          };
        }
        return st;
      })
    );

    setActiveRental(newRental);
    setElapsedSeconds(0);
    setReservedBikeId(null);
    setIsActiveTripModalOpen(true);
  };

  // Toggle Pause Ride
  const handleTogglePause = () => {
    if (!activeRental) return;
    playSound(activeRental.isPaused ? 'unlock' : 'lock');
    setActiveRental((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        isPaused: !prev.isPaused,
        pauseStartTime: !prev.isPaused ? Date.now() : undefined
      };
    });
  };

  // Finish Rental at Station Dock
  const handleFinishRentalAtStation = (destinationStationId: string) => {
    if (!activeRental) return;

    const endStation = stations.find((s) => s.id === destinationStationId) || stations[0];
    const durationMins = Math.max(1, Math.round(elapsedSeconds / 60));
    const distanceKm = Math.max(0.4, Number(activeRental.currentKm.toFixed(1)));
    const co2Grams = Math.max(80, activeRental.co2SavedGrams);
    const pointsGained = Math.round(distanceKm * 15) + 10;

    // Subsidized cost: first 45 min $0.00
    const extraMinutes = Math.max(0, durationMins - 45);
    const extraCost = Math.ceil(extraMinutes / 15) * 0.5;

    const finishedTrip: CompletedTrip = {
      id: `trip-${Date.now()}`,
      bikeId: activeRental.bikeId,
      bikeName: activeRental.bikeName,
      bikeType: activeRental.bikeType,
      startStationName: activeRental.startStationName,
      endStationName: endStation.name,
      startTime: activeRental.startTime,
      endTime: Date.now(),
      durationMinutes: durationMins,
      distanceKm: distanceKm,
      co2SavedGrams: co2Grams,
      cost: extraCost,
      pointsEarned: pointsGained
    };

    // Update stations: add bike to return station
    setStations((prev) =>
      prev.map((st) => {
        if (st.id === destinationStationId) {
          return {
            ...st,
            availableBikes: Math.min(st.totalDocks, st.availableBikes + 1),
            availableDocks: Math.max(0, st.availableDocks - 1),
            electricAvailable:
              activeRental.bikeType === 'electric'
                ? st.electricAvailable + 1
                : st.electricAvailable,
            standardAvailable:
              activeRental.bikeType === 'standard'
                ? st.standardAvailable + 1
                : st.standardAvailable
          };
        }
        return st;
      })
    );

    // Update bike dock location and status
    setBikes((prev) =>
      prev.map((b) =>
        b.id === activeRental.bikeId
          ? {
              ...b,
              status: 'available',
              stationId: destinationStationId,
              totalKm: Number((b.totalKm + distanceKm).toFixed(1))
            }
          : b
      )
    );

    // Update user: add points and subtract cost if any
    setUser((prev) => ({
      ...prev,
      biciPoints: prev.biciPoints + pointsGained,
      balance: Math.max(0, prev.balance - extraCost)
    }));

    // Record in history
    setTrips((prev) => [finishedTrip, ...prev]);

    // Clear active rental and show celebratory summary
    setActiveRental(null);
    setCompletedTripToShow(finishedTrip);
  };

  // Reserve bike for 15 mins
  const handleReserveBike = (bike: Bike) => {
    playSound('beep');
    setReservedBikeId(bike.id);
    setReservationTimer(15 * 60);
  };

  const handleCancelReservation = () => {
    playSound('click');
    setReservedBikeId(null);
    setReservationTimer(null);
  };

  // Balance top up
  const handleTopUp = (amount: number) => {
    setUser((prev) => ({
      ...prev,
      balance: prev.balance + amount
    }));
  };

  // Redeem Reward
  const handleRedeemReward = (cost: number, name: string) => {
    setUser((prev) => ({
      ...prev,
      biciPoints: Math.max(0, prev.biciPoints - cost)
    }));
  };

  // Submit incident
  const handleSubmitIncident = (
    report: Omit<IncidentReport, 'id' | 'reportedAt' | 'status'>
  ) => {
    const newInc: IncidentReport = {
      ...report,
      id: `INC-${Date.now().toString().slice(-4)}`,
      reportedAt: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'en_taller'
    };

    setIncidents((prev) => [newInc, ...prev]);

    // Mark bike as in maintenance
    setBikes((prev) =>
      prev.map((b) => (b.id === report.bikeId ? { ...b, status: 'maintenance' } : b))
    );
  };

  // Fleet rebalance simulation
  const handleRebalanceFleet = () => {
    // Redistribute bikes evenly across stations
    setStations((prev) =>
      prev.map((s) => ({
        ...s,
        availableBikes: Math.round(s.totalDocks * 0.6),
        availableDocks: Math.round(s.totalDocks * 0.4)
      }))
    );
  };

  // Resolve incident
  const handleResolveIncident = (incidentId: string) => {
    const inc = incidents.find((i) => i.id === incidentId);
    if (inc) {
      setBikes((prev) =>
        prev.map((b) => (b.id === inc.bikeId ? { ...b, status: 'available' } : b))
      );
    }
    setIncidents((prev) => prev.filter((i) => i.id !== incidentId));
  };

  // Add new bike
  const handleAddNewBike = (newBike: Bike) => {
    setBikes((prev) => [newBike, ...prev]);
    setStations((prev) =>
      prev.map((s) =>
        s.id === newBike.stationId
          ? {
              ...s,
              availableBikes: s.availableBikes + 1,
              availableDocks: Math.max(0, s.availableDocks - 1)
            }
          : s
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Bar Header */}
      <Header
        user={user}
        activeRental={activeRental}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'rules') setIsGuideModalOpen(true);
          else if (tab === 'incidents') setIsReportModalOpen(true);
          else if (tab === 'operator') setIsOperatorModalOpen(true);
          else setActiveTab(tab);
        }}
        onOpenUnlock={() => setIsQRModalOpen(true)}
        onOpenTripModal={() => setIsActiveTripModalOpen(true)}
        onOpenStudentCard={() => setIsStudentCardOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Reservation Alert if student has an active hold */}
        {reservedBikeId && (
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-300 shadow-xs flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <span className="text-xs font-bold text-amber-950 block">
                  Bicicleta {reservedBikeId} apartada para ti
                </span>
                <span className="text-[11px] text-amber-800">
                  Tienes 15 minutos para llegar a la estación y desbloquearla antes de que se libere.
                </span>
              </div>
            </div>
            <button
              onClick={handleCancelReservation}
              className="text-xs font-semibold text-amber-900 underline hover:no-underline whitespace-nowrap shrink-0"
            >
              Liberar muelle
            </button>
          </div>
        )}

        {/* Hero Banner for University Mobility Program */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl border border-slate-800">
          <div className="absolute inset-0">
            <img
              src="/src/assets/images/campus_bike_hero_1794300654366.jpg"
              alt="Campus Universitario CicloCampus"
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Red de Movilidad Sustentable 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Múevete libremente por el campus en bicicleta.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              Préstamo gratuito de hasta 45 minutos por trayecto con tu credencial de estudiante. Conecta bibliotecas, facultades, canchas y transporte en minutos.
            </p>

            {/* Quick Action CTA Strip */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  playSound('click');
                  setIsQRModalOpen(true);
                }}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Desbloquear Bici con QR</span>
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  setIsStudentCardOpen(true);
                }}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-bold text-sm rounded-xl backdrop-blur-md transition-all flex items-center gap-2 border border-white/20"
              >
                <User className="w-4 h-4" />
                <span>Ver Mi Credencial</span>
              </button>
            </div>
          </div>

          {/* Bottom Metric Strip */}
          <div className="relative z-10 border-t border-slate-800 bg-slate-950/70 backdrop-blur-sm grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-800 text-center py-3">
            <div className="px-3">
              <span className="text-xs sm:text-sm font-extrabold text-white block tabular-nums">45 Minutos</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Gratis x Alumno</span>
            </div>
            <div className="px-3">
              <span className="text-xs sm:text-sm font-extrabold text-emerald-400 block tabular-nums">7 Estaciones</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">En todo el campus</span>
            </div>
            <div className="px-3">
              <span className="text-xs sm:text-sm font-extrabold text-white block tabular-nums">{bikes.length} Bicicletas</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Clásicas y E-Bikes</span>
            </div>
            <div className="px-3">
              <span className="text-xs sm:text-sm font-extrabold text-cyan-400 block tabular-nums">1,420 kg CO₂</span>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Ahorrados al semestre</span>
            </div>
          </div>
        </div>

        {/* The Interactive Campus Map Section */}
        <section aria-labelledby="map-title">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 id="map-title" className="text-lg font-black text-slate-900 tracking-tight">
                Mapa en Tiempo Real del Campus
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Consulta disponibilidad de bicicletas y muelles libres en cada facultad
              </p>
            </div>

            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden sm:inline">Reglamento del Campus</span>
            </button>
          </div>

          <CampusMap
            stations={stations}
            selectedStationId={selectedStation?.id || null}
            onSelectStation={(st) => setSelectedStation(st)}
            onOpenUnlock={(stId) => setIsQRModalOpen(true)}
          />
        </section>

        {/* Feature Cards: Safe Cycling & Student Benefits */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <BikeIcon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                Bicis Mecánicas & E-Bikes 250W
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Todas las unidades cuentan con cambio de marchas Shimano, canastilla delantera porta-mochilas y luces dynamo para traslados nocturnos seguros.
              </p>
            </div>
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="mt-4 text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 self-start"
            >
              <span>Desbloquear ahora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                Monedero & BiciPoints
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Acumula puntos por cada kilómetro recorrido. Canjéalos en la cafetería universitaria por café o por hojas de impresión en la biblioteca.
              </p>
            </div>
            <button
              onClick={() => setIsStudentCardOpen(true)}
              className="mt-4 text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 self-start"
            >
              <span>Ver catálogo de premios</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <Leaf className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                Campus Cero Emisiones
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Cada viaje en CicloCampus evita la emisión de gases contaminantes y despeja las vías peatonales universitarias.
              </p>
            </div>
            <div className="mt-4 text-xs font-bold text-blue-800">
              Contribución: 100% Sostenible
            </div>
          </div>
        </section>
      </main>

      {/* Floating Active Trip Banner if a bike is currently rented */}
      {activeRental && (
        <ActiveTripBanner
          rental={activeRental}
          elapsedSeconds={elapsedSeconds}
          onOpenDetails={() => setIsActiveTripModalOpen(true)}
          onTogglePause={handleTogglePause}
          onFinishTrip={() => setIsActiveTripModalOpen(true)}
        />
      )}

      {/* Modals */}
      <StationDetailModal
        station={selectedStation}
        bikes={bikes}
        activeRental={activeRental}
        reservedBikeId={reservedBikeId}
        onClose={() => setSelectedStation(null)}
        onUnlockBike={(bike) => handleStartRental(bike)}
        onReserveBike={(bike) => handleReserveBike(bike)}
        onCancelReservation={handleCancelReservation}
        onReturnBikeToStation={(stId) => handleFinishRentalAtStation(stId)}
      />

      <QRUnlockModal
        isOpen={isQRModalOpen}
        bikes={bikes}
        stations={stations}
        onClose={() => setIsQRModalOpen(false)}
        onConfirmUnlock={(bike) => handleStartRental(bike)}
      />

      <ActiveTripModal
        isOpen={isActiveTripModalOpen}
        rental={activeRental}
        stations={stations}
        elapsedSeconds={elapsedSeconds}
        onClose={() => setIsActiveTripModalOpen(false)}
        onTogglePause={handleTogglePause}
        onFinishRentalAtStation={(stId) => handleFinishRentalAtStation(stId)}
      />

      <TripSummaryModal
        trip={completedTripToShow}
        onClose={() => setCompletedTripToShow(null)}
        onReportIssue={(bId) => {
          setPreselectedBikeForReport(bId);
          setIsReportModalOpen(true);
        }}
      />

      <StudentCardModal
        isOpen={isStudentCardOpen}
        user={user}
        trips={trips}
        onClose={() => setIsStudentCardOpen(false)}
        onTopUpBalance={handleTopUp}
        onRedeemReward={handleRedeemReward}
      />

      <ReportIncidentModal
        isOpen={isReportModalOpen}
        bikes={bikes}
        stations={stations}
        initialBikeId={preselectedBikeForReport}
        onClose={() => {
          setIsReportModalOpen(false);
          setPreselectedBikeForReport(null);
        }}
        onSubmitReport={handleSubmitIncident}
      />

      <CampusGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      <OperatorPanelModal
        isOpen={isOperatorModalOpen}
        stations={stations}
        bikes={bikes}
        incidents={incidents}
        activeTripsCount={activeRental ? 1 : 0}
        onClose={() => setIsOperatorModalOpen(false)}
        onRebalanceFleet={handleRebalanceFleet}
        onResolveIncident={handleResolveIncident}
        onAddNewBike={handleAddNewBike}
      />

      {/* Quiet University Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <BikeIcon className="w-4 h-4 text-emerald-600" />
            <span>CicloCampus · Sistema Universitario de Bicis Compartidas</span>
          </div>
          <div>
            <span>Dirección General de Movilidad y Sustentabilidad Universitaria © 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
