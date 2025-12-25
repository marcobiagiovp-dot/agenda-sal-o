import React from 'react';
import { TimeSlot } from '../types';
import { Clock } from 'lucide-react';

interface TimeSlotGridProps {
  slots: TimeSlot[];
  selectedSlot: string | null;
  onSelectSlot: (time: string) => void;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ slots, selectedSlot, onSelectSlot }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {slots.map((slot) => (
        <button
          key={slot.time}
          disabled={!slot.available}
          onClick={() => onSelectSlot(slot.time)}
          className={`
            relative p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all duration-200
            ${!slot.available 
              ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
              : selectedSlot === slot.time
                ? 'bg-rose-600 border-rose-600 text-white shadow-md scale-105'
                : 'bg-white border-gray-200 text-gray-700 hover:border-rose-300 hover:shadow-sm hover:text-rose-600'
            }
          `}
        >
          <Clock className={`w-4 h-4 ${!slot.available ? 'text-gray-300' : ''}`} />
          <span className="text-sm font-semibold">{slot.time}</span>
          {!slot.available && (
            <span className="absolute -top-2 -right-2 bg-gray-200 text-gray-500 text-[10px] px-1.5 py-0.5 rounded-full border border-white">
              Ocupado
            </span>
          )}
        </button>
      ))}
    </div>
  );
};