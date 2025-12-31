'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Dumbbell, Clock, X, Settings } from 'lucide-react';

// 1. Import Data & Logic
import { WORKOUT_SCHEDULE } from './src/data/schedule'; // Adjust path based on where you put the files
import {
  formatDateKey,
  createWorkoutQueue,
  formatTime,
} from './src/utils/helpers';
import SettingsModal from './src/components/SettingsModal';
import Dashboard from './src/components/Dashboard';
import Runner from './src/components/Runner';
import QueueDrawer from './src/components/QueueDrawer';
export default function Home() {
  // --- STATE MANAGEMENT ---

  // Persistence & Selection
  const [workoutHistory, setWorkoutHistory] = useState({});
  const [activeDay, setActiveDay] = useState('dayA');
  const [mode, setMode] = useState('dashboard'); // 'dashboard' | 'runner'

  // Runner Logic
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // UI States
  const [showQueueDrawer, setShowQueueDrawer] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    getReadyDuration: 5, // Default 5 seconds
  });

  // --- COMPUTED VALUES ---
  // Generate preview queue for dashboard display
  const previewQueue = useMemo(
    () => createWorkoutQueue(WORKOUT_SCHEDULE[activeDay]),
    [activeDay]
  );

  // --- EFFECTS ---

  // 1. Load Data on Mount
  useEffect(() => {
    const saved = localStorage.getItem('myWorkoutDB');
    if (saved) setWorkoutHistory(JSON.parse(saved));

    // Auto-select today's workout
    const today = new Date().getDay();
    // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    const map = { 1: 'dayA', 2: 'dayB', 4: 'dayC', 5: 'dayD' };
    if (map[today]) setActiveDay(map[today]);
  }, []);

  // 2. Session Timer Tick
  useEffect(() => {
    let interval;
    if (isTimerRunning && mode === 'runner') {
      interval = setInterval(() => setSessionTimer((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, mode]);

  // --- HANDLERS ---

  const handlePreview = () => {
    setIsPreviewMode(true);
    setShowQueueDrawer(true);
  };

  const startWorkout = () => {
    const dayData = WORKOUT_SCHEDULE[activeDay];
    const newQueue = createWorkoutQueue(dayData);

    if (!newQueue || newQueue.length === 0) {
      alert('Error loading workout data. Please check data files.');
      return;
    }

    setQueue(newQueue);
    setCurrentIndex(0);
    setSessionTimer(0);
    setIsTimerRunning(true);
    setShowQueueDrawer(false);
    setIsPreviewMode(false);
    setMode('runner');
  };

  const handleFinish = () => {
    setIsTimerRunning(false);
    const dateKey = formatDateKey(new Date());
    const newHistory = { ...workoutHistory, [dateKey]: activeDay };

    setWorkoutHistory(newHistory);
    localStorage.setItem('myWorkoutDB', JSON.stringify(newHistory));
    setMode('dashboard');
    alert('Great job! Workout saved to history.');
  };

  const handleNextSlide = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((c) => c + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevSlide = () => {
    if (currentIndex > 0) setCurrentIndex((c) => c - 1);
  };

  const resetHistory = () => {
    if (
      window.confirm('Are you sure you want to delete all workout history?')
    ) {
      localStorage.removeItem('myWorkoutDB');
      setWorkoutHistory({});
    }
  };

  // --- RENDER ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white font-sans relative">
      {/* 1. MODALS & DRAWERS */}

      {/* Queue Drawer (Used for both Preview and Active Peek) */}
      {showQueueDrawer && (
        <QueueDrawer
          queue={isPreviewMode ? previewQueue : queue}
          currentIndex={isPreviewMode ? -1 : currentIndex}
          onClose={() => setShowQueueDrawer(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onUpdate={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* 2. STICKY HEADER */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Title Area */}
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
                  {WORKOUT_SCHEDULE[activeDay]?.name || 'Workout'}
                </p>
              </div>
            ) : (
              <h1 className="text-lg font-bold">Weekly Plan</h1>
            )}
          </div>

          {/* Controls Area */}
          <div className="flex items-center gap-3">
            {/* Settings Icon (Dashboard Only) */}
            {mode === 'dashboard' && (
              <button
                onClick={() => setShowSettings(true)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                title="Settings"
              >
                <Settings className="w-5 h-5 text-white/70" />
              </button>
            )}

            {/* Session Timer */}
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-sm font-mono text-blue-300">
              <Clock className="w-4 h-4" />
              {formatTime(sessionTimer)}
            </div>

            {/* Exit Button (Runner Only) */}
            {mode === 'runner' && (
              <button
                onClick={() => {
                  if (window.confirm('Quit workout session?')) {
                    setIsTimerRunning(false);
                    setMode('dashboard');
                  }
                }}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white/50" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT AREA */}
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