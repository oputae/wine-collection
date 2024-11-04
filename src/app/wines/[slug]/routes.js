// src/app/api/wines/[slug]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Wine from '@/models/Wine';

export async function GET(request, context) {
  try {
    // Log the incoming request
    console.log('GET request received');
    console.log('Slug from params:', context.params.slug);
    
    // Connect to DB
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected');

    // Find the wine
    console.log('Searching for wine with slug:', context.params.slug);
    const query = { slug: context.params.slug };
    console.log('Query:', query);

    // Get all wines first to verify data
    const allWines = await Wine.find({});
    console.log('All wines in database:', 
      allWines.map(w => ({
        name: w.name,
        slug: w.slug,
        id: w._id.toString()
      }))
    );

    // Find specific wine
    const wine = await Wine.findOne(query);
    console.log('Found wine:', wine);

    if (!wine) {
      console.log('No wine found with query:', query);
      return NextResponse.json(
        { 
          error: 'Wine not found',
          requestedSlug: context.params.slug,
          availableSlugs: allWines.map(w => w.slug)
        }, 
        { status: 404 }
      );
    }

    return NextResponse.json(wine);
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      params: context.params
    });
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    await dbConnect();
    const data = await request.json();
    
    const wine = await Wine.findOneAndUpdate(
      { slug: context.params.slug },
      { 
        ...data,
        updatedAt: new Date()
      },
      { 
        new: true,
        runValidators: true
      }
    );

    if (!wine) {
      return NextResponse.json(
        { error: 'Wine not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(wine);
  } catch (error) {
    console.error('Error updating wine:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}