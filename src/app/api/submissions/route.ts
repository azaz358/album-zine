import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastInitial, email, mailingAddress, albumName, artist, yearReleased, albumDescription, pageScreenshot } = body;

    // Validate required fields
    if (!firstName || !lastInitial || !email || !mailingAddress || !albumName || !artist || !yearReleased || !albumDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create submission in database
    const submission = await prisma.submission.create({
      data: {
        firstName,
        lastInitial,
        email,
        mailingAddress,
        albumName,
        artist,
        yearReleased: parseInt(yearReleased),
        albumDescription,
        pageScreenshot: pageScreenshot || null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      submission: {
        id: submission.id,
        firstName: submission.firstName,
        lastInitial: submission.lastInitial,
        email: submission.email,
        mailingAddress: submission.mailingAddress,
        albumName: submission.albumName,
        artist: submission.artist,
        yearReleased: submission.yearReleased,
        albumDescription: submission.albumDescription,
        createdAt: submission.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const submissions = await prisma.submission.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        firstName: true,
        lastInitial: true,
        albumName: true,
        artist: true,
        yearReleased: true,
        albumDescription: true,
        createdAt: true,
        pageScreenshot: true
      }
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
} 