import React, { useState, useEffect, useMemo } from 'react';
import { format, addDays, startOfToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Scissors, LayoutDashboard, Sparkles, Check } from 'lucide-react';

import { Appointment, Client, TimeSlot, ViewMode } from './types';
import { SALON_OPENING_HOUR, SALON_CLOSING_HOUR, SLOT_DURATION_MINUTES, MOCK_APPOINTMENTS_KEY } from './constants';
import { TimeSlotGrid } from './components/TimeSlotGrid';
import { BookingForm } from './components/BookingForm';
import { AppointmentList } from './components/AppointmentList';
import { AIStyleConsultant } from './components/AIStyleConsultant';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('booking');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(format(startOfToday(), 'yyyy-MM-dd'));
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load appointments from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem(MOCK_APPOINTMENTS_KEY);
    if (stored) {
      setAppointments(JSON.parse(stored));
    }
  }, []);

  // Save appointments to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(MOCK_APPOINTMENTS_KEY, JSON.stringify(appointments));
  }, [appointments]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Generate date options for the next 7 days
  const dateOptions = useMemo(() => {
    const options = [];
    const today = startOfToday();
    for (let i = 0; i < 7; i++) {
      options.push(addDays(today, i));
    }
    return options;
  }, []);

  // Generate slots for selected date
  const slots: TimeSlot[] = useMemo(() => {
    const generatedSlots: TimeSlot[] = [];
    for (let hour = SALON_OPENING_HOUR; hour < SALON_CLOSING_HOUR; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      
      // Check if slot is occupied
      const isOccupied = appointments.some(
        apt => apt.date === selectedDate && apt.time === timeString
      );

      generatedSlots.push({
        time: timeString,
        available: !isOccupied
      });
    }
    return generatedSlots;
  }, [selectedDate, appointments]);

  const handleSlotSelect = (time: string) => {
    setSelectedSlot(time);
  };

  const handleBookingConfirm = (client: Client, service: string) => {
    if (!selectedSlot) return;

    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      date: selectedDate,
      time: selectedSlot,
      client,
      service,
      createdAt: Date.now()
    };

    setAppointments([...appointments, newAppointment]);
    setSuccessMessage('Agendamento realizado com sucesso!');
    setSelectedSlot(null); // Reset selection
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('Tem certeza que deseja cancelar este agendamento?')) {
      setAppointments(appointments.filter(a => a.id !== id));
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-10 font-sans text-gray-800">
      
      {/* Navigation */}
      <nav className="bg-white sticky top-0 z-30 border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-rose-600 p-2 rounded-lg text-white">
               <Scissors className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-serif font-bold tracking-tight text-gray-900">Salon<span className="text-rose-600">Lux</span></h1>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('booking')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                viewMode === 'booking' ? 'bg-rose-50 text-rose-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Agendar
            </button>
            <button
              onClick={() => setViewMode('admin')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'admin' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Success Toast */}
        {successMessage && (
          <div className="fixed top-20 right-4 md:right-8 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-white/20 p-1 rounded-full"><Check className="w-5 h-5" /></div>
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {viewMode === 'booking' ? (
          <div className="grid md:grid-cols-12 gap-8">
            {/* Left Column: Date & Time Selection */}
            <div className="md:col-span-7 space-y-8">
              
              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-3xl font-serif font-bold text-gray-900">Agende sua visita</h2>
                <p className="text-gray-500">Selecione o melhor dia e horário para seu atendimento exclusivo.</p>
              </div>

              {/* Date Picker (Horizontal Scroll) */}
              <div className="space-y-4">
                 <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                   <CalendarIcon className="w-4 h-4 text-rose-500" /> Selecione o Dia
                 </h3>
                 <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                  {dateOptions.map((date) => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const isSelected = selectedDate === dateStr;
                    return (
                      <button
                        key={dateStr}
                        onClick={() => { setSelectedDate(dateStr); setSelectedSlot(null); }}
                        className={`
                          flex-shrink-0 w-24 p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-1
                          ${isSelected 
                            ? 'bg-gray-900 border-gray-900 text-white shadow-lg scale-105' 
                            : 'bg-white border-gray-200 text-gray-600 hover:border-rose-300 hover:shadow-md'
                          }
                        `}
                      >
                        <span className="text-xs font-medium uppercase opacity-80">
                          {format(date, 'EEE', { locale: ptBR })}
                        </span>
                        <span className="text-2xl font-bold font-serif">
                          {format(date, 'dd')}
                        </span>
                      </button>
                    );
                  })}
                 </div>
              </div>

              {/* Time Slot Grid */}
              <div className="space-y-4 animate-in fade-in duration-500">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div> Horários Disponíveis
                 </h3>
                <TimeSlotGrid 
                  slots={slots} 
                  selectedSlot={selectedSlot} 
                  onSelectSlot={handleSlotSelect} 
                />
              </div>

              {/* Legend */}
              <div className="flex gap-6 text-xs text-gray-500 pt-2">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-white border border-gray-200"></div> Disponível</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-rose-600"></div> Selecionado</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-gray-100 border border-gray-200"></div> Ocupado</div>
              </div>
            </div>

            {/* Right Column: Booking Form */}
            <div className="md:col-span-5 relative">
              <div className="sticky top-24">
                {selectedSlot ? (
                  <BookingForm 
                    selectedDate={selectedDate}
                    selectedSlot={selectedSlot}
                    onConfirm={handleBookingConfirm}
                    onCancel={() => setSelectedSlot(null)}
                  />
                ) : (
                  <div className="bg-rose-50 rounded-2xl p-8 text-center border border-rose-100 h-full flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                      <Sparkles className="w-8 h-8 text-rose-400" />
                    </div>
                    <h3 className="text-lg font-bold text-rose-900 mb-2">Selecione um horário</h3>
                    <p className="text-rose-700/80 text-sm max-w-[200px]">
                      Escolha um horário disponível ao lado para prosseguir com seu cadastro.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Admin View */
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between">
               <div>
                <h2 className="text-2xl font-serif font-bold text-gray-900">Gerenciamento</h2>
                <p className="text-gray-500">Visão geral de todos os agendamentos cadastrados.</p>
               </div>
               <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm font-medium">
                 Total: {appointments.length}
               </div>
             </div>
             
             <AppointmentList 
               appointments={appointments} 
               onDelete={handleDeleteAppointment}
             />
          </div>
        )}
      </main>
      
      {/* AI Assistant */}
      <AIStyleConsultant />
    </div>
  );
};

export default App;