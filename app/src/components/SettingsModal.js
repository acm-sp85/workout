import React from 'react';
import { X, Settings } from 'lucide-react';

export default function SettingsModal({ settings, onUpdate, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-sm relative z-10 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-400" />
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              "Get Ready" Countdown (Seconds)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={settings.getReadyDuration}
                onChange={(e) =>
                  onUpdate({
                    ...settings,
                    getReadyDuration: parseInt(e.target.value),
                  })
                }
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="font-mono text-lg font-bold w-8 text-right">
                {settings.getReadyDuration}s
              </span>
            </div>
            <p className="text-xs text-white/40 mt-2">
              Time given to prepare before the exercise timer starts.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-colors"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
}