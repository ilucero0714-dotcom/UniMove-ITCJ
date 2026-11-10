import { Bike, CampusStation, CompletedTrip, IncidentReport, UserProfile } from '../types/bike';

export const INITIAL_STATIONS: CampusStation[] = [
  {
    id: 'st-biblio',
    name: 'Biblioteca Central & Rectoría',
    zone: 'Plaza Mayor',
    description: 'Estación principal frente a la biblioteca central y jardines de rectoría. Conexión rápida a facultades.',
    x: 48,
    y: 35,
    totalDocks: 16,
    availableBikes: 9,
    availableDocks: 7,
    electricAvailable: 4,
    standardAvailable: 5,
    popularFor: 'Estudio matutino y trámites universitarios',
    imageUrl: '/src/assets/images/campus_bike_hero_1794300654366.jpg'
  },
  {
    id: 'st-ing',
    name: 'Facultad de Ingeniería & Aulas 400',
    zone: 'Ala Tecnológica',
    description: 'Junto a los talleres de robótica y cubículos de computación. Ciclovía rápida al auditorio.',
    x: 75,
    y: 42,
    totalDocks: 14,
    availableBikes: 6,
    availableDocks: 8,
    electricAvailable: 3,
    standardAvailable: 3,
    popularFor: 'Cambio de clases de ciencias exactas'
  },
  {
    id: 'st-comedor',
    name: 'Comedor Central & Centro Estudiantil',
    zone: 'Zona de Servicios',
    description: 'Ubicada frente a cafeterías universitarias, cajeros y áreas de descanso estudiantil.',
    x: 32,
    y: 54,
    totalDocks: 18,
    availableBikes: 11,
    availableDocks: 7,
    electricAvailable: 5,
    standardAvailable: 6,
    popularFor: 'Almuerzo y eventos culturales de mediodía',
    imageUrl: '/src/assets/images/ebike_station_campus_1794300656846.jpg'
  },
  {
    id: 'st-deportes',
    name: 'Complejo Deportivo & Pista Atlética',
    zone: 'Área Deportiva',
    description: 'Frente a las canchas de fútbol rápido, piscina olímpica y gimnasio estudiantil.',
    x: 20,
    y: 78,
    totalDocks: 12,
    availableBikes: 5,
    availableDocks: 7,
    electricAvailable: 2,
    standardAvailable: 3,
    popularFor: 'Entrenamientos vespertinos y ligas internas'
  },
  {
    id: 'st-norte',
    name: 'Acceso Norte & Transporte Metrobus',
    zone: 'Entrada Principal',
    description: 'Punto de interconexión con transporte público exterior. Estación de alta rotación por la mañana.',
    x: 48,
    y: 12,
    totalDocks: 20,
    availableBikes: 13,
    availableDocks: 7,
    electricAvailable: 6,
    standardAvailable: 7,
    popularFor: 'Llegadas al campus de 7:00 a 9:00 AM'
  },
  {
    id: 'st-lab',
    name: 'Edificio de Ciencias & Bio-Laboratorios',
    zone: 'Ala Científica',
    description: 'Próxima al vivero botánico, laboratorios de química y aulas de medicina.',
    x: 82,
    y: 72,
    totalDocks: 12,
    availableBikes: 7,
    availableDocks: 5,
    electricAvailable: 3,
    standardAvailable: 4,
    popularFor: 'Prácticas de laboratorio y tesis'
  },
  {
    id: 'st-residencias',
    name: 'Residencias Universitarias Sur',
    zone: 'Zona Residencial',
    description: 'Junto a los dormitorios universitarios y lavandería comunitaria.',
    x: 52,
    y: 86,
    totalDocks: 15,
    availableBikes: 8,
    availableDocks: 7,
    electricAvailable: 3,
    standardAvailable: 5,
    popularFor: 'Regreso nocturno y salidas tempranas'
  }
];

export const INITIAL_BIKES: Bike[] = [
  {
    id: 'BC-101',
    name: 'Campus Cruiser Shimano 3S',
    type: 'standard',
    stationId: 'st-biblio',
    gearCount: 3,
    hasBasket: true,
    status: 'available',
    lastServiceDate: '02 Mar 2026',
    totalKm: 142.5
  },
  {
    id: 'BC-104',
    name: 'Campus Cruiser Shimano 3S',
    type: 'standard',
    stationId: 'st-biblio',
    gearCount: 3,
    hasBasket: true,
    status: 'available',
    lastServiceDate: '04 Mar 2026',
    totalKm: 98.2
  },
  {
    id: 'EB-201',
    name: 'EcoRider E-Glide 250W',
    type: 'electric',
    stationId: 'st-biblio',
    batteryLevel: 94,
    gearCount: 7,
    hasBasket: true,
    status: 'available',
    lastServiceDate: '01 Mar 2026',
    totalKm: 310.8
  },
  {
    id: 'EB-208',
    name: 'EcoRider E-Glide 250W',
    type: 'electric',
    stationId: 'st-biblio',
    batteryLevel: 82,
    gearCount: 7,
    hasBasket: true,
    status: 'available',
    lastServiceDate: '03 Mar 2026',
    totalKm: 275.0
  },
  {
    id: 'CG-301',
    name: 'Campus Cargo & Modelos',
    type: 'cargo',
    stationId: 'st-ing',
    gearCount: 7,
    hasBasket: true,
    status: 'available',
    lastServiceDate: '28 Feb 2026',
    totalKm: 115.4
  },
  {
    id: 'EB-215',
    name: 'EcoRider E-Glide 250W',
    type: 'electric',
    stationId: 'st-ing',
    batteryLevel: 88,
    gearCount: 7,
    hasBasket: true,
    status: 'available',
    lastServiceDate: '02 Mar 2026',
    totalKm: 189.0
  },
  {
    id: 'BC-112',
    name: 'Campus Cruiser Shimano 3S',
    type: 'standard',
    stationId: 'st-ing',
    gearCount: 3,
    hasBasket: true,
    status: 'available',
    lastServiceDate: '05 Mar 2026',
    totalKm: 64.0
  },
  {
    id: 'EB-220',
    name: 'EcoRider E-Glide 250W',
    type: 'electric',
    stationId: 'st-comedor',
    batteryLevel: 98,
    gearCount: 7,
    hasBasket: true,
    status: 'available',
    lastServiceDate: '05 Mar 2026',
    totalKm: 145.2
  },
  {
    id: 'BC-119',
    name: 'Campus Cruiser Shimano 3S',
    type: 'standard',
    stationId: 'st-comedor',
    gearCount: 3,
    hasBasket: true,
    status: 'available',
    lastServiceDate: '01 Mar 2026',
    totalKm: 210.0
  },
  {
    id: 'EB-231',
    name: 'EcoRider E-Glide 250W',
    type: 'electric',
    stationId: 'st-norte',
    batteryLevel: 91,
    gearCount: 7,
    hasBasket: true,
    status: 'available',
    lastServiceDate: '06 Mar 2026',
    totalKm: 88.0
  },
  {
    id: 'BC-125',
    name: 'Campus Cruiser Shimano 3S',
    type: 'standard',
    stationId: 'st-norte',
    gearCount: 3,
    hasBasket: true,
    status: 'available',
    lastServiceDate: '03 Mar 2026',
    totalKm: 177.3
  },
  {
    id: 'EB-240',
    name: 'EcoRider E-Glide 250W',
    type: 'electric',
    stationId: 'st-deportes',
    batteryLevel: 75,
    gearCount: 7,
    hasBasket: true,
    status: 'available',
    lastServiceDate: '27 Feb 2026',
    totalKm: 340.1
  },
  {
    id: 'BC-133',
    name: 'Campus Cruiser Shimano 3S',
    type: 'standard',
    stationId: 'st-residencias',
    gearCount: 3,
    hasBasket: true,
    status: 'available',
    lastServiceDate: '02 Mar 2026',
    totalKm: 120.9
  }
];

export const INITIAL_USER: UserProfile = {
  name: 'Valeria Méndez R.',
  studentId: '2024-ING-4108',
  faculty: 'Facultad de Ingeniería',
  program: 'Ingeniería en Sistemas Computacionales',
  semester: '4to Semestre',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  balance: 14.50,
  biciPoints: 420,
  freeMinutesRemainingToday: 45,
  subscriptionType: 'Beca Movilidad Sostenible'
};

export const INITIAL_TRIPS: CompletedTrip[] = [
  {
    id: 'trip-101',
    bikeId: 'EB-201',
    bikeName: 'EcoRider E-Glide 250W',
    bikeType: 'electric',
    startStationName: 'Acceso Norte & Transporte Metrobus',
    endStationName: 'Biblioteca Central & Rectoría',
    startTime: Date.now() - 1000 * 60 * 60 * 24, // yesterday
    endTime: Date.now() - 1000 * 60 * 60 * 24 + 1000 * 60 * 14,
    durationMinutes: 14,
    distanceKm: 1.8,
    co2SavedGrams: 320,
    cost: 0.0,
    pointsEarned: 25
  },
  {
    id: 'trip-102',
    bikeId: 'BC-104',
    bikeName: 'Campus Cruiser Shimano 3S',
    bikeType: 'standard',
    startStationName: 'Facultad de Ingeniería & Aulas 400',
    endStationName: 'Comedor Central & Centro Estudiantil',
    startTime: Date.now() - 1000 * 60 * 60 * 48,
    endTime: Date.now() - 1000 * 60 * 60 * 48 + 1000 * 60 * 9,
    durationMinutes: 9,
    distanceKm: 1.1,
    co2SavedGrams: 210,
    cost: 0.0,
    pointsEarned: 15
  }
];

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    id: 'inc-01',
    bikeId: 'BC-112',
    stationName: 'Facultad de Ingeniería & Aulas 400',
    issueType: 'frenos',
    description: 'Freno delantero requiere ajuste de tensión, zapatas rechinan ligeramente.',
    reportedAt: '08 Mar 2026, 11:30',
    status: 'en_taller'
  }
];

export const CAMPUS_RULES = [
  {
    title: 'Prioridad Absoluta al Peatón',
    description: 'En andadores compartidos y cruces peatonales, los peatones siempre tienen preferencia. Modera tu velocidad.',
    icon: 'Footprints'
  },
  {
    title: 'Límite de Velocidad: 20 km/h',
    description: 'El límite máximo en ciclovías internas es de 20 km/h. En zonas con afluencia estudiantil reduce a 10 km/h.',
    icon: 'Gauge'
  },
  {
    title: 'Entrega en Cicloestaciones Oficiales',
    description: 'Siempre ancla la bicicleta hasta escuchar el clic de confirmación en una de las 7 estaciones oficiales del campus.',
    icon: 'ParkingCircle'
  },
  {
    title: 'Uso de Casco Recomendado',
    description: 'Se recomienda portar casco protector. Puedes solicitar uno gratuito en el módulo de Biblioteca con tu carnet.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Reserva Estudiantil de 15 Minutos',
    description: 'Puedes apartar una bicicleta con 15 minutos de anticipación al terminar tu clase sin penalización.',
    icon: 'Clock'
  }
];
