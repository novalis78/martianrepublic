import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/auth-options';
import { connectToDatabase, getProposalsCollection, getVotesCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Default proposals for when database is empty (seeding)
const DEFAULT_PROPOSALS = [
  {
    title: 'Martian Bill of Rights',
    content: 'This proposal establishes fundamental rights for all Martian citizens including freedom of speech, assembly, and digital privacy.',
    description: 'A foundational document ensuring basic liberties for all citizens of the Martian Republic.',
    category: 'constitutional',
    status: 'voting',
    active: true,
    duration: 30,
    threshold: 66,
    participation: 25,
    createdAt: new Date('2025-03-01'),
    expiresAt: new Date('2025-04-01'),
  },
  {
    title: 'Resource Allocation Framework',
    content: 'This proposal defines how shared resources like water, energy, and habitation space are distributed among citizens.',
    description: 'Establishes fair distribution of limited Martian resources.',
    category: 'economic',
    status: 'voting',
    active: true,
    duration: 14,
    threshold: 51,
    participation: 20,
    createdAt: new Date('2025-03-10'),
    expiresAt: new Date('2025-03-24'),
  },
  {
    title: 'Emergency Protocol Act',
    content: 'Establishes procedures for handling colony emergencies including habitat breaches, medical crises, and resource shortages.',
    description: 'Critical safety procedures for the colony.',
    category: 'safety',
    status: 'passed',
    active: false,
    duration: 7,
    threshold: 51,
    participation: 30,
    createdAt: new Date('2025-02-01'),
    expiresAt: new Date('2025-02-08'),
  },
];

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const proposalsCollection = await getProposalsCollection();
    const votesCollection = await getVotesCollection();

    // Build query filter
    const filter: Record<string, any> = {};
    if (status) {
      filter.status = status;
    }
    if (category) {
      filter.category = category;
    }

    // Check if we have any proposals, if not seed with defaults
    const count = await proposalsCollection.countDocuments({});
    if (count === 0) {
      // Seed default proposals
      await proposalsCollection.insertMany(DEFAULT_PROPOSALS.map(p => ({
        ...p,
        userId: null,
        ipfsHash: null,
        txid: null,
        yesVotes: Math.floor(Math.random() * 50) + 10,
        noVotes: Math.floor(Math.random() * 30) + 5,
        abstainVotes: Math.floor(Math.random() * 10),
      })));
    }

    // Fetch proposals with pagination
    const proposals = await proposalsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .toArray();

    // Get vote counts for each proposal
    const proposalsWithVotes = await Promise.all(
      proposals.map(async (proposal) => {
        // Count votes from votes collection if available
        const voteCounts = await votesCollection.aggregate([
          { $match: { proposalId: proposal._id } },
          {
            $group: {
              _id: '$vote',
              count: { $sum: 1 },
            },
          },
        ]).toArray();

        // Calculate vote percentages
        const yesCount = voteCounts.find(v => v._id === 'Y')?.count || proposal.yesVotes || 0;
        const noCount = voteCounts.find(v => v._id === 'N')?.count || proposal.noVotes || 0;
        const abstainCount = voteCounts.find(v => v._id === 'A')?.count || proposal.abstainVotes || 0;
        const totalVotes = yesCount + noCount + abstainCount;

        return {
          id: proposal._id.toString(),
          title: proposal.title,
          content: proposal.content,
          description: proposal.description,
          category: proposal.category || 'general',
          status: proposal.status,
          active: proposal.active,
          duration: proposal.duration,
          threshold: proposal.threshold,
          participation: proposal.participation,
          yesVotes: yesCount,
          noVotes: noCount,
          abstainVotes: abstainCount,
          totalVotes,
          yesPercent: totalVotes > 0 ? Math.round((yesCount / totalVotes) * 100) : 0,
          noPercent: totalVotes > 0 ? Math.round((noCount / totalVotes) * 100) : 0,
          createdAt: proposal.createdAt,
          expiresAt: proposal.expiresAt,
          ipfsHash: proposal.ipfsHash,
          txid: proposal.txid,
        };
      })
    );

    const totalCount = await proposalsCollection.countDocuments(filter);

    return NextResponse.json({
      proposals: proposalsWithVotes,
      total: totalCount,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is a citizen (only citizens can create proposals)
    if (session.user.citizenStatus !== 'citizen') {
      return NextResponse.json(
        { error: 'Only citizens can create proposals' },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Validate the proposal data
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const proposalsCollection = await getProposalsCollection();

    // Default duration is 14 days
    const duration = body.duration || 14;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);

    const newProposal = {
      userId: new ObjectId(session.user.id),
      title: body.title,
      content: body.content,
      description: body.description || body.content.substring(0, 200),
      category: body.category || 'general',
      status: 'submitted',
      active: true,
      duration,
      threshold: body.threshold || 51, // Default simple majority
      participation: body.participation || 20, // Default 20% participation required
      yesVotes: 0,
      noVotes: 0,
      abstainVotes: 0,
      ipfsHash: null, // Will be set after IPFS upload
      txid: null, // Will be set after blockchain anchoring
      createdAt: now,
      expiresAt,
      updatedAt: now,
    };

    const result = await proposalsCollection.insertOne(newProposal);

    return NextResponse.json({
      success: true,
      proposal: {
        id: result.insertedId.toString(),
        ...newProposal,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to create proposal' },
      { status: 500 }
    );
  }
}