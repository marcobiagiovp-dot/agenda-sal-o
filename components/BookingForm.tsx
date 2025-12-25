import React, { useState } from 'react';
import { Client } from '../types';
import { SERVICES } from '../constants';
import { User, Phone, MapPin, Scissors, CheckCircle, Calendar } from 'lucide-react';

interface BookingFormProps {
  selectedDate: string;
  selectedSlot: string;
  onConfirm: (client: Client, service: string) => void;
  onCancel: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({ selectedDate, selectedSlot, onConfirm, onCancel }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [service, setService] = useState(SERVICES[0]);
  const [errors, setErrors] = useState<Partial<Client>>({});

  const validate = () => {
    const newErrors: Partial<Client> = {};
    if (!name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    if (!address.trim()) newErrors.address = 'Endereço é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onConfirm({ name, phone, address }, service);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
        <div className="bg-rose-50 p-2 rounded-lg">
          <Calendar className="w-5 h-5 text-rose-600" />
        </div>
        <div>
          <h2 className="text-lg font-serif font-bold text-gray-900">Finalizar Agendamento</h2>
          <p className="text-sm text-gray-500 capitalize">
            {new Date(selectedDate).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} às {selectedSlot}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service Selection */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Scissors className="w-4 h-4 text-rose-500" /> Serviço Desejado
          </label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-400 transition-all text-sm"
          >
            {SERVICES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <User className="w-4 h-4 text-rose-500" /> Nome Completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all text-sm ${errors.name ? 'border-red-300' : 'border-gray-200 focus:border-rose-400'}`}
            placeholder="Ex: Ana Silva"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Phone className="w-4 h-4 text-rose-500" /> Telefone / WhatsApp
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full p-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all text-sm ${errors.phone ? 'border-red-300' : 'border-gray-200 focus:border-rose-400'}`}
            placeholder="Ex: (11) 99999-9999"
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
        </div>

        {/* Address */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500" /> Endereço
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className={`w-full p-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-100 transition-all text-sm ${errors.address ? 'border-red-300' : 'border-gray-200 focus:border-rose-400'}`}
            placeholder="Rua das Flores, 123"
          />
          {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
        </div>

        <div className="pt-4 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-4 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700 shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Confirmar
          </button>
        </div>
      </form>
    </div>
  );
};