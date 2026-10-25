import { UserLocation } from '@/types';

export const BENGALURU_DEFAULT_LOCATION: UserLocation = {
  lat: 12.9716,
  lng: 77.5946,
  isDefault: true,
  addressName: 'MG Road, Bengaluru, Karnataka (Default)',
};

/**
 * Request user's current GPS location via HTML5 navigator.geolocation.
 * Falls back safely to Bengaluru default location if permission denied or unavailable.
 */
export function getCurrentUserLocation(): Promise<{ location: UserLocation; error?: string }> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      resolve({
        location: BENGALURU_DEFAULT_LOCATION,
        error: 'Browser Geolocation API is not supported on this device. Using default Bengaluru location.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            isDefault: false,
            addressName: 'Current User Location',
            accuracy: position.coords.accuracy,
          },
        });
      },
      (geoError) => {
        let errorMsg = 'Location permission denied or unavailable. Falling back to default Bengaluru location.';
        if (geoError.code === geoError.PERMISSION_DENIED) {
          errorMsg = 'Location permission was denied. Using default Bengaluru location.';
        } else if (geoError.code === geoError.TIMEOUT) {
          errorMsg = 'Location request timed out. Using default Bengaluru location.';
        }
        resolve({
          location: BENGALURU_DEFAULT_LOCATION,
          error: errorMsg,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  });
}

/**
 * Privacy Protection Helper:
 * Ensures precise user coordinates are never sent to external AI APIs.
 * Converts coordinates into generalized district/region descriptions for AI context.
 */
export function sanitizeLocationForAI(lat: number, lng: number): string {
  // Coarsen coordinates to ~1km resolution for privacy protection
  const coarsenedLat = Math.round(lat * 100) / 100;
  const coarsenedLng = Math.round(lng * 100) / 100;
  return `Urban Sector [Lat ~${coarsenedLat}, Lng ~${coarsenedLng}]`;
}
