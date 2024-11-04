// src/app/api/test-connection/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import Wine from '@/models/Wine';

export async function GET() {
  try {
    await dbConnect();
    
    // Get connection info
    const connectionInfo = {
      databaseName: mongoose.connection.name,
      databaseURI: process.env.MONGODB_URI,
      collections: await mongoose.connection.db.listCollections().toArray(),
      isConnected: mongoose.connection.readyState === 1
    };

    // Try to find all wines
    const wines = await Wine.find({});

    return NextResponse.json({
      connection: connectionInfo,
      wineCount: wines.length,
      wines: wines.map(wine => ({
        slug: wine.slug,
        name: wine.name
      }))
    });

  } catch (error) {
    return NextResponse.json({
      error: error.message,
      connectionString: process.env.MONGODB_URI
    }, { 
      status: 500 
    });
  }
}