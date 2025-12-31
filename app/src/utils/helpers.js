import EXERCISE_DB from '../data/exercises.json';

// --- DATE HELPERS ---

export const formatDateKey = (date) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
};

export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};

export const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

// --- DURATION PARSER ---
// Extracts seconds from strings like "30 sec", "1 min", "45s/side"
export const parseDuration = (str) => {
  if (!str) return 0;

  // Check for minutes (e.g., "1 min")
  const minMatch = str.match(/(\d+)\s*(min|m)/i);
  if (minMatch) return parseInt(minMatch[1]) * 60;

  // Check for seconds (e.g., "30 sec", "30s")
  const secMatch = str.match(/(\d+)\s*(sec|s)/i);
  if (secMatch) return parseInt(secMatch[1]);

  // If only reps, return 0 so the timer doesn't auto-start
  return 0;
};

// --- QUEUE BUILDER ---
// Merges the Schedule Item (Reps/Duration) with the DB Data (Name/GIF)
export const createWorkoutQueue = (daySchedule) => {
  let queue = [];

  const mergeData = (item, type, round = 0, totalRounds = 0) => {
    const dbData = EXERCISE_DB[item.id];

    if (!dbData) {
      console.warn(`Exercise ID not found in DB: ${item.id}`);
      return null;
    }

    return {
      ...dbData, // Static data (Name, GIF)
      ...item, // Overrides (Reps, Duration, Equipment)
      type,
      round,
      totalRounds,
    };
  };

  // 1. Warmup
  if (daySchedule.warmup) {
    daySchedule.warmup.forEach((item) => {
      const ex = mergeData(item, 'Warm Up');
      if (ex) queue.push(ex);
    });
  }

  // 2. Circuit
  if (daySchedule.circuit) {
    const rounds =
      typeof daySchedule.rounds === 'number' ? daySchedule.rounds : 3;
    for (let r = 1; r <= rounds; r++) {
      daySchedule.circuit.forEach((item) => {
        const ex = mergeData(item, 'Circuit', r, rounds);
        if (ex) queue.push(ex);
      });
    }
  }

  // 3. Cooldown
  if (daySchedule.cooldown) {
    daySchedule.cooldown.forEach((item) => {
      const ex = mergeData(item, 'Cool Down');
      if (ex) queue.push(ex);
    });
  }

  return queue;
};
