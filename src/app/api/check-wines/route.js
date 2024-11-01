// src/app/api/check-wines/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import Wine from '@/models/Wine';

export async function GET() {
  try {
    await dbConnect();
    
    // Get all wines
    const wines = await Wine.find({});
    
    // Get connection details from MongoDB URI
    const uri = process.env.MONGODB_URI;
    const dbName = uri.split('/').pop().split('?')[0];
    
    return NextResponse.json({
      databaseDetails: {
        database: dbName,
        isConnected: mongoose.connection.readyState === 1,
      },
      wines: {
        count: wines.length,
        data: wines
      }
    });
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { 
      status: 500 
    });
  }
}