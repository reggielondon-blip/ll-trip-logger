export interface Trip {
  id: number;
  case_id: string;
  client_email: string;
  trip_date: string;
  time_start: string;
  time_end: string;
  location_from: string;
  location_to: string;
  reason: string;
  odometer_start: number;
  odometer_end: number;
  miles: number;
  created_at: string;
}

export interface TripFormData {
  trip_date: string;
  time_start: string;
  time_end: string;
  location_from: string;
  location_to: string;
  reason: string;
  odometer_start: string;
  odometer_end: string;
}

export interface AuthCredentials {
  case_id: string;
  client_email: string;
  client_pin: string;
}

export interface AuthResponse {
  authenticated: boolean;
  case_id: string;
  client_email: string;
}

export interface ExportData {
  case_id: string;
  client_email: string;
  generated_at: string;
  trips: Array<{
    date: string;
    time_start: string;
    time_end: string;
    from: string;
    to: string;
    reason: string;
    odometer_start: number;
    odometer_end: number;
    miles: number;
  }>;
}
