import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Trophy,
  ArrowRight,
  Dumbbell,
  List,
  Play,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { parseDuration } from '../utils/helpers';

export default function Runner({
  exercise,
  onNext,
  onPrev,
  progress,
  isLast,
  onPeek,
  settings,
}) {
  // Timer State
  const [phase, setPhase] = useState('idle'); // 'idle' | 'getReady' | 'work' | 'finished'
  const [timeLeft, setTimeLeft] = useState(0);
  const timerInterval = useRef(null);

  // Audio Ref
  const audioRef = useRef(null);

  // Helper to check if timed
  const isTimed = parseDuration(exercise.duration) > 0;

  // 1. Initialize Audio
  useEffect(() => {
    // A short, clean beep sound
    audioRef.current = new Audio(
      'https://cdn.freesound.org/previews/256/256113_3263906-lq.mp3'
    );
    audioRef.current.volume = 0.5;
  }, []);

  // 2. Reset & Auto-Start when exercise changes
  useEffect(() => {
    stopTimer();

    if (isTimed) {
      startTimerSequence();
    } else {
      setPhase('idle');
      setTimeLeft(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise]);

  // 3. Audio Logic (The Fix)
  useEffect(() => {
    // Only play sound if we are in the 'work' phase and time is running low
    if (phase === 'work' && timeLeft > 0 && timeLeft <= 5) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current
          .play()
          .catch((e) => console.log('Audio play failed', e));
      }
    }
  }, [timeLeft, phase]);

  // 4. Timer Sequence Logic
  const startTimerSequence = () => {
    // Start "Get Ready" Phase
    setPhase('getReady');
    setTimeLeft(settings.getReadyDuration);

    if (timerInterval.current) clearInterval(timerInterval.current);

    timerInterval.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);
  };

  // 5. Watch for timer reaching 0 to switch phases
  useEffect(() => {
    if (timeLeft === 0 && timerInterval.current) {
      if (phase === 'getReady') {
        // Switch to Work Phase
        clearInterval(timerInterval.current);
        const duration = parseDuration(exercise.duration);

        setPhase('work');
        setTimeLeft(duration);

        timerInterval.current = setInterval(() => {
          setTimeLeft((t) => {
            if (t <= 1) return 0;
            return t - 1;
          });
        }, 1000);
      } else if (phase === 'work') {
        // Finish Phase
        stopTimer();
        setPhase('finished');
      }
    }
  }, [timeLeft, phase, exercise.duration]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopTimer();
  }, []);

  const stopTimer = () => {
    if (timerInterval.current) clearInterval(timerInterval.current);
    timerInterval.current = null;
  };

  const handleStop = (e) => {
    e.stopPropagation();
    stopTimer();
    setPhase('idle');
  };

  const handleResume = (e) => {
    e.stopPropagation();
    startTimerSequence();
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto relative">
      <div className="w-full bg-white/10 h-1.5 rounded-full mb-4">
        <div
          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden flex flex-col shadow-2xl relative">
        <div className="p-4 bg-black/20 border-b border-white/5 flex justify-between items-center z-10 relative">
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${
                exercise.type === 'Warm Up'
                  ? 'bg-orange-500/20 text-orange-300'
                  : exercise.type === 'Cool Down'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-blue-500/20 text-blue-300'
              }`}
            >
              {exercise.type} {exercise.round > 0 && `• R${exercise.round}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {exercise.equipment && (
              <span className="text-xs text-white/50 hidden sm:block">
                {exercise.equipment}
              </span>
            )}
            <button
              onClick={onPeek}
              className="p-1.5 hover:bg-white/10 rounded-md text-white/70 hover:text-white transition-colors"
              title="Peek Queue"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative flex-1 bg-black/40 flex items-center justify-center overflow-hidden group">
          {/* IMAGE */}
          {exercise.gifUrl ? (
            <img
              src={exercise.gifUrl}
              alt={exercise.name}
              className={`w-full h-full object-cover transition-all duration-700 ${
                phase !== 'idle' ? 'scale-110' : ''
              }`}
              onError={(e) => {
                e.target.src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23334155" width="400" height="300"/%3E%3Ctext fill="%23cbd5e1" font-family="system-ui" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
              }}
            />
          ) : (
            <Dumbbell className="w-24 h-24 text-white/10" />
          )}

          {/* TIMER OVERLAY */}
          {isTimed && (
            <div
              className={`absolute inset-0 flex items-center justify-center z-20 transition-colors duration-300 ${
                phase !== 'idle' ? 'bg-black/40' : ''
              }`}
            >
              {/* IDLE (PAUSED) STATE */}
              {phase === 'idle' && (
                <div className="text-center animate-in zoom-in">
                  <p className="text-white/60 font-bold uppercase tracking-widest text-sm mb-4 drop-shadow-md">
                    Paused
                  </p>
                  <button
                    onClick={handleResume}
                    className="w-20 h-20 bg-blue-600/90 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 transform transition-all hover:scale-110 active:scale-95 hover:bg-blue-500"
                  >
                    <Play className="w-10 h-10 fill-white ml-1" />
                  </button>
                </div>
              )}

              {/* GET READY STATE */}
              {phase === 'getReady' && (
                <div className="text-center animate-in zoom-in">
                  <p className="text-orange-400 font-bold uppercase tracking-widest text-lg mb-2 drop-shadow-md">
                    Get Ready
                  </p>
                  <div className="text-8xl font-black text-white drop-shadow-xl tabular-nums">
                    {timeLeft}
                  </div>
                  <button
                    onClick={handleStop}
                    className="mt-8 px-4 py-2 bg-black/50 hover:bg-black/70 rounded-full text-sm font-medium flex items-center gap-2 mx-auto backdrop-blur-md border border-white/10"
                  >
                    <RotateCcw className="w-4 h-4" /> Pause
                  </button>
                </div>
              )}

              {/* WORK STATE */}
              {phase === 'work' && (
                <div className="text-center animate-in zoom-in">
                  <p className="text-green-400 font-bold uppercase tracking-widest text-lg mb-2 drop-shadow-md">
                    Work
                  </p>
                  <div className="text-8xl font-black text-white drop-shadow-xl tabular-nums">
                    {timeLeft}
                  </div>
                  <button
                    onClick={handleStop}
                    className="mt-4 px-4 py-2 bg-black/50 hover:bg-black/70 rounded-full text-sm font-medium flex items-center gap-2 mx-auto backdrop-blur-md border border-white/10"
                  >
                    <RotateCcw className="w-4 h-4" /> Stop
                  </button>
                </div>
              )}

              {/* FINISHED STATE */}
              {phase === 'finished' && (
                <div className="text-center animate-in zoom-in">
                  <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-4 drop-shadow-lg" />
                  <p className="text-2xl font-bold text-white drop-shadow-md">
                    Done!
                  </p>
                  <button
                    onClick={handleResume}
                    className="mt-4 text-white/50 hover:text-white text-sm flex items-center gap-1 mx-auto"
                  >
                    <RotateCcw className="w-3 h-3" /> Restart Timer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reps Overlay (Only visible if IDLE/PAUSED) */}
          {phase === 'idle' && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-12">
              <h2 className="text-3xl font-bold text-white mb-1">
                {exercise.name}
              </h2>
              <p className="text-2xl text-blue-300 font-medium">
                {exercise.reps || exercise.duration}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-4">
        <button
          onClick={onPrev}
          className="col-span-1 py-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={onNext}
          className={`col-span-3 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg shadow-lg transform active:scale-95 transition-all ${
            isLast
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          {isLast ? (
            <>
              <span className="mr-1">Finish</span>{' '}
              <Trophy className="w-6 h-6" />
            </>
          ) : (
            <>
              <span className="mr-1">Next</span>{' '}
              <ArrowRight className="w-6 h-6" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
