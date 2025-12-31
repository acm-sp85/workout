import React, { useRef, useEffect } from 'react';
import { List, X, Check } from 'lucide-react';

export default function QueueDrawer({ queue, currentIndex, onClose }) {
  const activeItemRef = useRef(null);

  useEffect(() => {
    if (currentIndex >= 0 && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      <div className="bg-slate-900 w-full max-w-md h-[85vh] sm:h-[600px] rounded-t-2xl sm:rounded-2xl flex flex-col pointer-events-auto relative z-10 animate-in slide-in-from-bottom-10 shadow-2xl border-t sm:border border-white/10">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-white">Workout Queue</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {queue.map((ex, i) => {
            const isCompleted = currentIndex >= 0 && i < currentIndex;
            const isActive = i === currentIndex;
            return (
              <div
                key={i}
                ref={isActive ? activeItemRef : null}
                className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
                  isActive
                    ? 'bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-900/20'
                    : isCompleted
                      ? 'bg-white/5 border-white/5 opacity-40'
                      : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <div>
                    <p
                      className={`font-semibold text-sm ${isActive ? 'text-blue-200' : 'text-white'}`}
                    >
                      {ex.name}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider opacity-60">
                      {ex.type} {ex.round > 0 && `• R${ex.round}`}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono opacity-70 bg-black/20 px-2 py-1 rounded">
                  {ex.reps || ex.duration}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
