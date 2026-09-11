'use client';

import { Filter, Calendar, ListFilter } from 'lucide-react';

interface FilterBarProps {
  dateFilter: string;
  setDateFilter: (date: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export default function FilterBar({ dateFilter, setDateFilter, statusFilter, setStatusFilter }: FilterBarProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-lg shadow-slate-100/50 border border-slate-100 flex flex-col gap-6 sticky top-8">
      <div className="flex items-center gap-2 text-slate-800 border-b border-slate-100 pb-4">
        <Filter size={20} className="text-blue-500" />
        <h2 className="font-bold text-lg">Filters</h2>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="date-filter" className="text-xs font-bold tracking-wider uppercase text-slate-500 flex items-center gap-2">
          <Calendar size={14} /> Date
        </label>
        <input
          type="date"
          id="date-filter"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 font-medium"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="status-filter" className="text-xs font-bold tracking-wider uppercase text-slate-500 flex items-center gap-2">
          <ListFilter size={14} /> Status
        </label>
        <div className="relative">
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full appearance-none px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700 font-medium"
          >
            <option value="all">All Appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => {
          setDateFilter('');
          setStatusFilter('all');
        }}
        className="mt-4 px-4 py-3 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
      >
        Clear Filters
      </button>
    </div>
  );
}
