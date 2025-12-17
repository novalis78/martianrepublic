import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { getProposalsCollection, getVotesCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is a citizen (only citizens can vote)
    if (session.user.citizenStatus !== 'citizen') {
      return NextResponse.json(
        { error: 'Only citizens can vote on proposals' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { proposalId, vote } = body;

    // Validate input
    if (!proposalId || !vote) {
      return NextResponse.json(
        { error: 'Proposal ID and vote are required' },
        { status: 400 }
      );
    }

    // Validate vote value
    if (!['Y', 'N', 'A'].includes(vote)) {
      return NextResponse.json(
        { error: 'Vote must be Y (yes), N (no), or A (abstain)' },
        { status: 400 }
      );
    }

    const proposalsCollection = await getProposalsCollection();
    const votesCollection = await getVotesCollection();

    // Check if proposal exists and is in voting status
    const proposal = await proposalsCollection.findOne({
      _id: new ObjectId(proposalId),
    });

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal not found' },
        { status: 404 }
      );
    }

    if (proposal.status !== 'voting' && proposal.status !== 'submitted') {
      return NextResponse.json(
        { error: 'This proposal is not currently accepting votes' },
        { status: 400 }
      );
    }

    // Check if proposal has expired
    if (proposal.expiresAt && new Date(proposal.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'This proposal has expired' },
        { status: 400 }
      );
    }

    const userId = new ObjectId(session.user.id);

    // Check if user has already voted
    const existingVote = await votesCollection.findOne({
      proposalId: new ObjectId(proposalId),
      userId,
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted on this proposal' },
        { status: 400 }
      );
    }

    // Record the vote
    const now = new Date();
    const newVote = {
      proposalId: new ObjectId(proposalId),
      userId,
      vote,
      txid: null, // Will be set after blockchain anchoring
      mined: null,
      block: null,
      createdAt: now,
    };

    await votesCollection.insertOne(newVote);

    // Update proposal vote counts
    const updateField = vote === 'Y' ? 'yesVotes' : vote === 'N' ? 'noVotes' : 'abstainVotes';
    await proposalsCollection.updateOne(
      { _id: new ObjectId(proposalId) },
      {
        $inc: { [updateField]: 1 },
        $set: {
          status: 'voting', // Ensure status is voting once first vote is cast
          updatedAt: now
        }
      }
    );

    // Get updated vote counts
    const voteCounts = await votesCollection.aggregate([
      { $match: { proposalId: new ObjectId(proposalId) } },
      {
        $group: {
          _id: '$vote',
          count: { $sum: 1 },
        },
      },
    ]).toArray();

    const yesCount = voteCounts.find(v => v._id === 'Y')?.count || 0;
    const noCount = voteCounts.find(v => v._id === 'N')?.count || 0;
    const abstainCount = voteCounts.find(v => v._id === 'A')?.count || 0;
    const totalVotes = yesCount + noCount + abstainCount;

    return NextResponse.json({
      success: true,
      message: 'Vote recorded successfully',
      vote: {
        proposalId,
        vote,
        createdAt: now,
      },
      counts: {
        yesVotes: yesCount,
        noVotes: noCount,
        abstainVotes: abstainCount,
        totalVotes,
        yesPercent: totalVotes > 0 ? Math.round((yesCount / totalVotes) * 100) : 0,
        noPercent: totalVotes > 0 ? Math.round((noCount / totalVotes) * 100) : 0,
      },
    });
  } catch (error) {
    console.error('Error recording vote:', error);
    return NextResponse.json(
      { error: 'Failed to record vote' },
      { status: 500 }
    );
  }
}

// Get user's vote for a specific proposal
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const proposalId = searchParams.get('proposalId');

    if (!proposalId) {
      return NextResponse.json(
        { error: 'Proposal ID is required' },
        { status: 400 }
      );
    }

    const votesCollection = await getVotesCollection();

    const userVote = await votesCollection.findOne({
      proposalId: new ObjectId(proposalId),
      userId: new ObjectId(session.user.id),
    });

    return NextResponse.json({
      hasVoted: !!userVote,
      vote: userVote?.vote || null,
      votedAt: userVote?.createdAt || null,
    });
  } catch (error) {
    console.error('Error fetching user vote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vote' },
      { status: 500 }
    );
  }
}
