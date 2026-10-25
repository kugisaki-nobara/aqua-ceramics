import { Intersection, EmergencyVehicle, NormalVehicle, Destination, UserLocation } from '@/types';

// Bengaluru, Karnataka Default Map Center
export const BENGALURU_CENTER = { lat: 12.9716, lng: 77.5946 };

export const BENGALURU_HOSPITALS: Destination[] = [
  {
    id: 'HOSP-STJOHNS',
    name: "St. John's Medical College Hospital",
    category: 'HOSPITAL',
    lat: 12.9328,
    lng: 77.6200,
    address: 'Sarjapur Main Rd, Koramangala, Bengaluru',
  },
  {
    id: 'HOSP-MANIPAL',
    name: 'Manipal Hospital (HAL Old Airport Rd)',
    category: 'HOSPITAL',
    lat: 12.9575,
    lng: 77.6475,
    address: 'HAL Old Airport Rd, Kodihalli, Bengaluru',
  },
  {
    id: 'HOSP-VICTORIA',
    name: 'Victoria Hospital (Bangalore Medical College)',
    category: 'HOSPITAL',
    lat: 12.9634,
    lng: 77.5750,
    address: 'Fort Road, Near KR Market, Bengaluru',
  },
  {
    id: 'HOSP-NARAYANA',
    name: 'Narayana Health City',
    category: 'HOSPITAL',
    lat: 12.9270,
    lng: 77.6190,
    address: 'Hosur Road, Bommasandra, Bengaluru',
  },
  {
    id: 'HOSP-APOLLO',
    name: 'Apollo Hospitals Bannerghatta',
    category: 'HOSPITAL',
    lat: 12.8965,
    lng: 77.5985,
    address: '154/11, Bannerghatta Main Rd, Bengaluru',
  },
];

export const HOSPITAL_DESTINATION = BENGALURU_HOSPITALS[0]; // St. John's Hospital as default

export const BENGALURU_HUBS = [
  { name: 'MG Road / Brigade Rd', lat: 12.9716, lng: 77.5946 },
  { name: 'Koramangala Sony World', lat: 12.9348, lng: 77.6245 },
  { name: 'Indiranagar 100ft Rd', lat: 12.9719, lng: 77.6412 },
  { name: 'Silk Board Junction', lat: 12.9172, lng: 77.6228 },
  { name: 'Whitefield ITPB', lat: 12.9840, lng: 77.7505 },
  { name: 'Electronic City Phase 1', lat: 12.8452, lng: 77.6602 },
  { name: 'Hebbal Flyover', lat: 13.0358, lng: 77.5970 },
  { name: 'Yeshwanthpur Junction', lat: 13.0238, lng: 77.5501 },
  { name: 'Marathahalli Bridge', lat: 12.9554, lng: 77.7011 },
];

export const INITIAL_INTERSECTIONS: Intersection[] = [
  {
    id: 'INT-BLR-01',
    name: 'Koramangala 80ft Rd & Sony Signal',
    lat: 12.9348,
    lng: 77.6245,
    directions: { NORTH: 'GREEN', SOUTH: 'GREEN', EAST: 'RED', WEST: 'RED' },
    activeAxis: 'NS',
    mode: 'NORMAL',
    trafficDensity: 'HIGH',
    carsWaiting: 8,
    normalCycleTimer: 0,
    preemptionTimer: 0,
  },
  {
    id: 'INT-BLR-02',
    name: 'Hosur Rd & Dairy Circle Flyover',
    lat: 12.9380,
    lng: 77.6045,
    directions: { NORTH: 'RED', SOUTH: 'RED', EAST: 'GREEN', WEST: 'GREEN' },
    activeAxis: 'EW',
    mode: 'NORMAL',
    trafficDensity: 'CONGESTED',
    carsWaiting: 14,
    normalCycleTimer: 5,
    preemptionTimer: 0,
  },
  {
    id: 'INT-BLR-03',
    name: 'MG Road Trinity Circle Junction',
    lat: 12.9729,
    lng: 77.6186,
    directions: { NORTH: 'GREEN', SOUTH: 'GREEN', EAST: 'RED', WEST: 'RED' },
    activeAxis: 'NS',
    mode: 'NORMAL',
    trafficDensity: 'MEDIUM',
    carsWaiting: 6,
    normalCycleTimer: 10,
    preemptionTimer: 0,
  },
  {
    id: 'INT-BLR-04',
    name: 'Richmond Road Expressway',
    lat: 12.9613,
    lng: 77.5960,
    directions: { NORTH: 'RED', SOUTH: 'RED', EAST: 'GREEN', WEST: 'GREEN' },
    activeAxis: 'EW',
    mode: 'NORMAL',
    trafficDensity: 'MEDIUM',
    carsWaiting: 5,
    normalCycleTimer: 15,
    preemptionTimer: 0,
  },
  {
    id: 'INT-BLR-05',
    name: 'Indiranagar 100ft Road Crossing',
    lat: 12.9719,
    lng: 77.6412,
    directions: { NORTH: 'GREEN', SOUTH: 'GREEN', EAST: 'RED', WEST: 'RED' },
    activeAxis: 'NS',
    mode: 'NORMAL',
    trafficDensity: 'HIGH',
    carsWaiting: 10,
    normalCycleTimer: 2,
    preemptionTimer: 0,
  },
  {
    id: 'INT-BLR-06',
    name: 'HAL Airport Road Signal',
    lat: 12.9570,
    lng: 77.6420,
    directions: { NORTH: 'RED', SOUTH: 'RED', EAST: 'GREEN', WEST: 'GREEN' },
    activeAxis: 'EW',
    mode: 'NORMAL',
    trafficDensity: 'MEDIUM',
    carsWaiting: 4,
    normalCycleTimer: 8,
    preemptionTimer: 0,
  },
  {
    id: 'INT-BLR-07',
    name: "St. John's Emergency Entrance Gate",
    lat: 12.9332,
    lng: 77.6212,
    directions: { NORTH: 'GREEN', SOUTH: 'GREEN', EAST: 'RED', WEST: 'RED' },
    activeAxis: 'NS',
    mode: 'NORMAL',
    trafficDensity: 'LOW',
    carsWaiting: 2,
    normalCycleTimer: 12,
    preemptionTimer: 0,
  },
];

export const START_LOCATION = {
  lat: 12.9716,
  lng: 77.5946, // MG Road, Bengaluru
};

export const INITIAL_VEHICLES: EmergencyVehicle[] = [
  {
    id: 'AMB-001',
    name: 'Bengaluru Emergency Unit 1',
    type: 'AMBULANCE',
    status: 'IDLE',
    emergencyType: 'Critical / Cardiac Emergency',
    priority: 'CRITICAL',
    lat: START_LOCATION.lat,
    lng: START_LOCATION.lng,
    speedKmh: 0,
    startLocation: {
      lat: START_LOCATION.lat,
      lng: START_LOCATION.lng,
      name: 'MG Road, Bengaluru',
    },
    destination: HOSPITAL_DESTINATION,
    etaSeconds: 480, // ~8 min
    detectionRadiusMeters: 500,
    routeIntersectionIds: ['INT-BLR-03', 'INT-BLR-04', 'INT-BLR-02', 'INT-BLR-01', 'INT-BLR-07'],
    routeGeometry: [
      [12.9716, 77.5946],
      [12.9729, 77.6186],
      [12.9613, 77.5960],
      [12.9380, 77.6045],
      [12.9348, 77.6245],
      [12.9332, 77.6212],
      [12.9328, 77.6200],
    ],
    routeGeometryIndex: 0,
    currentRouteIndex: 0,
    progressToNextNode: 0,
    totalDistanceKm: 5.4,
    distanceTraveledKm: 0,
  },
  {
    id: 'FIRE-001',
    name: 'Karnataka Fire & Rescue Engine 9',
    type: 'FIRE_TRUCK',
    status: 'IDLE',
    emergencyType: 'Structure Fire Response',
    priority: 'HIGH',
    lat: 12.9719,
    lng: 77.6412,
    speedKmh: 0,
    startLocation: {
      lat: 12.9719,
      lng: 77.6412,
      name: 'Indiranagar, Bengaluru',
    },
    destination: {
      id: 'LOC-COMMERCIAL',
      name: 'Commercial Street Market Block',
      category: 'CUSTOM',
      lat: 12.9810,
      lng: 77.6080,
      address: 'Commercial St, Tasker Town, Bengaluru',
    },
    etaSeconds: 360,
    detectionRadiusMeters: 500,
    routeIntersectionIds: ['INT-BLR-05', 'INT-BLR-03'],
    routeGeometry: [
      [12.9719, 77.6412],
      [12.9729, 77.6186],
      [12.9810, 77.6080],
    ],
    routeGeometryIndex: 0,
    currentRouteIndex: 0,
    progressToNextNode: 0,
    totalDistanceKm: 3.8,
    distanceTraveledKm: 0,
  },
];

export const ALTERNATIVE_ROUTE_BENGALURU = ['INT-BLR-03', 'INT-BLR-06', 'INT-BLR-01', 'INT-BLR-07'];

export const INITIAL_BACKGROUND_TRAFFIC: NormalVehicle[] = [
  { id: 'CAR-BLR-1', lat: 12.9360, lng: 77.6220, speedKmh: 25, targetIntersectionId: 'INT-BLR-01', stopped: false },
  { id: 'CAR-BLR-2', lat: 12.9400, lng: 77.6080, speedKmh: 15, targetIntersectionId: 'INT-BLR-02', stopped: true },
  { id: 'CAR-BLR-3', lat: 12.9710, lng: 77.6150, speedKmh: 35, targetIntersectionId: 'INT-BLR-03', stopped: false },
  { id: 'CAR-BLR-4', lat: 12.9650, lng: 77.6000, speedKmh: 30, targetIntersectionId: 'INT-BLR-04', stopped: false },
  { id: 'CAR-BLR-5', lat: 12.9700, lng: 77.6380, speedKmh: 20, targetIntersectionId: 'INT-BLR-05', stopped: false },
];

/**
 * Utility to calculate geographic distance in meters between two lat/lng coordinates (Haversine formula).
 */
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Radius of Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Determine cardinal direction from coordinate 1 to coordinate 2.
 */
export function getTravelDirection(lat1: number, lng1: number, lat2: number, lng2: number): 'NORTH' | 'SOUTH' | 'EAST' | 'WEST' {
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;

  if (Math.abs(dLat) > Math.abs(dLng)) {
    return dLat > 0 ? 'NORTH' : 'SOUTH';
  } else {
    return dLng > 0 ? 'EAST' : 'WEST';
  }
}
