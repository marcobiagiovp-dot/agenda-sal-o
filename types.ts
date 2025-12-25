export interface Client {
  name: string;
  phone: string;
  address: string;
}

export interface Appointment {
  id: string;
  date: string; // ISO Date string YYYY-MM-DD
  time: string; // HH:mm
  client: Client;
  service?: string;
  createdAt: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export type ViewMode = 'booking' | 'admin';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}