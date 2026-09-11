'use client';

import { useState, useEffect } from 'react';
import { Appointment } from '@/types/appointment';
import { Plus, CalendarDays } from 'lucide-react';
import AppointmentList from '@/components/AppointmentList';
import AppointmentForm from '@/components/AppointmentForm';
import FilterBar from '@/components/FilterBar';

export default function Home() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  
  // Filters state
  const [dateFilter, setDateFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/appointments');
      if (res.ok) {
        const data = await res.json();
        
        // Sort by date and start time so it looks nice
        data.sort((a: Appointment, b: Appointment) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date);
          return a.startTime.localeCompare(b.startTime);
        });
        setAppointments(data);
      }
    } catch (err) {
      console.error(err);
      showMessage('error', 'Failed to load appointments.');
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleAddClick = () => {
    setEditingAppointment(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleSave = async (appointmentData: Partial<Appointment>) => {
    try {
      const isEditing = !!editingAppointment;
      const url = isEditing ? `/api/appointments/${editingAppointment.id}` : '/api/appointments';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage('error', data.error || 'Something went wrong.');
        return false;
      }

      showMessage('success', isEditing ? 'Updated successfully!' : 'Added successfully!');
      fetchAppointments();
      setIsModalOpen(false);
      return true;
    } catch (err) {
      console.log(err);
      showMessage('error', 'Network error. Please try again.');
      return false;
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = await res.json();
        showMessage('error', data.error || 'Failed to update status.');
        return;
      }

      showMessage('success', `Marked as ${status}.`);
      fetchAppointments();
    } catch (err) {
      showMessage('error', 'Network error.');
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (dateFilter && appt.date !== dateFilter) return false;
    if (statusFilter !== 'all' && appt.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-white text-slate-900 font-sans p-4 sm:p-8 relative overflow-hidden">
      
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-200/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6 bg-white/60 p-6 rounded-3xl shadow-sm border border-white backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <CalendarDays className="text-white" size={32} strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">
                Team Agenda
              </h1>
              <p className="text-slate-500 font-medium tracking-wide text-sm mt-1">Manage & sync your daily appointments</p>
            </div>
          </div>
          <button
            onClick={handleAddClick}
            className="group flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-xl shadow-slate-200 hover:shadow-blue-200 hover:-translate-y-0.5"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            New Appointment
          </button>
        </header>

        {/* Status Toast */}
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${message ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'}`}>
          {message && (
            <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md ${
              message.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
            }`}>
              <span className="font-medium tracking-wide">{message.text}</span>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FilterBar 
              dateFilter={dateFilter} 
              setDateFilter={setDateFilter} 
              statusFilter={statusFilter} 
              setStatusFilter={setStatusFilter} 
            />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl shadow-slate-100/50 border border-slate-100/80 p-2 sm:p-6 min-h-[500px]">
              <AppointmentList 
                appointments={filteredAppointments} 
                onEdit={handleEditClick}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <AppointmentForm
            initialData={editingAppointment}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}
