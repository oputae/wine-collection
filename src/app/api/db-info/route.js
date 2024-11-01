// src/app/api/db-info/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import Wine from '@/models/Wine';

export async function GET() {
  try {
    await dbConnect();
    
    const wines = await Wine.find({});
    
    return NextResponse.json({
      connectionStatus: {
        isConnected: mongoose.connection.readyState === 1,
        databaseName: mongoose.connection.db.databaseName || 'Not connected to any database'
      },
      wines: {
        count: wines.length,
        data: wines.map(wine => ({
          id: wine._id,
          name: wine.name,
          producer: wine.producer,
          vintage: wine.vintage,
          createdAt: wine.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { 
      status: 500 
    });
  }
}