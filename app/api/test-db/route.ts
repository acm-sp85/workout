import dbConnect from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ status: 'Connected to MongoDB' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 'Failed to connect', error: (error as Error).message }, { status: 500 });
  }
}
