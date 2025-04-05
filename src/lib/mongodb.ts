import { MongoClient, Db, Collection, ObjectId, Document } from 'mongodb';

// Define a type for the connection
interface MongoConnection {
  client: MongoClient;
  db: Db;
}

// Connection URI (to be set in environment variables)
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'martianrepublic';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Connect to MongoDB and return the client and database
 */
export async function connectToDatabase(): Promise<MongoConnection> {
  // If we already have a connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Connect to the MongoDB server
    const client = new MongoClient(uri);
    await client.connect();
    
    // Get the database
    const db = client.db(dbName);

    // Cache the connection
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Helper to safely convert user IDs to MongoDB queries
 * 
 * @param userId The user ID from the session
 * @returns A MongoDB query object
 */
export function getUserIdQuery(userId: string) {
  try {
    // MongoDB ObjectId is always a 24-character hexadecimal string
    if (userId && userId.length === 24 && /^[0-9a-fA-F]{24}$/.test(userId)) {
      return { _id: new ObjectId(userId) };
    }
  } catch {
    console.log("ID not valid for ObjectId conversion:", userId);
  }
  
  // If userId isn't a valid ObjectId but exists, use it as a string ID
  if (userId) {
    return { _id: userId };
  }
  
  // Fallback
  return { _id: null };
}

/**
 * Helper to safely convert any ID to ObjectId
 * 
 * @param id Any ID string
 * @returns MongoDB ObjectId or the original string if not valid
 */
export function toObjectId(id: string) {
  try {
    if (id && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
      return new ObjectId(id);
    }
  } catch {
    console.log("ID not valid for ObjectId conversion:", id);
  }
  return id;
}

// Collection helpers
export async function getCollection<T extends Document = Document>(name: string): Promise<Collection<T>> {
  const { db } = await connectToDatabase();
  return db.collection<T>(name);
}

// Standard collections
export async function getUsersCollection() {
  return getCollection('users');
}

export async function getProfilesCollection() {
  return getCollection('profiles');
}

export async function getWalletsCollection() {
  return getCollection('wallets');
}

export async function getTransactionsCollection() {
  return getCollection('transactions');
}

export async function getProposalsCollection() {
  return getCollection('proposals');
}

export async function getVotesCollection() {
  return getCollection('votes');
}

export async function getLogEntriesCollection() {
  return getCollection('logEntries');
}

export async function getFeedPostsCollection() {
  return getCollection('feedPosts');
}

export async function getCommentsCollection() {
  return getCollection('comments');
}

export async function getLikesCollection() {
  return getCollection('likes');
}

export async function getInventoryCollection() {
  return getCollection('inventory');
}

export async function getLocationsCollection() {
  return getCollection('locations');
}

export async function getCitizenApplicationsCollection() {
  return getCollection('citizenApplications');
}

export async function getNotificationsCollection() {
  return getCollection('notifications');
}