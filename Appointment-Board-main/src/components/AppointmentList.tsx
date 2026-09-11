'use client';

import { Appointment } from '@/types/appointment';
import { format, parseISO } from 'date-fns';
import { Edit2, CheckCircle, XCircle, Clock, CalendarX2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AppointmentListProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onStatusChange: (id: string, status: string) => void;
}

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function AppointmentList({ appointments, onEdit, onStatusChange }: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
        <div className="bg-slate-50 p-6 rounded-full mb-6">
          <CalendarX2 size={48} className="text-slate-300" strokeWidth={1.5} />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">No appointments yet</h3>
        <p className="text-slate-500 max-w-sm">
          It looks like your schedule is empty. Adjust your filters or click "New Appointment" to get started.
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {appointments.map((appt, index) => (
        <li 
          key={appt.id} 
          className={cn(
            "group relative bg-white p-6 rounded-2xl border border-slate-100 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4",
            appt.status === 'cancelled' && "opacity-60 bg-slate-50/50 hover:opacity-100",
            appt.status === 'completed' && "bg-slate-50 border-transparent"
          )}
          style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
        >
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <h3 className={cn(
                  "text-xl font-bold text-slate-800 transition-colors",
                  appt.status === 'cancelled' && "line-through text-slate-400"
                )}>
                  {appt.title}
                </h3>
                
                {/* Modern Badges */}
                <span className={cn(
                  "px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5",
                  appt.status === 'scheduled' && "bg-blue-50 text-blue-600 border border-blue-100",
                  appt.status === 'completed' && "bg-emerald-50 text-emerald-600 border border-emerald-100",
                  appt.status === 'cancelled' && "bg-slate-100 text-slate-500"
                )}>
                  {appt.status === 'scheduled' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                  {appt.status}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className={appt.status === 'scheduled' ? 'text-blue-400' : ''} />
                  <span>{format(parseISO(appt.date), 'MMM d, yyyy')}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                <span>{appt.startTime} — {appt.endTime}</span>
              </div>
              
              {appt.description && (
                <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">{appt.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
              {appt.status === 'scheduled' && (
                <>
                  <button 
                    onClick={() => onStatusChange(appt.id, 'completed')}
                    className="p-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-500 hover:text-white rounded-xl transition-all duration-300 shadow-sm"
                    title="Mark as Completed"
                  >
                    <CheckCircle size={20} strokeWidth={2} />
                  </button>
                  <button 
                    onClick={() => onEdit(appt)}
                    className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-500 hover:text-white rounded-xl transition-all duration-300 shadow-sm"
                    title="Edit Appointment"
                  >
                    <Edit2 size={20} strokeWidth={2} />
                  </button>
                  <button 
                    onClick={() => onStatusChange(appt.id, 'cancelled')}
                    className="p-2.5 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all duration-300 shadow-sm"
                    title="Cancel Appointment"
                  >
                    <XCircle size={20} strokeWidth={2} />
                  </button>
                </>
              )}
              {appt.status === 'completed' && (
                <button 
                  onClick={() => onStatusChange(appt.id, 'scheduled')}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 hover:border-blue-300 hover:text-blue-600 rounded-xl shadow-sm transition-all"
                >
                  Re-schedule
                </button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
