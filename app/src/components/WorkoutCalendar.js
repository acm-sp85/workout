import React, { useState } from 'react'; // Add useState
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'; // Add Chevrons
import {
  formatDateKey,
  getDaysInMonth,
  getFirstDayOfMonth,
} from '../utils/helpers';

export default function WorkoutCalendar({ history }) {
  // State for the calendar's view
  const [viewDate, setViewDate] = useState(new Date());

  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const days = [];

  // Navigation Handlers
  const prevMonth = () =>
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  const nextMonth = () =>
    setViewDate(new Date(currentYear, currentMonth + 1, 1));

  // Empty slots
  for (let i = 0; i < firstDay; i++)
    days.push(<div key={`empty-${i}`} className="h-8" />);

  // Real Days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = formatDateKey(new Date(currentYear, currentMonth, d));
    // Ensure history handles both string IDs ('dayA') and custom objects
    const entry = history[dateKey];
    const isCompleted = !!entry;

    // Check if it's today (relative to real time, not view time)
    const isToday =
      new Date().toDateString() ===
      new Date(currentYear, currentMonth, d).toDateString();

    days.push(
      <div
        key={d}
        className="flex flex-col items-center justify-center h-8 relative group cursor-default"
      >
        <span
          className={`text-xs z-10 ${isCompleted ? 'text-white font-bold' : 'text-white/60'} ${isToday ? 'text-blue-300' : ''}`}
        >
          {d}
        </span>

        {isCompleted && (
          <div className="absolute inset-0 bg-green-500 rounded-full opacity-40 mx-1" />
        )}

        {/* Tooltip for custom workouts */}
        {isCompleted && typeof entry === 'object' && (
          <div className="hidden group-hover:block absolute bottom-full mb-2 bg-black text-xs px-2 py-1 rounded whitespace-nowrap z-20 border border-white/20">
            {entry.type} - {entry.duration}
          </div>
        )}

        {isToday && !isCompleted && (
          <div className="absolute inset-0 border border-blue-500/50 rounded-full mx-1" />
        )}
      </div>
    );
  }

  return (
    <div className="bg-black/20 rounded-xl p-4 border border-white/10 h-fit">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1 hover:bg-white/10 rounded-full"
        >
          <ChevronLeft className="w-4 h-4 text-white/70" />
        </button>
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" />
          {viewDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-white/10 rounded-full"
        >
          <ChevronRight className="w-4 h-4 text-white/70" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i} className="text-[10px] text-white/40">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-2">{days}</div>
    </div>
  );
}
