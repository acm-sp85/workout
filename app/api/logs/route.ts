import dbConnect from '@/lib/db';
import Log from '@/models/Log';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  await dbConnect();

  try {
    // Optional: Filter by specific date or range if params provided
    // For now, we return all logs to populate the app state
    const logs = await Log.find({});
    
    // Convert array to object map keyed by dateKey
    const logsMap = logs.reduce((acc, log) => {
      acc[log.dateKey] = log.toObject();
      delete acc[log.dateKey]._id; // Optional: clean up ID
      delete acc[log.dateKey].__v;
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(logsMap);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch logs', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { dateKey, ...data } = body;

    if (!dateKey) {
      return NextResponse.json({ error: 'dateKey is required' }, { status: 400 });
    }

    // Upsert: Update if exists, Create if not
    const log = await Log.findOneAndUpdate(
      { dateKey },
      { $set: { ...data, dateKey } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(log);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save log', details: (error as Error).message },
      { status: 500 }
    );
  }
}
