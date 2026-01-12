import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, 'Please provide a slug for this exercise.'],
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name for this exercise.'],
  },
  gifUrl: {
    type: String,
    required: [true, 'Please provide a gifUrl for this exercise.'],
  },
});

export default mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema);
