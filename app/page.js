'use client';
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  ClipboardEdit,
  Calendar as CalIcon,
  CheckCircle2,
  Flame,
  Droplets,
  Leaf,
} from 'lucide-react';

// --- IMPORTS ---
import WorkoutModule from './src/components/WorkoutModule'; // Your previous 'Home' code
import WorkoutCalendar from './src/components/WorkoutCalendar';
import DailyLogger from './src/components/DailyLogger'; // The new code above
import { formatDateKey } from './src/utils/helpers'; // Reuse your helper

export default function AccountabilityApp() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'workout' | 'log'
  const [db, setDb] = useState({});

  // Date Key for Today
  const todayKey = formatDateKey(new Date());

  // Load DB
  useEffect(() => {
    // 1. Fetch from API
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/logs');
        if (res.ok) {
          const data = await res.json();
          setDb(data);
        }
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      }
    };
    fetchLogs();
  }, []);

  // Save Function (Persist to DB)
  const saveEntry = async (key, data) => {
    // Optimistic Update
    const newDb = {
      ...db,
      [key]: {
        ...(db[key] || {}),
        ...data,
      },
    };
    setDb(newDb);

    // Persist
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateKey: key, ...data }),
      });
    } catch (err) {
      console.error('Failed to save log:', err);
      alert('Failed to save to database. Please check your connection.');
    }
  };

  // Workout Completion Wrapper
  const handleWorkoutComplete = (workoutType, details) => {
    saveEntry(todayKey, {
      workout: { type: workoutType, details, completed: true },
    });
    alert('Workout Logged to Accountability Tracker!');
    setActiveTab('home');
  };

  // Daily Log Completion Wrapper
  const handleLogComplete = (logData) => {
    saveEntry(todayKey, { ...logData, logCompleted: true });
    alert('Daily Log Saved!');
    setActiveTab('home');
  };

  // --- TABS CONTENT ---

  const renderHome = () => {
    const today = db[todayKey] || {};

    return (
      <div className="space-y-6 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-3xl shadow-lg mb-6">
          <h1 className="text-2xl font-bold mb-1">Hey there Alex!</h1>
          <p className="text-blue-100 text-sm">Let's crush your goals today.</p>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Workout Card */}
          <div
            onClick={() => setActiveTab('workout')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${today.workout ? 'bg-green-500/20 border-green-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <Dumbbell
                className={`w-6 h-6 ${today.workout ? 'text-green-400' : 'text-white/50'}`}
              />
              {today.workout && (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              )}
            </div>
            <p className="font-bold text-lg">
              {today.workout ? 'Trained' : 'Workout'}
            </p>
            <p className="text-xs opacity-60">
              {today.workout ? today.workout.type : 'Tap to start'}
            </p>
          </div>

          {/* Daily Log Card */}
          <div
            onClick={() => setActiveTab('log')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${today.logCompleted ? 'bg-blue-500/20 border-blue-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
          >
            <div className="flex justify-between items-start mb-2">
              <ClipboardEdit
                className={`w-6 h-6 ${today.logCompleted ? 'text-blue-400' : 'text-white/50'}`}
              />
              {today.logCompleted && (
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <p className="font-bold text-lg">Daily Log</p>
            <p className="text-xs opacity-60">
              {today.logCompleted ? 'Completed' : 'Tap to log'}
            </p>
          </div>
        </div>

        {/* Quick Stats Summary (If logged) */}
        {today.logCompleted && (
          <div className="bg-black/20 rounded-2xl p-5 border border-white/5">
            <h3 className="font-bold text-white/70 mb-4 uppercase tracking-wider text-xs">
              Today's Nutrition
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div>
                <div className="w-10 h-10 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-1">
                  <Leaf className="w-5 h-5 text-green-400" />
                </div>
                <span className="text-xs font-bold">{today.plants}</span>
              </div>
              <div>
                <div className="w-10 h-10 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center mb-1">
                  <Flame className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="text-xs font-bold">{today.fasting}h</span>
              </div>
              <div>
                <div
                  className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-1 ${!today.upf ? 'bg-green-500/20' : 'bg-red-500/20'}`}
                >
                  {!today.upf ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-red-400" />
                  )}
                </div>
                <span className="text-xs font-bold">UPF</span>
              </div>
              <div>
                <div className="w-10 h-10 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-1">
                  <Droplets className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-xs font-bold">{today.drinks}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* MAIN CONTENT AREA */}
      <div className="max-w-md mx-auto min-h-screen relative">
        <div className="p-4 pt-6">
          {activeTab === 'home' && renderHome()}

          {activeTab === 'workout' && (
            // You need to slightly modify your WorkoutModule to accept an onFinish prop instead of saving to LS directly,
            // OR just let it save to LS and we assume sync happens on reload.
            // Better: Pass a "onComplete" handler.
            <WorkoutModule
              onExit={() => setActiveTab('home')}
              externalSave={handleWorkoutComplete}
            />
          )}

          {activeTab === 'log' && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setActiveTab('home')}
                  className="p-2 hover:bg-white/10 rounded-full"
                >
                  <ClipboardEdit className="w-6 h-6 text-white/50" />
                </button>
                <h2 className="text-xl font-bold">Daily Logger</h2>
              </div>
              <DailyLogger
                dateKey={todayKey}
                initialData={db[todayKey] || {}}
                onSave={handleLogComplete}
              />
            </div>
          )}
        </div>
        <div>
            <WorkoutCalendar history={db} />
        </div>

        {/* BOTTOM NAVIGATION (Only on Home) */}
        {activeTab === 'home' && (
          <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-white/10 p-4 pb-8 z-50">
            <div className="max-w-md mx-auto flex justify-around items-center">
              <button
                onClick={() => setActiveTab('home')}
                className="flex flex-col items-center gap-1 text-blue-400"
              >
                <LayoutDashboard className="w-6 h-6" />
                <span className="text-[10px] font-bold">Today</span>
              </button>
              <button
                onClick={() => setActiveTab('workout')}
                className="flex flex-col items-center gap-1 text-white/50 hover:text-white"
              >
                <Dumbbell className="w-6 h-6" />
                <span className="text-[10px] font-bold">Gym</span>
              </button>
              <button
                onClick={() => setActiveTab('log')}
                className="flex flex-col items-center gap-1 text-white/50 hover:text-white"
              >
                <ClipboardEdit className="w-6 h-6" />
                <span className="text-[10px] font-bold">Log</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
