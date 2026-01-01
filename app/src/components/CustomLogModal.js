import React, { useState } from 'react';
import { X, Save, Calendar } from 'lucide-react';

export default function CustomLogModal({ onClose, onSave }) {
  const [type, setType] = useState('Run');
  const [duration, setDuration] = useState('');

  // Default to today's date in YYYY-MM-DD format
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-sm relative z-10 animate-in fade-in zoom-in-95 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Log Activity</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="space-y-4">
          {/* DATE PICKER */}
          <div>
            <label className="text-sm text-white/60 block mb-1">Date</label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
              />
              <Calendar className="absolute right-3 top-3 w-5 h-5 text-white/30 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-sm text-white/60 block mb-1">
              Activity Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option>Run</option>
              <option>Swim</option>
              <option>Hike</option>
              <option>Cycling</option>
              <option>Yoga</option>
              <option>Gym (Other)</option>
              <option>Walk</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-white/60 block mb-1">
              Duration (Minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 30"
              className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button
            onClick={() => {
              if (!duration) return alert('Please enter a duration');
              if (!date) return alert('Please select a date');
              onSave({ type, duration, date }); // Pass date back
            }}
            className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2 mt-2 transition-transform active:scale-95"
          >
            <Save className="w-4 h-4" /> Save Log
          </button>
        </div>
      </div>
    </div>
  );
}
