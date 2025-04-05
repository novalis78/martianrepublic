import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getCollection } from '@/lib/mongodb';
import walletService from '@/lib/services/blockchain';
import { ObjectId } from 'mongodb';

/**
 * POST /api/wallet/operations
 * Handles various wallet operations:
 * - create: Create a new wallet
 * - restore: Restore a wallet from seed phrase
 * - verify: Verify a seed phrase
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Ensure user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's ID from the session
    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
    }

    // Parse request body
    const { operation, seedPhrase, password, encryptedWallet } = await req.json();

    // Validate required fields based on operation
    if (!operation) {
      return NextResponse.json({ error: 'Operation not specified' }, { status: 400 });
    }

    const db = await getCollection('users');

    // Handle different operations
    switch (operation) {
      case 'create': {
        // Validate required fields
        if (!seedPhrase || !password) {
          return NextResponse.json(
            { error: 'Seed phrase and password are required' },
            { status: 400 }
          );
        }

        // Create wallet from seed phrase
        const wallet = walletService.createWalletFromMnemonic(seedPhrase);
        
        // Encrypt wallet with password
        const encryptedWallet = await walletService.encryptWallet(wallet, password);
        
        // Encrypt seed phrase for recovery
        const encryptedSeedPhrase = walletService.encryptSeedPhrase(seedPhrase, password);

        // Update user record with wallet info
        const result = await db.updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              walletOpen: true,
              publicAddress: wallet.address,
              encryptedWallet: encryptedWallet,
              encryptedSeedPhrase: encryptedSeedPhrase,
              updatedAt: new Date()
            }
          }
        );

        // Also update profile and citizen collections
        const profileDb = await getCollection('profiles');
        await profileDb.updateOne(
          { userId: new ObjectId(userId) },
          {
            $set: {
              walletOpen: true,
              updatedAt: new Date()
            }
          }
        );

        const citizenDb = await getCollection('citizen');
        await citizenDb.updateOne(
          { userId: new ObjectId(userId) },
          {
            $set: {
              publicAddress: wallet.address,
              updatedAt: new Date()
            }
          }
        );

        if (result.modifiedCount === 0) {
          return NextResponse.json(
            { error: 'Failed to update user record' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          address: wallet.address,
          message: 'Wallet created successfully'
        });
      }

      case 'restore': {
        // Validate required fields
        if (!seedPhrase || !password) {
          return NextResponse.json(
            { error: 'Seed phrase and password are required' },
            { status: 400 }
          );
        }

        // Validate seed phrase
        if (!walletService.validateSeedPhrase(seedPhrase)) {
          return NextResponse.json(
            { error: 'Invalid seed phrase' },
            { status: 400 }
          );
        }

        // Create wallet from seed phrase
        const wallet = walletService.createWalletFromMnemonic(seedPhrase);
        
        // Encrypt wallet with password
        const encryptedWallet = await walletService.encryptWallet(wallet, password);
        
        // Encrypt seed phrase for recovery
        const encryptedSeedPhrase = walletService.encryptSeedPhrase(seedPhrase, password);

        // Update user record with wallet info
        const result = await db.updateOne(
          { _id: new ObjectId(userId) },
          {
            $set: {
              walletOpen: true,
              publicAddress: wallet.address,
              encryptedWallet: encryptedWallet,
              encryptedSeedPhrase: encryptedSeedPhrase,
              updatedAt: new Date()
            }
          }
        );

        // Also update profile and citizen collections
        const profileDb = await getCollection('profiles');
        await profileDb.updateOne(
          { userId: new ObjectId(userId) },
          {
            $set: {
              walletOpen: true,
              updatedAt: new Date()
            }
          }
        );

        const citizenDb = await getCollection('citizen');
        await citizenDb.updateOne(
          { userId: new ObjectId(userId) },
          {
            $set: {
              publicAddress: wallet.address,
              updatedAt: new Date()
            }
          }
        );

        if (result.modifiedCount === 0) {
          return NextResponse.json(
            { error: 'Failed to update user record' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          address: wallet.address,
          message: 'Wallet restored successfully'
        });
      }

      case 'verify': {
        // Validate required fields
        if (!seedPhrase) {
          return NextResponse.json(
            { error: 'Seed phrase is required' },
            { status: 400 }
          );
        }

        // Validate the seed phrase
        const isValid = walletService.validateSeedPhrase(seedPhrase);

        return NextResponse.json({
          success: true,
          isValid,
          message: isValid ? 'Seed phrase is valid' : 'Invalid seed phrase'
        });
      }

      case 'unlock': {
        // Validate required fields
        if (!password) {
          return NextResponse.json(
            { error: 'Password is required' },
            { status: 400 }
          );
        }

        // Get user's wallet info
        const user = await db.findOne({ _id: new ObjectId(userId) });
        if (!user || !user.encryptedWallet) {
          return NextResponse.json(
            { error: 'Wallet not found' },
            { status: 404 }
          );
        }

        try {
          // Attempt to decrypt wallet
          const wallet = await walletService.decryptWallet(user.encryptedWallet, password);
          
          return NextResponse.json({
            success: true,
            address: wallet.address,
            message: 'Wallet unlocked successfully'
          });
        } catch (error) {
          return NextResponse.json(
            { error: 'Invalid password' },
            { status: 400 }
          );
        }
      }

      default:
        return NextResponse.json(
          { error: 'Unknown operation' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Wallet operation error:', error);
    return NextResponse.json(
      { error: 'Failed to process wallet operation' },
      { status: 500 }
    );
  }
}