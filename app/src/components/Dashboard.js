import React from 'react';
import { Check, Play, Eye, TrendingUp, RotateCcw } from 'lucide-react';
import WorkoutCalendar from './WorkoutCalendar';

export default function Dashboard({
  schedule,
  activeDay,
  setActiveDay,
  onStart,
  onPreview,
  history,
  queueLength,
  onResetHistory,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Col: Selector & Info */}
      <div className="md:col-span-2 space-y-6">
        <div>
          <h2 className="text-xs font-bold text-white/50 mb-3 tracking-widest uppercase">
            Select Workout
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.entries(schedule).map(([key, day]) => (
              <button
                key={key}
                onClick={() => setActiveDay(key)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  activeDay === key
                    ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/50'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold opacity-80 uppercase">
                    {day.day}
                  </span>
                  {key === activeDay && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
                <h3 className="font-bold text-lg">{day.name}</h3>
                <p className="text-xs opacity-70 mt-1 line-clamp-1">
                  {day.focus}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to train?</h3>
          <p className="text-white/60 mb-6 text-sm">
            {queueLength} exercises queued up.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onPreview}
              className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/10 transition-all flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Preview
            </button>
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-12 py-4 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-full shadow-xl shadow-blue-500/20 transform hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              START WORKOUT
            </button>
          </div>
        </div>

        <div className="bg-purple-900/20 border border-purple-500/20 rounded-xl p-4 flex gap-4 items-start">
          <div className="p-2 bg-purple-500/20 rounded-lg shrink-0">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h4 className="font-bold text-purple-200 text-sm">
              Progression Tip
            </h4>
            <p className="text-xs text-purple-100/70 mt-1 leading-relaxed">
              Every 2–3 weeks, increase weight, add a round, or reduce rest
              time.
            </p>
          </div>
        </div>
      </div>

      {/* Right Col: Stats */}
      <div className="space-y-6">
        <WorkoutCalendar history={history} />
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
          <p className="text-3xl font-bold">{Object.keys(history).length}</p>
          <p className="text-xs text-white/50 uppercase">Total Completed</p>
          <button
            onClick={onResetHistory}
            className="mt-4 text-[10px] text-red-400 hover:text-red-300 flex items-center justify-center gap-1 mx-auto"
          >
            <RotateCcw className="w-3 h-3" /> Reset Data
          </button>
        </div>
      </div>
    </div>
  );
}
