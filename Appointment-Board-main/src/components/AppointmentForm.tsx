'use client';

import { useState, useEffect } from 'react';
import { Appointment } from '@/types/appointment';

interface AppointmentFormProps {
  initialData: Appointment | null;
  onClose: () => void;
  onSave: (data: Partial<Appointment>) => Promise<boolean>;
}

export default function AppointmentForm({ initialData, onClose, onSave }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        date: initialData.date,
        startTime: initialData.startTime,
        endTime: initialData.endTime,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.endTime <= formData.startTime) {
      setError('End time must be after start time.');
      return;
    }

    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl shadow-slate-900/20 overflow-hidden animate-in">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              {initialData ? 'Edit Appointment' : 'New Appointment'}
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">Fill in the details below</p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-2">
              <span className="text-lg leading-none">&times;</span>
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-1.5">
                Title <span className="text-blue-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium placeholder-slate-400"
                placeholder="E.g., Design Review Sync"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-1.5">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium placeholder-slate-400 resize-none"
                placeholder="Optional details or agenda..."
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-bold text-slate-700 mb-1.5">
                Date <span className="text-blue-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label htmlFor="startTime" className="block text-sm font-bold text-slate-700 mb-1.5">
                  Start Time <span className="text-blue-500">*</span>
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-bold text-slate-700 mb-1.5">
                  End Time <span className="text-blue-500">*</span>
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-800 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 text-sm font-bold bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 hover:-translate-y-0.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? 'Saving...' : 'Save Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
