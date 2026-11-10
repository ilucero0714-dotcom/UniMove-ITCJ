export type BikeType = 'standard' | 'electric' | 'cargo';

export interface Bike {
  id: string; // e.g., 'BC-101'
  name: string;
  type: BikeType;
  stationId: string;
  batteryLevel?: number; // for electric
  gearCount: number;
  hasBasket: boolean;
  status: 'available' | 'rented' | 'reserved' | 'maintenance';
  lastServiceDate: string;
  totalKm: number;
}

export interface CampusStation {
  id: string;
  name: string;
  zone: string; // 'Zona Norte', 'Centro Académico', etc.
  description: string;
  x: number; // percentage on map 0-100
  y: number; // percentage on map 0-100
  totalDocks: number;
  availableBikes: number;
  availableDocks: number;
  electricAvailable: number;
  standardAvailable: number;
  popularFor: string;
  imageUrl?: string;
}

export interface ActiveRental {
  id: string;
  bikeId: string;
  bikeName: string;
  bikeType: BikeType;
  startStationId: string;
  startStationName: string;
  startTime: number; // timestamp
  isPaused: boolean;
  pauseStartTime?: number;
  totalPausedSeconds: number;
  currentKm: number;
  caloriesBurned: number;
  co2SavedGrams: number;
}

export interface CompletedTrip {
  id: string;
  bikeId: string;
  bikeName: string;
  bikeType: BikeType;
  startStationName: string;
  endStationName: string;
  startTime: number;
  endTime: number;
  durationMinutes: number;
  distanceKm: number;
  co2SavedGrams: number;
  cost: number;
  pointsEarned: number;
}

export interface UserProfile {
  name: string;
  studentId: string;
  faculty: string;
  program: string;
  semester: string;
  avatarUrl: string;
  balance: number; // in USD or local currency
  biciPoints: number;
  freeMinutesRemainingToday: number;
  subscriptionType: 'Estudiante Regular' | 'Beca Movilidad Sostenible';
}

export interface IncidentReport {
  id: string;
  bikeId: string;
  stationName: string;
  issueType: 'frenos' | 'neumatico' | 'cadena' | 'asiento' | 'luces' | 'muelle' | 'otro';
  description: string;
  reportedAt: string;
  status: 'recibido' | 'en_taller' | 'resuelto';
}
