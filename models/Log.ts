import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  dateKey: {
    type: String,
    required: [true, 'Please provide a dateKey (YYYY-MM-DD).'],
    unique: true,
  },
  plants: { type: Number, default: 0 },
  upf: { type: Boolean, default: null }, // null = unset
  drinks: { type: Number, default: 0 },
  fruit: { type: Boolean, default: null },
  fasting: { type: Number, default: 12 },
  logCompleted: { type: Boolean, default: false },
  
  // Workout Data
  workout: {
    type: { type: String }, // 'Push Day', 'Pull Day' etc.
    details: mongoose.Schema.Types.Mixed,
    completed: { type: Boolean, default: false },
  },

  updatedAt: { type: Date, default: Date.now },
});

// Update the `updatedAt` field on save
LogSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Log || mongoose.model('Log', LogSchema);
