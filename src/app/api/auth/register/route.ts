import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullname, email, password, agreeToTerms } = body;

    // Validate request data
    if (!fullname || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Terms agreement validation
    if (!agreeToTerms) {
      return NextResponse.json(
        { message: 'You must agree to the terms and privacy policy' },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const now = new Date();

    // Create user
    const result = await db.collection('users').insertOne({
      fullname,
      email,
      password: hashedPassword,
      citizenStatus: 'newcomer',
      createdAt: now,
      updatedAt: now,
      emailVerified: false,
      signedEula: true,
      termsAccepted: now
    });

    const userId = result.insertedId;

    // Create user profile
    await db.collection('profiles').insertOne({
      userId,
      fullname,
      email,
      walletOpen: false,
      generalPublic: false,
      citizen: false,
      hasApplication: false,
      endorseCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    // Create citizen record
    await db.collection('citizen').insertOne({
      userId,
      firstName: fullname.split(' ')[0] || '',
      lastName: fullname.split(' ').slice(1).join(' ') || '',
      displayName: fullname,
      shortBio: '',
      publicAddress: null,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        userId: userId.toString(),
        status: 'newcomer'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}