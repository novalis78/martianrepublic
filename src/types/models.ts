// User model
export interface User {
  id: string;
  email: string;
  fullname: string;
  emailVerified?: Date;
}

// Profile model
export interface Profile {
  id: string;
  userId: string;
  citizen: boolean;
  generalPublic: boolean;
  civicWalletOpen: boolean;
  bio?: string;
  avatarUrl?: string;
}

// Proposal model
export interface Proposal {
  id: string;
  title: string;
  content: string;
  userId: string;
  status: 'submitted' | 'voting' | 'passed' | 'rejected' | 'closed' | 'expired';
  active: boolean;
  yesVotes: number;
  noVotes: number;
  txid?: string;
  ipfsHash?: string;
  createdAt: Date;
  endsAt: Date;
  discussionId?: string;
}

// Vote model
export interface Vote {
  id: string;
  proposalId: string;
  userId: string;
  vote: 'Y' | 'N';
  createdAt: Date;
  txid?: string;
}

// Wallet model
export interface CivicWallet {
  id: string;
  userId: string;
  publicAddress: string;
  balance: number;
  createdAt: Date;
}

// LogEntry model
export interface LogEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  ipfsHash?: string;
  txid?: string;
  createdAt: Date;
}

// Feed model
export interface FeedItem {
  id: string;
  userId: string;
  content: string;
  txid?: string;
  ipfsHash?: string;
  tag: string;
  createdAt: Date;
}