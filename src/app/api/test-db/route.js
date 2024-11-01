// src/app/api/test-db/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';

export async function GET() {
  try {
    console.log('Testing database connection...');
    await dbConnect();
    console.log('Database connected successfully');
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Database connected successfully'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      status: 'error', 
      error: error.message 
    }, { 
      status: 500 
    });
  }
}