// src/app/api/wines/[slug]/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Wine from '@/models/Wine';

export async function GET(request, context) {
  console.log('=== Starting GET request ===');
  console.log('Full request URL:', request.url);
  console.log('Context params:', context.params);
  
  try {
    await dbConnect();
    console.log('Database connected');

    // First get all wines to verify data access
    const allWines = await Wine.find({});
    console.log('All wines in DB:', allWines.map(w => ({ name: w.name, slug: w.slug })));

    // Then try to find the specific wine
    const wine = await Wine.findOne({ slug: context.params.slug });
    console.log('Search result for slug:', context.params.slug, wine ? 'Found' : 'Not found');

    if (!wine) {
      return NextResponse.json({
        error: 'Wine not found',
        requestedSlug: context.params.slug,
        availableSlugs: allWines.map(w => w.slug)
      }, { status: 404 });
    }

    return NextResponse.json(wine);
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json({
      error: error.message,
      stack: error.stack
    }, { status: 500 });
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

export async function DELETE(request, context) {
  try {
    await dbConnect();
    
    const wine = await Wine.findOneAndDelete({ slug: context.params.slug });
    
    if (!wine) {
      return NextResponse.json(
        { error: 'Wine not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Wine deleted successfully' });
  } catch (error) {
    console.error('Error deleting wine:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
} 