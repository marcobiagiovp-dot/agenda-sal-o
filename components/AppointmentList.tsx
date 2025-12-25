import React from 'react';
import { Appointment } from '../types';
import { Calendar, Clock, User, Phone, MapPin, Scissors, Trash2 } from 'lucide-react';

interface AppointmentListProps {
  appointments: Appointment[];
  onDelete: (id: string) => void;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, onDelete }) => {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Nenhum agendamento encontrado.</p>
      </div>
    );
  }

  // Sort appointments by date and time
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-4">
      {sortedAppointments.map((apt) => (
        <div key={apt.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4 group">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
               <div className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                 <Calendar className="w-3 h-3" />
                 {new Date(apt.date).toLocaleDateString('pt-BR')}
               </div>
               <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                 <Clock className="w-3 h-3" />
                 {apt.time}
               </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-gray-50 p-2 rounded-full hidden sm:block">
                 <User className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg leading-tight">{apt.client.name}</h3>
                <div className="text-sm text-gray-500 mt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="flex items-center gap-1"><Scissors className="w-3 h-3" /> {apt.service}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {apt.client.phone}</span>
                </div>
                <div className="text-sm text-gray-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {apt.client.address}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onDelete(apt.id)}
            className="self-end md:self-center p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            title="Cancelar Agendamento"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      ))}
    </div>
  );
};