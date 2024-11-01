// src/app/api/debug/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Wine from '@/models/Wine';

export async function GET() {
  try {
    await dbConnect();
    
    // Get schema paths
    const schemaInfo = {};
    Object.keys(Wine.schema.paths).forEach(path => {
      const pathInfo = Wine.schema.paths[path];
      schemaInfo[path] = {
        type: pathInfo.instance,
        required: !!pathInfo.options.required,
        default: pathInfo.options.default,
        enum: pathInfo.options.enum
      };
    });
    
    return NextResponse.json({
      modelName: Wine.modelName,
      collectionName: Wine.collection.name,
      schema: schemaInfo
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { 
      status: 500 
    });
  }
}