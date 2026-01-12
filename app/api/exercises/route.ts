import dbConnect from '@/lib/db';
import Exercise from '@/models/Exercise';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  try {
    const exercises = await Exercise.find({});
    
    // Convert array to object map keyed by slug
    const exercisesMap = exercises.reduce((acc, exercise) => {
      acc[exercise.slug] = {
        name: exercise.name,
        gifUrl: exercise.gifUrl,
      };
      return acc;
    }, {} as Record<string, { name: string; gifUrl: string }>);

    return NextResponse.json(exercisesMap);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch exercises', details: (error as Error).message },
      { status: 500 }
    );
  }
}
