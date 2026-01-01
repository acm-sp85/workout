'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Dumbbell, Clock, X, Settings, Plus } from 'lucide-react'; // Added Plus icon

// Data & Helpers
import { WORKOUT_SCHEDULE } from '../app/src/data/schedule.js';
import {
  formatDateKey,
  createWorkoutQueue,
  formatTime,
} from '../app/src/utils/helpers.js';

// Components
import Dashboard from '../app/src/components/Dashboard';
import Runner from '../app/src/components/Runner';
import QueueDrawer from '../app/src/components/QueueDrawer';
import SettingsModal from '../app/src/components/SettingsModal';
import CustomLogModal from '../app/src/components/CustomLogModal'; // NEW: Custom Log Modal

export default function Home() {
  // ... (Existing State) ...
  const [workoutHistory, setWorkoutHistory] = useState({});
  const [activeDay, setActiveDay] = useState('dayA');
  const [mode, setMode] = useState('dashboard');
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showQueueDrawer, setShowQueueDrawer] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({ getReadyDuration: 5 });

  // NEW: Custom Log State
  const [showCustomLog, setShowCustomLog] = useState(false);

  // ... (Computed & Effects unchanged) ...
  const previewQueue = useMemo(
    () => createWorkoutQueue(WORKOUT_SCHEDULE[activeDay]),
    [activeDay]
  );

  useEffect(() => {
    const saved = localStorage.getItem('myWorkoutDB');
    if (saved) setWorkoutHistory(JSON.parse(saved));
    const today = new Date().getDay();
    const map = { 1: 'dayA', 2: 'dayB', 4: 'dayC', 5: 'dayD' };
    if (map[today]) setActiveDay(map[today]);
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerRunning && mode === 'runner') {
      interval = setInterval(() => setSessionTimer((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, mode]);

  // --- HANDLERS (UPDATED) ---

  // 1. Updated to save Object structure for Guided Workouts
  const handleFinish = () => {
    setIsTimerRunning(false);
    const dateKey = formatDateKey(new Date());

    // NEW: Saving object structure
    const newEntry = {
      type: WORKOUT_SCHEDULE[activeDay].name, // e.g., "Lower Body + Core"
      id: activeDay,
      duration: formatTime(sessionTimer),
      completed: true,
    };

    const newHistory = { ...workoutHistory, [dateKey]: newEntry };
    setWorkoutHistory(newHistory);
    localStorage.setItem('myWorkoutDB', JSON.stringify(newHistory));

    setMode('dashboard');
    alert('Workout Saved!');
  };

  // 2. NEW: Handler for Custom Logs
  const saveCustomLog = (data) => {
    // data.date comes in as "YYYY-MM-DD", which matches our key format exactly.
    const dateKey = data.date;

    const newEntry = {
      type: data.type,
      duration: `${data.duration} min`,
      isCustom: true,
      timestamp: new Date().toISOString(), // Optional: keeps track of when you actually logged it
    };

    // Use dateKey from input
    const newHistory = { ...workoutHistory, [dateKey]: newEntry };

    setWorkoutHistory(newHistory);
    localStorage.setItem('myWorkoutDB', JSON.stringify(newHistory));

    setShowCustomLog(false);
    alert(`Activity logged for ${dateKey}!`);
  };

  // ... (Other handlers unchanged) ...
  const startWorkout = () => {
    const dayData = WORKOUT_SCHEDULE[activeDay];
    const newQueue = createWorkoutQueue(dayData);
    if (!newQueue || newQueue.length === 0) return alert('Error loading data');
    setQueue(newQueue);
    setCurrentIndex(0);
    setSessionTimer(0);
    setIsTimerRunning(true);
    setShowQueueDrawer(false);
    setIsPreviewMode(false);
    setMode('runner');
  };
  const handleNextSlide = () =>
    currentIndex < queue.length - 1
      ? setCurrentIndex((c) => c + 1)
      : handleFinish();
  const handlePrevSlide = () =>
    currentIndex > 0 && setCurrentIndex((c) => c - 1);
  const handlePreview = () => {
    setIsPreviewMode(true);
    setShowQueueDrawer(true);
  };
  const resetHistory = () => {
    if (window.confirm('Delete history?')) {
      localStorage.removeItem('myWorkoutDB');
      setWorkoutHistory({});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white font-sans relative">
      {/* MODALS */}
      {showQueueDrawer && (
        <QueueDrawer
          queue={isPreviewMode ? previewQueue : queue}
          currentIndex={isPreviewMode ? -1 : currentIndex}
          onClose={() => setShowQueueDrawer(false)}
        />
      )}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdate={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* NEW: Custom Log Modal */}
      {showCustomLog && (
        <CustomLogModal
          onClose={() => setShowCustomLog(false)}
          onSave={saveCustomLog}
        />
      )}

      {/* HEADER */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              onClick={() => setMode('dashboard')}
              className="cursor-pointer"
            >
              <Dumbbell className="w-6 h-6 text-blue-400" />
            </div>
            {mode === 'runner' ? (
              <div>
                <h1 className="text-sm font-bold text-white/80">
                  Now Training
                </h1>
                <p className="text-xs text-blue-300">
                  {WORKOUT_SCHEDULE[activeDay]?.name}
                </p>
              </div>
            ) : (
              <h1 className="text-lg font-bold">Weekly Plan</h1>
            )}
          </div>

          <div className="flex items-center gap-3">
            {mode === 'dashboard' && (
              <>
                {/* NEW: Plus Button for logging custom workouts */}
                <button
                  onClick={() => setShowCustomLog(true)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                  title="Log Activity"
                >
                  <Plus className="w-5 h-5 text-green-400" />
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Settings className="w-5 h-5 text-white/70" />
                </button>
              </>
            )}

            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-sm font-mono text-blue-300">
              <Clock className="w-4 h-4" />
              {formatTime(sessionTimer)}
            </div>
            {mode === 'runner' && (
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setMode('dashboard');
                }}
                className="p-1 hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5 text-white/50" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {mode === 'dashboard' ? (
          <Dashboard
            schedule={WORKOUT_SCHEDULE}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            onStart={startWorkout}
            onPreview={handlePreview}
            history={workoutHistory}
            queueLength={previewQueue ? previewQueue.length : 0}
            onResetHistory={resetHistory}
          />
        ) : (
          <div className="h-[calc(100vh-140px)] flex flex-col justify-center relative">
            <Runner
              exercise={queue[currentIndex]}
              progress={((currentIndex + 1) / queue.length) * 100}
              isLast={currentIndex === queue.length - 1}
              onNext={handleNextSlide}
              onPrev={handlePrevSlide}
              onPeek={() => {
                setIsPreviewMode(false);
                setShowQueueDrawer(true);
              }}
              settings={settings}
            />
          </div>
        )}
      </div>
    </div>
  );
}
