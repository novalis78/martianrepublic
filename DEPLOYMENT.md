# Martian Republic - Deployment Guide

This guide explains how to deploy the Martian Republic application to Vercel with a MongoDB Atlas database.

## Prerequisites

- GitHub account
- Vercel account (https://vercel.com)
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- Node.js 18+ installed locally

## 1. Set Up MongoDB Atlas

1. Log in to MongoDB Atlas or create a new account
2. Create a new project (e.g., "Martian Republic")
3. Create a new cluster:
   - Choose the free tier option (M0)
   - Select a cloud provider and region close to your target users
   - Name your cluster (e.g., "martian-republic-prod")

4. Once the cluster is created, set up a database user:
   - Go to "Database Access" under Security
   - Click "Add New Database User"
   - Create a username and a secure password
   - Set appropriate permissions (e.g., "Read and Write to Any Database")
   - Save the user

5. Configure network access:
   - Go to "Network Access" under Security
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (for simplicity) or add specific IPs
   - Click "Confirm"

6. Get your MongoDB connection string:
   - Go to "Databases"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (replace `<password>` with your database user's password)

## 2. Prepare Your Project for Deployment

1. Make sure your project is in a GitHub repository.

2. Create a `.env.local` file for local development (do not commit this file):

```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
MONGODB_DB=martianrepublic
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-nextauth-secret
```

3. Create a `.env.example` file for reference (this can be committed):

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
MONGODB_DB=martianrepublic
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=random-string
```

4. Make sure your `next.config.js` includes any necessary environment variables:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['example.com'], // Add domains for external images if needed
  },
  env: {
    MONGODB_DB: process.env.MONGODB_DB,
  },
}

module.exports = nextConfig
```

## 3. Deploy to Vercel

1. Push your code to GitHub if you haven't already.

2. Log in to [Vercel](https://vercel.com).

3. Click "Import Project" and select your GitHub repository.

4. Configure the project:
   - The framework preset should automatically be detected as Next.js
   - Set the root directory if your project is not in the root of the repository
   - Configure the build command if different from the default (usually this is fine)

5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `MONGODB_DB`: The name of your database (e.g., `martianrepublic`)
   - `NEXTAUTH_URL`: The URL of your deployed app (e.g., `https://martianrepublic.vercel.app`)
   - `NEXTAUTH_SECRET`: A secure random string for NextAuth session encryption

6. Click "Deploy" and wait for the deployment to complete.

## 4. Post-Deployment Setup

### Initialize Database Collections

You might need to set up initial database collections. This can be done by:

1. Creating a script to initialize the database:

```js
// scripts/init-db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function initializeDatabase() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'martianrepublic';
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    
    // Create collections with validators
    await db.createCollection('users', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['email', 'name'],
          properties: {
            email: {
              bsonType: 'string',
              description: 'must be a string and is required'
            },
            name: {
              bsonType: 'string',
              description: 'must be a string and is required'
            }
          }
        }
      }
    });
    
    // Create other collections...
    
    // Create indexes
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await client.close();
  }
}

initializeDatabase().catch(console.error);
```

2. Run the script locally with your production database URL:

```bash
node scripts/init-db.js
```

### Set Up Automatic Deployments

Vercel automatically deploys when you push to the main branch of your repository. For more advanced deployment workflows:

1. Configure branch deployments in Vercel project settings
2. Set up preview deployments for pull requests
3. Configure domain settings if you have a custom domain

## 5. Monitoring and Maintenance

### Vercel Monitoring

- Use Vercel's dashboard to monitor deployments and performance
- Set up Slack or email notifications for failed deployments

### MongoDB Monitoring

- Use MongoDB Atlas monitoring to track database performance
- Set up alerts for high CPU/memory usage
- Regularly back up your database (enabled by default in Atlas)

### Application Monitoring

- Consider adding an application monitoring solution like Sentry or LogRocket
- Set up custom logging to track application errors

## 6. Additional Configurations

### Enable CORS (If Needed)

If you're building a separate mobile app that will access your API:

1. Install CORS package:
```bash
npm install cors
```

2. Create a CORS middleware in your API routes:
```js
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only run on /api/*
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Origin', '*'); // Change in production
  response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

### Set Up Scheduled Tasks

For tasks like:
- Processing proposal voting results
- Sending daily notifications
- Backing up important data to IPFS

Use Vercel Cron Jobs or an external service like GitHub Actions for scheduled tasks.

## 7. Testing the Deployment

After deployment, test all critical paths in your application:

1. User registration and login
2. Wallet transactions
3. Citizenship application
4. Congress proposals and voting
5. Feed posts and comments
6. Inventory management
7. Mars map and location exploration

## 8. Mobile App Setup

If you're building a mobile app to connect to your API:

1. Update your API to support mobile authentication flows
2. Create mobile-specific API endpoints in `/api/mobile/`
3. Configure CORS to allow your mobile app's requests
4. Implement a client SDK for your API to use in mobile apps

## 9. Troubleshooting

### Common Issues

1. **MongoDB Connection Errors**
   - Check that your MongoDB connection string is correct
   - Make sure network access is properly configured
   - Verify the database user has correct permissions

2. **Authentication Issues**
   - Check NEXTAUTH_URL and NEXTAUTH_SECRET settings
   - Ensure session storage is properly configured

3. **API Errors**
   - Check Vercel logs for API route errors
   - Verify API routes are handling exceptions properly

### Getting Help

If you encounter issues, check the following resources:

- Next.js documentation: https://nextjs.org/docs
- Vercel documentation: https://vercel.com/docs
- MongoDB Atlas documentation: https://docs.atlas.mongodb.com
- NextAuth.js documentation: https://next-auth.js.org/getting-started/introduction