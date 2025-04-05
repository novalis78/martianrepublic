// Initialize MongoDB database for Martian Republic
// Usage: node scripts/init-db.js
// Make sure MONGODB_URI and MONGODB_DB environment variables are set
// or create a .env file in the root directory

const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

async function initializeDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
  }

  const dbName = process.env.MONGODB_DB || 'martianrepublic';
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    
    // Create collections with validators
    console.log('Creating collections...');
    
    // Users collection
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['email', 'fullname'],
          properties: {
            email: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            fullname: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            password: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            emailVerified: {
              bsonType: ['date', 'null', 'bool'],
              description: 'must be a date, boolean or null'
            },
            image: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            citizenStatus: {
              enum: ['newcomer', 'applicant', 'general_public', 'citizen', null],
              description: 'must be one of the enum values or null'
            },
            publicAddress: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            walletOpen: {
              bsonType: ['bool', 'null'],
              description: 'must be a boolean or null'
            },
            encryptedWallet: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            encryptedSeedPhrase: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            }
          }
        }
      }
    });
    
    // Profiles collection
    await db.createCollection('profiles', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId'],
          properties: {
            userId: {
              bsonType: ['string', 'objectId'],
              description: 'must be a string or ObjectId and is required'
            },
            fullname: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            email: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            citizen: {
              bsonType: ['bool', 'null'],
              description: 'must be a boolean or null'
            },
            generalPublic: {
              bsonType: ['bool', 'null'],
              description: 'must be a boolean or null'
            },
            walletOpen: {
              bsonType: ['bool', 'null'],
              description: 'must be a boolean or null'
            },
            hasApplication: {
              bsonType: ['bool', 'null'],
              description: 'must be a boolean or null'
            },
            endorseCount: {
              bsonType: ['int', 'null'],
              description: 'must be an integer or null'
            },
            bio: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            avatarUrl: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            createdAt: {
              bsonType: ['date', 'null'],
              description: 'must be a date or null'
            },
            updatedAt: {
              bsonType: ['date', 'null'],
              description: 'must be a date or null'
            }
          }
        }
      }
    });
    
    // Wallets collection
    await db.createCollection('wallets', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'publicAddress', 'balance'],
          properties: {
            userId: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            publicAddress: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            balance: {
              bsonType: 'number',
              description: 'must be a number and is required'
            },
            createdAt: {
              bsonType: 'date',
              description: 'must be a date'
            }
          }
        }
      }
    });
    
    // Transactions collection
    await db.createCollection('transactions', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'type', 'amount', 'status'],
          properties: {
            userId: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            type: {
              enum: ['send', 'receive'],
              description: 'must be either send or receive'
            },
            amount: {
              bsonType: 'number',
              description: 'must be a number and is required'
            },
            recipientAddress: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            senderAddress: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            status: {
              enum: ['pending', 'confirmed', 'failed'],
              description: 'must be one of the enum values'
            },
            txid: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            memo: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            timestamp: {
              bsonType: 'date',
              description: 'must be a date'
            }
          }
        }
      }
    });
    
    // Proposals collection
    await db.createCollection('proposals', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['title', 'content', 'userId', 'status'],
          properties: {
            title: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            content: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            userId: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            status: {
              enum: ['submitted', 'voting', 'passed', 'rejected', 'closed', 'expired'],
              description: 'must be one of the enum values'
            },
            active: {
              bsonType: 'bool',
              description: 'must be a boolean'
            },
            yesVotes: {
              bsonType: 'int',
              description: 'must be an integer'
            },
            noVotes: {
              bsonType: 'int',
              description: 'must be an integer'
            },
            txid: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            ipfsHash: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            createdAt: {
              bsonType: 'date',
              description: 'must be a date'
            },
            endsAt: {
              bsonType: 'date',
              description: 'must be a date'
            }
          }
        }
      }
    });
    
    // Votes collection
    await db.createCollection('votes', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['proposalId', 'userId', 'vote'],
          properties: {
            proposalId: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            userId: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            vote: {
              enum: ['Y', 'N'],
              description: 'must be either Y or N'
            },
            createdAt: {
              bsonType: 'date',
              description: 'must be a date'
            },
            txid: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            }
          }
        }
      }
    });
    
    // LogEntries collection
    await db.createCollection('logEntries', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'title', 'content'],
          properties: {
            userId: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            title: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            content: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            ipfsHash: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            txid: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            createdAt: {
              bsonType: 'date',
              description: 'must be a date'
            }
          }
        }
      }
    });
    
    // FeedPosts collection
    await db.createCollection('feedPosts', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'content', 'tag'],
          properties: {
            userId: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            content: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            attachmentUrl: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            attachmentType: {
              enum: ['image', 'document', 'link', null],
              description: 'must be one of the enum values or null'
            },
            tag: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            ipfsHash: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            txid: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            createdAt: {
              bsonType: 'date',
              description: 'must be a date'
            }
          }
        }
      }
    });
    
    // Comments collection
    await db.createCollection('comments', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['postId', 'userId', 'content'],
          properties: {
            postId: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            userId: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            content: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            createdAt: {
              bsonType: 'date',
              description: 'must be a date'
            }
          }
        }
      }
    });
    
    // Likes collection
    await db.createCollection('likes', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['postId', 'userId'],
          properties: {
            postId: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            userId: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            createdAt: {
              bsonType: 'date',
              description: 'must be a date'
            }
          }
        }
      }
    });
    
    // Inventory collection
    await db.createCollection('inventory', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'type', 'quantity', 'unit', 'capacity', 'location', 'status'],
          properties: {
            name: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            type: {
              enum: ['consumable', 'equipment', 'material', 'biological'],
              description: 'must be one of the enum values'
            },
            quantity: {
              bsonType: 'number',
              description: 'must be a number and is required'
            },
            unit: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            capacity: {
              bsonType: 'number',
              description: 'must be a number and is required'
            },
            location: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            status: {
              enum: ['normal', 'warning', 'critical', 'surplus'],
              description: 'must be one of the enum values'
            },
            category: {
              bsonType: 'string',
              description: 'must be a string'
            },
            responsiblePerson: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            notes: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            imageUrl: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            lastUpdated: {
              bsonType: 'date',
              description: 'must be a date'
            }
          }
        }
      }
    });
    
    // Locations collection
    await db.createCollection('locations', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'type', 'coordinates', 'description'],
          properties: {
            name: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            type: {
              enum: ['settlement', 'landmark', 'research', 'industrial', 'historical'],
              description: 'must be one of the enum values'
            },
            coordinates: {
              bsonType: 'object',
              required: ['lat', 'lng'],
              properties: {
                lat: {
                  bsonType: 'number',
                  description: 'must be a number and is required'
                },
                lng: {
                  bsonType: 'number',
                  description: 'must be a number and is required'
                }
              }
            },
            description: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            population: {
              bsonType: ['int', 'null'],
              description: 'must be an integer or null'
            },
            established: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            imageUrl: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            }
          }
        }
      }
    });
    
    // Citizen collection
    await db.createCollection('citizen', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId'],
          properties: {
            userId: {
              bsonType: ['string', 'objectId'],
              description: 'must be a string or ObjectId and is required'
            },
            firstName: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            lastName: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            displayName: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            shortBio: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            publicAddress: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            createdAt: {
              bsonType: ['date', 'null'],
              description: 'must be a date or null'
            },
            updatedAt: {
              bsonType: ['date', 'null'],
              description: 'must be a date or null'
            }
          }
        }
      }
    });
    
    // CitizenApplications collection
    await db.createCollection('citizenApplications', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'status', 'submittedAt'],
          properties: {
            userId: {
              bsonType: ['string', 'objectId'],
              description: 'must be a string or ObjectId and is required'
            },
            status: {
              enum: ['pending', 'in_review', 'approved', 'rejected'],
              description: 'must be one of the enum values'
            },
            fullName: {
              bsonType: 'string',
              description: 'must be a string'
            },
            birthdate: {
              bsonType: ['string', 'date', 'null'],
              description: 'must be a string, date or null'
            },
            currentResidence: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            reason: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            skills: {
              bsonType: ['array', 'null'],
              description: 'must be an array or null'
            },
            submittedAt: {
              bsonType: 'date',
              description: 'must be a date'
            },
            lastUpdated: {
              bsonType: ['date', 'null'],
              description: 'must be a date or null'
            },
            reviewedBy: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            notes: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            }
          }
        }
      }
    });
    
    // Notifications collection
    await db.createCollection('notifications', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'type', 'title', 'timestamp'],
          properties: {
            userId: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            type: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            title: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            content: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            relatedId: {
              bsonType: ['string', 'null'],
              description: 'must be a string or null'
            },
            timestamp: {
              bsonType: 'date',
              description: 'must be a date'
            },
            read: {
              bsonType: 'bool',
              description: 'must be a boolean'
            }
          }
        }
      }
    });
    
    // Create indexes
    console.log('Creating indexes...');
    
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('profiles').createIndex({ userId: 1 }, { unique: true });
    await db.collection('wallets').createIndex({ userId: 1 }, { unique: true });
    await db.collection('wallets').createIndex({ publicAddress: 1 }, { unique: true });
    await db.collection('transactions').createIndex({ userId: 1 });
    await db.collection('transactions').createIndex({ txid: 1 }, { sparse: true });
    await db.collection('proposals').createIndex({ userId: 1 });
    await db.collection('proposals').createIndex({ status: 1 });
    await db.collection('votes').createIndex({ proposalId: 1, userId: 1 }, { unique: true });
    await db.collection('logEntries').createIndex({ userId: 1 });
    await db.collection('feedPosts').createIndex({ userId: 1 });
    await db.collection('feedPosts').createIndex({ tag: 1 });
    await db.collection('comments').createIndex({ postId: 1 });
    await db.collection('likes').createIndex({ postId: 1, userId: 1 }, { unique: true });
    await db.collection('inventory').createIndex({ type: 1 });
    await db.collection('inventory').createIndex({ location: 1 });
    await db.collection('inventory').createIndex({ status: 1 });
    await db.collection('locations').createIndex({ type: 1 });
    await db.collection('citizenApplications').createIndex({ userId: 1 }, { unique: true });
    await db.collection('notifications').createIndex({ userId: 1 });
    await db.collection('notifications').createIndex({ userId: 1, read: 1 });
    
    console.log('Database initialized successfully');
    
    // Insert demo admin user
    const now = new Date();
    const adminUser = {
      email: 'admin@martianrepublic.org',
      fullname: 'Admin User',
      emailVerified: now,
      image: null,
      citizenStatus: 'citizen',
      password: '$2b$10$sU5Mb0LZh3.TgV3FSaTSxuhOJ502osWKPwdXOK7G4mAV3EIy1Y6l6', // hashed 'password123'
      walletOpen: true,
      publicAddress: '0x12345678901234567890123456789012',
      createdAt: now,
      updatedAt: now,
      signedEula: true,
      termsAccepted: now
    };
    
    const existingAdmin = await db.collection('users').findOne({ email: adminUser.email });
    if (!existingAdmin) {
      const result = await db.collection('users').insertOne(adminUser);
      console.log('Demo admin user created');
      
      // Create related profile and wallet
      const adminId = result.insertedId;
      
      await db.collection('profiles').insertOne({
        userId: adminId,
        fullname: 'Admin User',
        email: 'admin@martianrepublic.org',
        citizen: true,
        generalPublic: false,
        walletOpen: true,
        hasApplication: false,
        endorseCount: 0,
        bio: 'Administrator of the Martian Republic',
        avatarUrl: null,
        createdAt: now,
        updatedAt: now
      });
      
      await db.collection('citizen').insertOne({
        userId: adminId,
        firstName: 'Admin',
        lastName: 'User',
        displayName: 'Admin User',
        shortBio: 'Administrator of the Martian Republic',
        publicAddress: '0x12345678901234567890123456789012',
        createdAt: now,
        updatedAt: now
      });
      
      await db.collection('wallets').insertOne({
        userId: adminId.toString(),
        publicAddress: '0x12345678901234567890123456789012',
        balance: 1000,
        createdAt: now
      });
      
      console.log('Demo admin profile, citizen record, and wallet created');
    } else {
      console.log('Demo admin user already exists');
    }
    
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

initializeDatabase().catch(console.error);