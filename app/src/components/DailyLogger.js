import React, { useState, useEffect } from 'react';
import { 
  Leaf, Cookie, Wine, Apple, Clock, Check, X, Save 
} from 'lucide-react';

export default function DailyLogger({ dateKey, initialData, onSave }) {
  // Default State
  const [plants, setPlants] = useState(0);
  const [upf, setUpf] = useState(null); // null = unset, true = yes, false = no
  const [drinks, setDrinks] = useState(0);
  const [fruit, setFruit] = useState(null);
  const [fasting, setFasting] = useState(12);

  // Load initial data if editing a past day
  useEffect(() => {
    if (initialData) {
      if (initialData.plants !== undefined) setPlants(initialData.plants);
      if (initialData.upf !== undefined) setUpf(initialData.upf);
      if (initialData.drinks !== undefined) setDrinks(initialData.drinks);
      if (initialData.fruit !== undefined) setFruit(initialData.fruit);
      if (initialData.fasting !== undefined) setFasting(initialData.fasting);
    }
  }, [initialData]);

  const handleSave = () => {
    onSave({
      plants,
      upf,
      drinks,
      fruit,
      fasting,
      loggedAt: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-5 fade-in duration-500">
      
      {/* 1. PLANTS (Counter) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Plants Eaten</h3>
        </div>
        <div className="flex items-center justify-between bg-black/30 rounded-xl p-2">
          <button 
            onClick={() => setPlants(Math.max(0, plants - 1))}
            className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-lg text-xl font-bold hover:bg-white/20"
          >
            -
          </button>
          <span className="text-3xl font-bold font-mono">{plants}</span>
          <button 
            onClick={() => setPlants(plants + 1)}
            className="w-12 h-12 flex items-center justify-center bg-blue-600 rounded-lg text-xl font-bold hover:bg-blue-500"
          >
            +
          </button>
        </div>
      </div>

      {/* 2. FRUIT (Yes/No) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
            <Apple className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Ate Fruit?</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setFruit(false)}
            className={`p-3 rounded-xl flex items-center justify-center gap-2 font-bold border transition-all ${
              fruit === false 
                ? 'bg-red-500/20 border-red-500 text-red-200' 
                : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
          >
            <X className="w-4 h-4" /> No
          </button>
          <button 
            onClick={() => setFruit(true)}
            className={`p-3 rounded-xl flex items-center justify-center gap-2 font-bold border transition-all ${
              fruit === true 
                ? 'bg-green-500/20 border-green-500 text-green-200' 
                : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
          >
            <Check className="w-4 h-4" /> Yes
          </button>
        </div>
      </div>

      {/* 3. ULTRA PROCESSED FOOD (Yes/No) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400">
            <Cookie className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Ultra Processed Food?</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setUpf(false)} // No UPF is Good!
            className={`p-3 rounded-xl flex items-center justify-center gap-2 font-bold border transition-all ${
              upf === false 
                ? 'bg-green-500/20 border-green-500 text-green-200' 
                : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
          >
            <Check className="w-4 h-4" /> Nope (Clean)
          </button>
          <button 
            onClick={() => setUpf(true)}
            className={`p-3 rounded-xl flex items-center justify-center gap-2 font-bold border transition-all ${
              upf === true 
                ? 'bg-red-500/20 border-red-500 text-red-200' 
                : 'bg-white/5 border-white/5 hover:bg-white/10'
            }`}
          >
            <X className="w-4 h-4" /> Yes
          </button>
        </div>
      </div>

      {/* 4. DRINKS (Selector) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
            <Wine className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Alcoholic Drinks</h3>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {[0, 1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => setDrinks(num)}
              className={`py-3 rounded-xl font-bold border transition-all ${
                drinks === num 
                  ? 'bg-blue-600 border-blue-400 shadow-lg' 
                  : 'bg-white/5 border-white/5 hover:bg-white/10'
              }`}
            >
              {num === 4 ? '3+' : num}
            </button>
          ))}
        </div>
      </div>

      {/* 5. FASTING (Slider) */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg">Fasting Hours</h3>
        </div>
        <div className="flex items-center justify-between mb-2">
           <span className="text-xs text-white/50">8h</span>
           <span className="text-3xl font-bold text-blue-300">{fasting}h</span>
           <span className="text-xs text-white/50">24h</span>
        </div>
        <input 
          type="range" 
          min="8" 
          max="24" 
          step="1"
          value={fasting}
          onChange={(e) => setFasting(parseInt(e.target.value))}
          className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
      </div>

      {/* SAVE BUTTON */}
      <button 
        onClick={handleSave}
        className="w-full py-4 bg-green-600 hover:bg-green-500 rounded-2xl font-bold text-lg shadow-xl shadow-green-900/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
      >
        <Save className="w-5 h-5" /> Save Day Log
      </button>

      <div className="h-20" /> {/* Spacer for bottom nav */}
    </div>
  );
}