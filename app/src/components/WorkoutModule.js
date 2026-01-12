'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Dumbbell, Clock, X, Settings, Plus, ArrowLeft } from 'lucide-react';

// Data & Helpers
import { WORKOUT_SCHEDULE } from '../data/schedule';
import {
  formatDateKey,
  createWorkoutQueue,
  formatTime,
} from '../utils/helpers';

// Components
import Dashboard from './Dashboard';
import Runner from './Runner';
import QueueDrawer from './QueueDrawer';
import SettingsModal from './SettingsModal';
import CustomLogModal from './CustomLogModal';

export default function WorkoutModule({ onExit, externalSave }) {
  // --- STATE ---
  const [workoutHistory, setWorkoutHistory] = useState({});
  const [activeDay, setActiveDay] = useState('dayA');
  const [mode, setMode] = useState('dashboard');
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [exerciseDB, setExerciseDB] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // UI States
  const [showQueueDrawer, setShowQueueDrawer] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCustomLog, setShowCustomLog] = useState(false);

  const [settings, setSettings] = useState({ getReadyDuration: 5 });

  // --- COMPUTED ---
  const previewQueue = useMemo(
    () => {
      if (!exerciseDB || Object.keys(exerciseDB).length === 0) return [];
      return createWorkoutQueue(WORKOUT_SCHEDULE[activeDay], exerciseDB);
    },
    [activeDay, exerciseDB]
  );

  // --- EFFECTS ---
  useEffect(() => {
    const saved = localStorage.getItem('myWorkoutDB');
    if (saved) setWorkoutHistory(JSON.parse(saved));
    const today = new Date().getDay();
    const map = { 1: 'dayA', 2: 'dayB', 4: 'dayC', 5: 'dayD' };
    if (map[today]) setActiveDay(map[today]);

    // Fetch Exercise DB
    const fetchExercises = async () => {
      try {
        const res = await fetch('/api/exercises');
        if (!res.ok) throw new Error('Failed to fetch exercises');
        const data = await res.json();
        setExerciseDB(data);
      } catch (err) {
        console.error(err);
        alert('Failed to load exercise data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, []);

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
    const newQueue = createWorkoutQueue(dayData, exerciseDB);
    if (!newQueue || newQueue.length === 0)
      return alert('Error loading workout data or connection issue.');
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
    const workoutName = WORKOUT_SCHEDULE[activeDay].name;
    const duration = formatTime(sessionTimer);
    const dateKey = formatDateKey(new Date());

    if (externalSave) {
      externalSave(workoutName, { duration, id: activeDay });
      setMode('dashboard');
      return;
    }

    const newEntry = {
      type: workoutName,
      id: activeDay,
      duration: duration,
      completed: true,
    };
    const newHistory = { ...workoutHistory, [dateKey]: newEntry };
    setWorkoutHistory(newHistory);
    localStorage.setItem('myWorkoutDB', JSON.stringify(newHistory));
    setMode('dashboard');
    alert('Workout Saved!');
  };

  const saveCustomLog = (data) => {
    const dateKey = data.date;
    const newEntry = {
      type: data.type,
      duration: `${data.duration} min`,
      isCustom: true,
      timestamp: new Date().toISOString(),
    };
    const newHistory = { ...workoutHistory, [dateKey]: newEntry };
    setWorkoutHistory(newHistory);
    localStorage.setItem('myWorkoutDB', JSON.stringify(newHistory));
    setShowCustomLog(false);
    alert(`Activity logged for ${dateKey}!`);
  };

  const handleNextSlide = () =>
    currentIndex < queue.length - 1
      ? setCurrentIndex((c) => c + 1)
      : handleFinish();
  const handlePrevSlide = () =>
    currentIndex > 0 && setCurrentIndex((c) => c - 1);

  const resetHistory = () => {
    if (window.confirm('Delete all workout history?')) {
      localStorage.removeItem('myWorkoutDB');
      setWorkoutHistory({});
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-slate-900 text-white rounded-3xl border border-white/10">
        <Dumbbell className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  // --- RENDER ---
  return (
    // FIX 1: Removed min-h-screen, added w-full, rounded corners to match parent aesthetic
    <div className="w-full bg-slate-900 text-white font-sans relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
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
      {showCustomLog && (
        <CustomLogModal
          onClose={() => setShowCustomLog(false)}
          onSave={saveCustomLog}
        />
      )}

      {/* HEADER */}
      {/* FIX 2: Changed to sticky, but ensures it stays within the rounded container */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onExit && (
              <button
                onClick={onExit}
                className="p-1 -ml-2 hover:bg-white/10 rounded-full"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
            )}

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
                <p className="text-xs text-blue-300 line-clamp-1">
                  {WORKOUT_SCHEDULE[activeDay]?.name}
                </p>
              </div>
            ) : (
              <h1 className="text-lg font-bold">Gym Module</h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            {mode === 'dashboard' && (
              <>
                <button
                  onClick={() => setShowCustomLog(true)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Plus className="w-5 h-5 text-green-400" />
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Settings className="w-5 h-5 text-white/70" />
                </button>
              </>
            )}

            <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 rounded-full text-xs font-mono text-blue-300">
              <Clock className="w-3 h-3" />
              {formatTime(sessionTimer)}
            </div>

            {mode === 'runner' && (
              <button
                onClick={() => {
                  if (window.confirm('Quit session?')) {
                    setIsTimerRunning(false);
                    setMode('dashboard');
                  }
                }}
                className="p-1 hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5 text-white/50" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      {/* FIX 3: Added pb-24 to ensure content isn't hidden behind the Parent App's bottom nav */}
      <div className="px-4 py-6 pb-24">
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
          // FIX 4: Adjusted height calculation for Runner.
          // 100dvh (dynamic viewport height) - 200px accounts for:
          // Parent Header + Module Header + Parent Bottom Nav + Padding
          <div className="h-[calc(100dvh-200px)] min-h-[500px] flex flex-col justify-center relative">
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
