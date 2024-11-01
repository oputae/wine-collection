// src/app/api/test/route.js

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Wine from '@/models/Wine';

export async function POST(request) {
  try {
    await dbConnect();
    
    // Sample wine data
    const sampleWine = {
      name: "Château Test Wine",
      producer: "Test Winery",
      vintage: 2020,
      type: "Red",
      region: {
        country: "France",
        area: "Bordeaux"
      },
      varietal: ["Cabernet Sauvignon", "Merlot"],
      details: {
        alcoholContent: 14.5,
        price: 50,
        purchaseDate: new Date(),
        purchaseLocation: "Local Wine Shop",
        quantity: 1
      },
      tasting: {
        date: new Date(),
        rating: 4.5,
        notes: "Test tasting notes",
        aromas: ["Cherry", "Vanilla"],
        pairings: ["Beef", "Cheese"]
      }
    };

    const wine = await Wine.create(sampleWine);
    return NextResponse.json({ success: true, data: wine });
  } catch (error) {
    console.error('Error in test route:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const wines = await Wine.find({});
    return NextResponse.json({ success: true, count: wines.length, data: wines });
  } catch (error) {
    console.error('Error in test route:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}