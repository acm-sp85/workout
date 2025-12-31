import React from 'react';
import { Calendar } from 'lucide-react';
import {
  formatDateKey,
  getDaysInMonth,
  getFirstDayOfMonth,
} from '../utils/helpers';

export default function WorkoutCalendar({ history }) {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const days = [];

  for (let i = 0; i < firstDay; i++)
    days.push(<div key={`empty-${i}`} className="h-8" />);

  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = formatDateKey(new Date(currentYear, currentMonth, d));
    const isCompleted = history[dateKey];
    const isToday = d === today.getDate();
    days.push(
      <div
        key={d}
        className="flex flex-col items-center justify-center h-8 relative"
      >
        <span
          className={`text-xs z-10 ${isCompleted ? 'text-white font-bold' : 'text-white/60'} ${isToday ? 'text-blue-300' : ''}`}
        >
          {d}
        </span>
        {isCompleted && (
          <div className="absolute inset-0 bg-green-500 rounded-full opacity-40 mx-1" />
        )}
        {isToday && !isCompleted && (
          <div className="absolute inset-0 border border-blue-500/50 rounded-full mx-1" />
        )}
      </div>
    );
  }

  return (
    <div className="bg-black/20 rounded-xl p-4 border border-white/10 h-fit">
      <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-blue-400" />
        {today.toLocaleString('default', { month: 'long' })} Progress
      </h3>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {/* FIX: key={i} instead of key={d} */}
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
