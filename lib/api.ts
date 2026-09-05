import { Trip, TripFormData, AuthCredentials } from './types';

class TripLoggerAPI {
  private storageKey = (caseId: string) => `lltrips_${caseId}`;

  async verifyAuth(credentials: AuthCredentials) {
    await new Promise(resolve => setTimeout(resolve, 300));
    if (!credentials.client_pin || credentials.client_pin.length !== 4) {
      throw new Error('PIN must be 4 digits');
    }
    return {
      authenticated: true,
      case_id: credentials.case_id,
      client_email: credentials.client_email,
    };
  }

  async createTrip(trip: TripFormData, credentials: AuthCredentials): Promise<Trip> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const miles = Math.round((parseFloat(trip.odometer_end) - parseFloat(trip.odometer_start)) * 10) / 10;
    if (miles <= 0) throw new Error('Odometer end must be greater than start');
    
    const trips = this.getTripsFromStorage(credentials.case_id);
    const newId = Math.max(0, ...trips.map(t => t.id)) + 1;
    const newTrip: Trip = {
      id: newId,
      case_id: credentials.case_id,
      client_email: credentials.client_email,
      trip_date: trip.trip_date,
      time_start: trip.time_start,
      time_end: trip.time_end,
      location_from: trip.location_from,
      location_to: trip.location_to,
      reason: trip.reason,
      odometer_start: parseFloat(trip.odometer_start),
      odometer_end: parseFloat(trip.odometer_end),
      miles,
      created_at: new Date().toISOString(),
    };
    const allTrips = [...trips, newTrip];
    this.saveTripsToStorage(credentials.case_id, allTrips);
    return newTrip;
  }

  async getTrips(credentials: AuthCredentials): Promise<Trip[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return this.getTripsFromStorage(credentials.case_id);
  }

  async deleteTrip(tripId: number, credentials: AuthCredentials): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const trips = this.getTripsFromStorage(credentials.case_id);
    const filtered = trips.filter(t => t.id !== tripId);
    this.saveTripsToStorage(credentials.case_id, filtered);
  }

  async exportTrips(credentials: AuthCredentials) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const trips = this.getTripsFromStorage(credentials.case_id);
    return {
      case_id: credentials.case_id,
      client_email: credentials.client_email,
      generated_at: new Date().toISOString(),
      trips: trips.map(t => ({
        date: t.trip_date,
        time_start: t.time_start,
        time_end: t.time_end,
        from: t.location_from,
        to: t.location_to,
        reason: t.reason,
        odometer_start: t.odometer_start,
        odometer_end: t.odometer_end,
        miles: t.miles,
      })),
    };
  }

  private getTripsFromStorage(caseId: string): Trip[] {
    const key = this.storageKey(caseId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  private saveTripsToStorage(caseId: string, trips: Trip[]): void {
    const key = this.storageKey(caseId);
    localStorage.setItem(key, JSON.stringify(trips));
  }
}

export const api = new TripLoggerAPI();
