// src/app/api/wines/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Wine from '@/models/Wine';

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const wine = await Wine.create(data);
    return NextResponse.json(wine, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const wines = await Wine.find({});
    return NextResponse.json(wines);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}