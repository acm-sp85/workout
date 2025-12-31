'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Dumbbell, Clock, X } from 'lucide-react';

// Data & Helpers
import { WORKOUT_SCHEDULE } from './data/schedule';
import { formatDateKey, createWorkoutQueue, formatTime } from './utils/helpers';

// Components
import Dashboard from './components/Dashboard';
import Runner from './components/Runner';
import QueueDrawer from './components/QueueDrawer';

export default function WorkoutApp() {
  // State
  const [workoutHistory, setWorkoutHistory] = useState({});
  const [activeDay, setActiveDay] = useState('dayA');
  const [mode, setMode] = useState('dashboard');
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showQueueDrawer, setShowQueueDrawer] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Computed
  const previewQueue = useMemo(
    () => createWorkoutQueue(WORKOUT_SCHEDULE[activeDay]),
    [activeDay]
  );

  // Effects
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

  // Actions
  const handlePreview = () => {
    setIsPreviewMode(true);
    setShowQueueDrawer(true);
  };

  const startWorkout = () => {
    const dayData = WORKOUT_SCHEDULE[activeDay];
    const newQueue = createWorkoutQueue(dayData);
    setQueue(newQueue);
    setCurrentIndex(0);
    setSessionTimer(0);
    setIsTimerRunning(true);
    setShowQueueDrawer(false);
    setIsPreviewMode(false);
    setMode('runner');
  };

  const finishWorkout = () => {
    setIsTimerRunning(false);
    const dateKey = formatDateKey(new Date());
    const newHistory = { ...workoutHistory, [dateKey]: activeDay };
    setWorkoutHistory(newHistory);
    localStorage.setItem('myWorkoutDB', JSON.stringify(newHistory));
    setMode('dashboard');
    alert('Workout Complete! Saved to history.');
  };

  const resetHistory = () => {
    if (window.confirm('Delete all history?')) {
      localStorage.removeItem('myWorkoutDB');
      setWorkoutHistory({});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white font-sans relative">
      {/* DRAWER */}
      {showQueueDrawer && (
        <QueueDrawer
          queue={isPreviewMode ? previewQueue : queue}
          currentIndex={isPreviewMode ? -1 : currentIndex}
          onClose={() => setShowQueueDrawer(false)}
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
                  {WORKOUT_SCHEDULE[activeDay].name}
                </p>
              </div>
            ) : (
              <h1 className="text-lg font-bold">Weekly Plan</h1>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-sm font-mono text-blue-300">
              <Clock className="w-4 h-4" />
              {formatTime(sessionTimer)}
            </div>
            {mode === 'runner' && (
              <button
                onClick={() => setMode('dashboard')}
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
            queueLength={previewQueue.length}
            onResetHistory={resetHistory}
          />
        ) : (
          <div className="h-[calc(100vh-140px)] flex flex-col justify-center relative">
            <Runner
              exercise={queue[currentIndex]}
              progress={((currentIndex + 1) / queue.length) * 100}
              isLast={currentIndex === queue.length - 1}
              onNext={() =>
                currentIndex < queue.length - 1
                  ? setCurrentIndex((c) => c + 1)
                  : finishWorkout()
              }
              onPrev={() => currentIndex > 0 && setCurrentIndex((c) => c - 1)}
              onPeek={() => {
                setIsPreviewMode(false);
                setShowQueueDrawer(true);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
