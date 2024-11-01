// src/app/api/wines/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Wine from '@/models/Wine';

function generateSlug(name, vintage) {
  return `${name}-${vintage}`
    .toLowerCase()
    .replace(/[\s&\/\\#,+()$~%.'":*?<>{}]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function POST(request) {
  try {
    console.log('Starting wine creation...');
    await dbConnect();
    console.log('DB connected');

    const data = await request.json();
    console.log('Received data:', data);

    // Generate the slug
    const slug = generateSlug(data.name, data.vintage);
    console.log('Generated slug:', slug);

    // Create the wine object with the slug
    const wineData = {
      ...data,
      slug: slug
    };

    console.log('Attempting to create wine with:', wineData);

    const wine = await Wine.create(wineData);
    console.log('Wine created successfully:', wine);

    return NextResponse.json({ 
      success: true, 
      wine: wine 
    }, { 
      status: 201 
    });

  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });

    return NextResponse.json({ 
      success: false,
      error: error.message,
      errorType: error.name
    }, { 
      status: 500 
    });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const wines = await Wine.find({}).sort({ createdAt: -1 });
    return NextResponse.json(wines);
  } catch (error) {
    console.error('Error fetching wines:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}