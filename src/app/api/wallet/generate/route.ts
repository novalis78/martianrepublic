import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import walletService from '@/lib/services/blockchain';

/**
 * POST /api/wallet/generate
 * Generates a new seed phrase with enhanced entropy
 */
export async function POST(req: NextRequest) {
  try {
    // Ensure the user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse the request body if provided
    let wordCount = 12; // Default to 12 words
    
    // Check if request includes a wordCount parameter
    try {
      const body = await req.json();
      if (body && body.wordCount) {
        // Validate wordCount is either 12 or 24
        if (body.wordCount === 24) {
          wordCount = 24;
        }
      }
    } catch (e) {
      // If body parsing fails, use default value
    }
    
    // Generate a new seed phrase with specified word count
    const seedPhrase = await walletService.generateSeedPhrase(wordCount);
    
    return NextResponse.json({
      success: true,
      seedPhrase,
      wordCount,
      entropyBits: wordCount === 24 ? 256 : 128
    });
  } catch (error) {
    console.error('Error generating seed phrase:', error);
    return NextResponse.json({ error: 'Failed to generate seed phrase' }, { status: 500 });
  }
}