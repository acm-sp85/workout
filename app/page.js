'use client';
import React, { useState, useEffect } from 'react';
import {
  Check,
  Clock,
  Dumbbell,
  Heart,
  Flame,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  Image as ImageIcon,
  Calendar,
  TrendingUp,
  Save,
  Trophy,
} from 'lucide-react';

// --- HELPER FUNCTIONS FOR DATES ---
const formatDateKey = (date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
};

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

export default function WorkoutPlan() {
  // --- STATE ---
  const [selectedDay, setSelectedDay] = useState(getTodaysWorkout());
  const [completedExercises, setCompletedExercises] = useState({});
  const [currentRound, setCurrentRound] = useState(1);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [activeSection, setActiveSection] = useState('warmup');

  // Database State (Local Storage)
  const [workoutHistory, setWorkoutHistory] = useState({});

  function getTodaysWorkout() {
    const today = new Date().getDay();
    // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    const dayMap = {
      1: 'dayA', // Monday
      2: 'dayB', // Tuesday
      4: 'dayC', // Thursday
      5: 'dayD', // Friday
    };
    return dayMap[today] || 'dayA';
  }

  // --- EFFECTS ---

  // 1. Load History on Mount
  useEffect(() => {
    const saved = localStorage.getItem('myWorkoutDB');
    if (saved) {
      setWorkoutHistory(JSON.parse(saved));
    }
  }, []);

  // 2. Timer Logic
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // --- HANDLERS ---

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleExercise = (id) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleExpanded = (id, e) => {
    e.stopPropagation();
    setExpandedExercise(expandedExercise === id ? null : id);
  };

  const markWorkoutComplete = () => {
    const dateKey = formatDateKey(new Date());
    const newHistory = {
      ...workoutHistory,
      [dateKey]: selectedDay,
    };
    setWorkoutHistory(newHistory);
    localStorage.setItem('myWorkoutDB', JSON.stringify(newHistory));
    alert('Workout saved to history! Great job.');
  };

  // --- DATA ---

  const workoutDays = {
    dayA: {
      name: 'Lower Body + Core Stability',
      day: 'Monday',
      focus: 'Fat-burning via large muscles, hip mobility, pelvic/core control',
      shoulderLoad: 'Minimal',
      warmup: [
        {
          id: 'a-w1',
          name: 'March or Light Jog in Place',
          duration: '60 sec',
          gifUrl: 'https://media.giphy.com/media/LtPwyJaXM0nnW/giphy.gif',
        },
        {
          id: 'a-w2',
          name: 'Hip Circles',
          duration: '30 sec each direction',
          gifUrl:
            'https://thumbs.gfycat.com/GrimDeliciousLemur-size_restricted.gif',
        },
        {
          id: 'a-w3',
          name: 'Walking Lunges with Torso Rotation',
          duration: '6 per side',
          gifUrl:
            'https://thumbs.gfycat.com/VacantGloomyHornedviper-size_restricted.gif',
        },
        {
          id: 'a-w4',
          name: 'Cat–Cow',
          duration: '6-8 slow reps',
          gifUrl: 'https://media.giphy.com/media/3oEjHUf7j0aFDce0dG/giphy.gif',
        },
        {
          id: 'a-w5',
          name: 'Bodyweight Squats',
          duration: '10 reps',
          gifUrl: 'https://media.giphy.com/media/5eM4x8fxZNzPO/giphy.gif',
        },
      ],
      circuit: [
        {
          id: 'a-m1',
          name: 'Goblet Squat',
          reps: '12-15 reps',
          equipment: '8kg dumbbell',
          notes: 'Slow on way down (3 sec), powerful up. Primary fat-burner',
          gifUrl: 'https://gymvisual.com/img/p/1/7/2/5/6/17256.gif',
        },
        {
          id: 'a-m2',
          name: 'Reverse Lunges',
          reps: '8-10 per leg',
          equipment: 'Bodyweight or 5kg goblet',
          notes: 'Easier on knees than forward lunges',
          gifUrl:
            'https://thumbs.gfycat.com/ScaryFlippantCuttlefish-size_restricted.gif',
        },
        {
          id: 'a-m3',
          name: 'Glute Bridge',
          reps: '15 reps',
          equipment: '5-8kg on hips if easy',
          notes: 'Pause 2 sec at top',
          gifUrl: 'https://gymvisual.com/img/p/1/0/2/3/2/10232.gif',
        },
        {
          id: 'a-m4',
          name: 'Dead Bug',
          reps: '8-10 slow per side',
          equipment: 'None',
          notes: 'Keep lower back pressed into floor',
          gifUrl:
            'https://thumbs.gfycat.com/DeficientGleamingAardwolf-size_restricted.gif',
        },
        {
          id: 'a-m5',
          name: 'Standing High Knees or Fast March',
          reps: '40 sec',
          equipment: 'None',
          notes: 'Heart rate up, minimal shoulder involvement',
          gifUrl: 'https://media.giphy.com/media/ZeB4HcMpsuf7y/giphy.gif',
        },
      ],
      rounds: 3,
      restBetween: '20-30 sec',
      restRounds: '60 sec',
      cooldown: [
        {
          id: 'a-c1',
          name: 'Hip Flexor Stretch',
          duration: '30 sec per side',
          gifUrl:
            'https://i.pinimg.com/originals/10/2d/95/102d95ee3fb294afeb2fb0d82229edde.gif',
        },
        {
          id: 'a-c2',
          name: 'Hamstrings Stretch',
          duration: '30 sec per side',
          gifUrl: 'https://media.giphy.com/media/mEnciyhXNQARSfnGJP/giphy.gif',
        },
        {
          id: 'a-c3',
          name: 'Figure-4 Glute Stretch',
          duration: '30 sec per side',
          gifUrl:
            'https://i.pinimg.com/originals/8a/39/b9/8a39b986c0e88dd24a53adfc9e1b3d49.gif',
        },
        {
          id: 'a-c4',
          name: 'Deep Breathing (Supine)',
          duration: '1 min',
          gifUrl: '',
        },
      ],
    },
    dayB: {
      name: 'Upper Body (Shoulder-Safe) + Core',
      day: 'Tuesday',
      focus: 'Posture, upper-body strength, shoulder health',
      shoulderLoad: 'No overhead loading',
      warmup: [
        {
          id: 'b-w1',
          name: 'Arm Circles (Small → Larger)',
          duration: '60 sec',
          gifUrl: 'https://media.giphy.com/media/5t9IcXCmDpPJpN3Ujw/giphy.gif',
        },
        {
          id: 'b-w2',
          name: 'Shoulder Pendulum Swings',
          duration: '30 sec each direction',
          gifUrl:
            'https://i.pinimg.com/originals/85/25/8d/85258d71e29e76abb0e05c95d54c1949.gif',
        },
        {
          id: 'b-w3',
          name: 'Scapular Retractions',
          duration: '12 reps',
          gifUrl: '',
        },
        {
          id: 'b-w4',
          name: 'Wall Push-Ups',
          duration: '10 reps',
          gifUrl:
            'https://thumbs.gfycat.com/UnfoldedShimmeringAmericanshorthair-size_restricted.gif',
        },
      ],
      circuit: [
        {
          id: 'b-m1',
          name: 'Incline Push-Ups',
          reps: '8-12 reps',
          equipment: 'Bench/table/wall',
          notes: 'Stop before shoulder pain',
          gifUrl:
            'https://thumbs.gfycat.com/UnfoldedShimmeringAmericanshorthair-size_restricted.gif',
        },
        {
          id: 'b-m2',
          name: 'One-Arm Dumbbell Row',
          reps: '10 per arm',
          equipment: '5-8kg',
          notes: 'Support free hand on bench/chair',
          gifUrl: 'https://gymvisual.com/img/p/1/7/4/9/5/17495.gif',
        },
        {
          id: 'b-m3',
          name: 'Plank (Forearms)',
          reps: '30-45 sec',
          equipment: 'None',
          notes: 'If shoulder complains → knees down',
          gifUrl: 'https://media.giphy.com/media/3oEjHUf7j0aFDce0dG/giphy.gif',
        },
        {
          id: 'b-m4',
          name: 'Dumbbell Romanian Deadlift',
          reps: '12-15 reps',
          equipment: '2×5kg or 8kg goblet',
          notes: 'Posterior chain + core bracing',
          gifUrl: 'https://gymvisual.com/img/p/1/9/3/9/6/19396.gif',
        },
        {
          id: 'b-m5',
          name: 'Standing Pallof Press',
          reps: '30 sec',
          equipment: 'Dumbbell hold',
          notes: 'Anti-rotation core work',
          gifUrl: '',
        },
      ],
      rounds: 3,
      restBetween: '20-30 sec',
      restRounds: '60 sec',
      cooldown: [
        {
          id: 'b-c1',
          name: 'Chest Stretch (Doorway)',
          duration: '30 sec',
          gifUrl:
            'https://i.pinimg.com/originals/93/44/96/93449621d95bcb6f2bbc4ed98ec7e1ba.gif',
        },
        {
          id: 'b-c2',
          name: 'Upper-Back Stretch (Hug)',
          duration: '30 sec',
          gifUrl: '',
        },
        {
          id: 'b-c3',
          name: 'Shoulder External Rotation Stretch',
          duration: '30 sec (gentle)',
          gifUrl: '',
        },
        { id: 'b-c4', name: 'Deep Breathing', duration: '1 min', gifUrl: '' },
      ],
    },
    dayC: {
      name: 'Mobility + Athletic Conditioning',
      day: 'Thursday',
      focus: 'Joint health, coordination, fat loss without joint stress',
      shoulderLoad: 'Low',
      warmup: [
        {
          id: 'c-w1',
          name: 'Jumping Jacks or Fast March',
          duration: '60 sec',
          gifUrl: 'https://media.giphy.com/media/LtPwyJaXM0nnW/giphy.gif',
        },
        {
          id: 'c-w2',
          name: "World's Greatest Stretch",
          duration: '3 reps per side',
          gifUrl: '',
        },
        {
          id: 'c-w3',
          name: 'Hip Openers',
          duration: '30 sec',
          gifUrl:
            'https://thumbs.gfycat.com/GrimDeliciousLemur-size_restricted.gif',
        },
        {
          id: 'c-w4',
          name: 'Arm Swings',
          duration: '30 sec',
          gifUrl: 'https://media.giphy.com/media/5t9IcXCmDpPJpN3Ujw/giphy.gif',
        },
      ],
      circuit: [
        {
          id: 'c-m1',
          name: 'Bodyweight Squat → Calf Raise',
          reps: '12 reps',
          equipment: 'None',
          notes: 'Continuous movement',
          gifUrl: 'https://media.giphy.com/media/5eM4x8fxZNzPO/giphy.gif',
        },
        {
          id: 'c-m2',
          name: 'Step-Back Lunge → Knee Drive',
          reps: '8 per side',
          equipment: 'None',
          notes: 'Explosive knee drive',
          gifUrl: '',
        },
        {
          id: 'c-m3',
          name: 'Bear Crawl',
          reps: '30 sec',
          equipment: 'None',
          notes: 'Short distance or in place',
          gifUrl: '',
        },
        {
          id: 'c-m4',
          name: 'Mountain Climbers (Controlled)',
          reps: '30 sec',
          equipment: 'None',
          notes: 'Move continuously but never sloppy',
          gifUrl: 'https://media.giphy.com/media/ZeB4HcMpsuf7y/giphy.gif',
        },
        {
          id: 'c-m5',
          name: 'Hollow Body Hold or Crunch',
          reps: '30 sec',
          equipment: 'None',
          notes: 'Core engagement',
          gifUrl: '',
        },
      ],
      rounds: 'AMRAP 15 min',
      restBetween: 'Minimal - continuous',
      restRounds: 'As needed',
      cooldown: [
        { id: 'c-c1', name: 'Deep Squat Hold', duration: '60 sec', gifUrl: '' },
        {
          id: 'c-c2',
          name: 'Hip Flexor Stretch',
          duration: '30 sec per side',
          gifUrl:
            'https://i.pinimg.com/originals/10/2d/95/102d95ee3fb294afeb2fb0d82229edde.gif',
        },
        {
          id: 'c-c3',
          name: 'Spinal Twist (Lying)',
          duration: '30 sec per side',
          gifUrl: '',
        },
        { id: 'c-c4', name: 'Nasal Breathing', duration: '1 min', gifUrl: '' },
      ],
    },
    dayD: {
      name: 'Core + Metabolic',
      day: 'Friday',
      focus: 'Tightening midsection, conditioning - Optional 4th day',
      shoulderLoad: 'Minimal',
      warmup: [
        {
          id: 'd-w1',
          name: 'March in Place',
          duration: '60 sec',
          gifUrl: 'https://media.giphy.com/media/LtPwyJaXM0nnW/giphy.gif',
        },
        {
          id: 'd-w2',
          name: 'Standing Torso Rotations',
          duration: '30 sec',
          gifUrl: 'https://media.giphy.com/media/l0HlMWKDFCgku7weQ/giphy.gif',
        },
        {
          id: 'd-w3',
          name: 'Glute Bridges',
          duration: '10 reps',
          gifUrl: 'https://gymvisual.com/img/p/1/0/2/3/2/10232.gif',
        },
        {
          id: 'd-w4',
          name: 'Dead Bug',
          duration: '6 reps per side',
          gifUrl:
            'https://thumbs.gfycat.com/DeficientGleamingAardwolf-size_restricted.gif',
        },
      ],
      circuit: [
        {
          id: 'd-m1',
          name: 'Side Plank',
          reps: '30 sec per side',
          equipment: 'None',
          notes: 'Knees or feet',
          gifUrl: '',
        },
        {
          id: 'd-m2',
          name: 'Bicycle Crunch (Slow)',
          reps: '10-12 per side',
          equipment: 'None',
          notes: 'Controlled movement',
          gifUrl: '',
        },
        {
          id: 'd-m3',
          name: 'Dumbbell Suitcase Carry',
          reps: '30-40 sec per side',
          equipment: '8kg',
          notes: 'Excellent for deep core + posture',
          gifUrl: '',
        },
        {
          id: 'd-m4',
          name: 'Squat Pulses',
          reps: '20 sec',
          equipment: 'None',
          notes: 'Stay in squat position',
          gifUrl: '',
        },
        {
          id: 'd-m5',
          name: 'Fast Feet / Shadow Boxing',
          reps: '40 sec',
          equipment: 'None',
          notes: 'No overhead punches',
          gifUrl: '',
        },
      ],
      rounds: 3,
      restBetween: '20-30 sec',
      restRounds: '60 sec',
      cooldown: [
        {
          id: 'd-c1',
          name: 'Cobra Stretch (Gentle)',
          duration: '30 sec',
          gifUrl: '',
        },
        {
          id: 'd-c2',
          name: "Child's Pose",
          duration: '60 sec',
          gifUrl:
            'https://i.pinimg.com/originals/a2/d8/67/a2d8675f78e2df23062b72e2a00afcb4.gif',
        },
        {
          id: 'd-c3',
          name: 'Hip Stretch',
          duration: '30 sec per side',
          gifUrl:
            'https://i.pinimg.com/originals/10/2d/95/102d95ee3fb294afeb2fb0d82229edde.gif',
        },
        { id: 'd-c4', name: 'Deep Breathing', duration: '1 min', gifUrl: '' },
      ],
    },
  };

  const currentWorkout = workoutDays[selectedDay];

  // --- SUB COMPONENTS ---

  const ExerciseCard = ({ ex, idSuffix = '', showGif = true }) => {
    const exerciseId = idSuffix ? `${ex.id}${idSuffix}` : ex.id;
    const isExpanded = expandedExercise === exerciseId;

    return (
      <div
        className={`rounded-lg border cursor-pointer transition-all ${
          completedExercises[exerciseId]
            ? 'bg-green-500/20 border-green-500/50'
            : 'bg-white/5 border-white/10 hover:bg-white/10'
        }`}
      >
        <div onClick={() => toggleExercise(exerciseId)} className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                completedExercises[exerciseId]
                  ? 'bg-green-500 border-green-500'
                  : 'border-white/30'
              }`}
            >
              {completedExercises[exerciseId] && <Check className="w-4 h-4" />}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold">{ex.name}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-blue-300 text-sm font-medium">
                    {ex.reps || ex.duration}
                  </span>
                  {showGif && ex.gifUrl && (
                    <button
                      onClick={(e) => toggleExpanded(exerciseId, e)}
                      className="p-1 hover:bg-white/10 rounded"
                    >
                      <ImageIcon className="w-4 h-4 text-blue-400" />
                    </button>
                  )}
                </div>
              </div>
              {ex.equipment && (
                <p className="text-sm text-blue-200 mt-1">
                  Equipment: {ex.equipment}
                </p>
              )}
              {ex.notes && (
                <p className="text-xs text-white/60 mt-2 italic">{ex.notes}</p>
              )}
            </div>
          </div>
        </div>

        {isExpanded && showGif && ex.gifUrl && (
          <div className="px-4 pb-4">
            <div className="bg-black/30 rounded-lg overflow-hidden border border-white/10">
              <img
                src={ex.gifUrl}
                alt={ex.name}
                className="w-full h-64 object-contain bg-gradient-to-br from-slate-800 to-slate-900"
                onError={(e) => {
                  e.target.src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23334155" width="400" height="300"/%3E%3Ctext fill="%23cbd5e1" font-family="system-ui" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EDemo not available%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
            <p className="text-xs text-white/60 text-center mt-2">
              Tap the image icon again to close
            </p>
          </div>
        )}
      </div>
    );
  };

  const WorkoutCalendar = ({ history }) => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth); // 0=Sun

    const days = [];
    // Empty slots
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    }

    // Actual days
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

    const monthName = today.toLocaleString('default', { month: 'long' });

    return (
      <div className="bg-black/20 rounded-xl p-4 border border-white/10">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-400" />
          {monthName} Progress
        </h3>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
            <span key={d} className="text-[10px] text-white/40">
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-2">{days}</div>
        <div className="mt-4 flex items-center gap-2 text-[10px] text-white/40 justify-center">
          <div className="w-2 h-2 bg-green-500 rounded-full opacity-60"></div>{' '}
          Completed
          <div className="w-2 h-2 border border-blue-500 rounded-full ml-2"></div>{' '}
          Today
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Dumbbell className="w-7 h-7 text-blue-400" />
                Weekly Training Plan
              </h1>
              <p className="text-sm text-blue-200 mt-1">
                22-25 min per session • 3-4x/week
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-2xl font-bold text-blue-400">
                <Clock className="w-6 h-6" />
                {formatTime(timerSeconds)}
              </div>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="mt-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-sm flex items-center gap-1 ml-auto"
              >
                {isTimerRunning ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isTimerRunning ? 'Pause' : 'Start'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* NEW GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* MAIN CONTENT (Spans 3 columns) */}
          <div className="lg:col-span-3">
            {/* Day Selector */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-white/60 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                SELECT YOUR WORKOUT DAY
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(workoutDays).map(([key, day]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedDay(key)}
                    className={`p-4 rounded-lg border transition-all text-left ${
                      selectedDay === key
                        ? 'bg-blue-500/30 border-blue-500 shadow-lg shadow-blue-500/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-blue-300 uppercase">
                        {day.day}
                      </span>
                      {getTodaysWorkout() === key && (
                        <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                          Today
                        </span>
                      )}
                    </div>
                    <p className="font-semibold text-sm">{day.name}</p>
                    <p className="text-xs text-white/60 mt-1">{day.focus}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Workout Info */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 text-orange-400 mb-1">
                  <Flame className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase">Focus</span>
                </div>
                <p className="text-sm font-medium">{currentWorkout.focus}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 text-red-400 mb-1">
                  <Heart className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase">
                    Rounds
                  </span>
                </div>
                <p className="text-xl font-bold">
                  {typeof currentWorkout.rounds === 'number'
                    ? currentWorkout.rounds
                    : currentWorkout.rounds.split(' ')[0]}
                </p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 text-green-400 mb-1">
                  <Check className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase">Round</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentRound(Math.max(1, currentRound - 1))
                    }
                    className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-sm"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold">{currentRound}</span>
                  <button
                    onClick={() =>
                      setCurrentRound(
                        Math.min(
                          typeof currentWorkout.rounds === 'number'
                            ? currentWorkout.rounds
                            : 5,
                          currentRound + 1
                        )
                      )
                    }
                    className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-sm"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Warm-Up Section */}
            <div className="mb-4">
              <button
                onClick={() =>
                  setActiveSection(activeSection === 'warmup' ? '' : 'warmup')
                }
                className="w-full bg-gradient-to-r from-orange-500/20 to-orange-600/20 hover:from-orange-500/30 hover:to-orange-600/30 backdrop-blur-sm rounded-lg p-4 border border-orange-500/30 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/30 rounded-full flex items-center justify-center">
                    <Flame className="w-6 h-6 text-orange-300" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-bold">Warm-Up</h2>
                    <p className="text-sm text-orange-200">
                      4-5 minutes • Prep joints & raise heart rate
                    </p>
                  </div>
                </div>
                {activeSection === 'warmup' ? (
                  <ChevronUp className="w-6 h-6" />
                ) : (
                  <ChevronDown className="w-6 h-6" />
                )}
              </button>

              {activeSection === 'warmup' && (
                <div className="mt-3 space-y-2">
                  {currentWorkout.warmup.map((ex) => (
                    <ExerciseCard key={ex.id} ex={ex} />
                  ))}
                </div>
              )}
            </div>

            {/* Main Circuit Section */}
            <div className="mb-4">
              <button
                onClick={() =>
                  setActiveSection(activeSection === 'circuit' ? '' : 'circuit')
                }
                className="w-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/30 rounded-full flex items-center justify-center">
                    <Dumbbell className="w-6 h-6 text-blue-300" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-bold">Main Circuit</h2>
                    <p className="text-sm text-blue-200">
                      {currentWorkout.rounds} • Rest:{' '}
                      {currentWorkout.restBetween} between exercises
                    </p>
                  </div>
                </div>
                {activeSection === 'circuit' ? (
                  <ChevronUp className="w-6 h-6" />
                ) : (
                  <ChevronDown className="w-6 h-6" />
                )}
              </button>

              {activeSection === 'circuit' && (
                <div className="mt-3 space-y-2">
                  {currentWorkout.circuit.map((ex) => (
                    <ExerciseCard
                      key={ex.id}
                      ex={ex}
                      idSuffix={`-r${currentRound}`}
                    />
                  ))}
                  <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/30 text-center">
                    <p className="text-sm text-blue-200">
                      Rest {currentWorkout.restRounds} after completing all
                      exercises
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Cool-Down Section */}
            <div className="mb-4">
              <button
                onClick={() =>
                  setActiveSection(
                    activeSection === 'cooldown' ? '' : 'cooldown'
                  )
                }
                className="w-full bg-gradient-to-r from-green-500/20 to-teal-600/20 hover:from-green-500/30 hover:to-teal-600/30 backdrop-blur-sm rounded-lg p-4 border border-green-500/30 flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-green-300" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-bold">Cool-Down</h2>
                    <p className="text-sm text-green-200">
                      3-4 minutes • Bring heart rate down safely
                    </p>
                  </div>
                </div>
                {activeSection === 'cooldown' ? (
                  <ChevronUp className="w-6 h-6" />
                ) : (
                  <ChevronDown className="w-6 h-6" />
                )}
              </button>

              {activeSection === 'cooldown' && (
                <div className="mt-3 space-y-2">
                  {currentWorkout.cooldown.map((ex) => (
                    <ExerciseCard key={ex.id} ex={ex} />
                  ))}
                </div>
              )}
            </div>

            {/* Progression Section */}
            <div className="mt-8 bg-purple-900/20 border border-purple-500/30 rounded-lg p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-white">Progression Strategy</h3>
              </div>
              <p className="text-sm text-white/80 mb-3">
                Every 2–3 weeks, apply{' '}
                <span className="text-purple-300 font-bold">ONE</span> of the
                following upgrades to keep improving:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  '+1 Round total',
                  '+2 Reps per exercise',
                  '+10 seconds to holds',
                  'Upgrade dumbbell weight',
                  'Reduce rest time slightly',
                ].map((rule, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-purple-200/80 bg-purple-500/10 px-3 py-2 rounded border border-purple-500/20"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    {rule}
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/40 mt-3 italic">
                Note: After 6–8 weeks, consider swapping some exercises while
                keeping this structure.
              </p>
            </div>

            {/* COMPLETE BUTTON */}
            <div className="mt-6 flex justify-center mb-10 lg:mb-0">
              <button
                onClick={markWorkoutComplete}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-green-900/50 flex items-center gap-2 transform active:scale-95 transition-all"
              >
                <Trophy className="w-5 h-5" />
                Complete Workout
              </button>
            </div>
          </div>

          {/* SIDEBAR (Spans 1 column) */}
          <div className="lg:col-span-1 space-y-6">
            {/* The Calendar */}
            <WorkoutCalendar history={workoutHistory} />

            {/* Optional: Stats Summary */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                Stats
              </h3>
              <div className="text-center p-3 bg-black/20 rounded-lg">
                <p className="text-3xl font-bold text-white">
                  {Object.keys(workoutHistory).length}
                </p>
                <p className="text-xs text-white/50 uppercase tracking-wider">
                  Total Workouts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
