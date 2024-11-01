// src/app/api/find-data/route.js

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db/mongoose';
import Wine from '@/models/Wine';

export async function GET() {
  try {
    // Connect without database name first
    const baseUri = process.env.MONGODB_URI.split('?')[0].split('/').slice(0, -1).join('/');
    const connection = await mongoose.createConnection(baseUri + '?retryWrites=true&w=majority');
    
    // List all databases
    const adminDb = connection.db.admin();
    const dbList = await adminDb.listDatabases();
    
    // Results array
    const results = [];
    
    // Check each database
    for (const db of dbList.databases) {
      const dbConnection = await mongoose.createConnection(baseUri + '/' + db.name + '?retryWrites=true&w=majority');
      const collections = await dbConnection.db.listCollections().toArray();
      
      if (collections.some(col => col.name === 'wines')) {
        const wineCount = await dbConnection.db.collection('wines').countDocuments();
        if (wineCount > 0) {
          results.push({
            database: db.name,
            wineCount: wineCount
          });
        }
      }
      
      await dbConnection.close();
    }
    
    await connection.close();

    return NextResponse.json({
      databases: dbList.databases.map(db => db.name),
      wineLocations: results
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { 
      status: 500 
    });
  }
}