# Martian Republic API Documentation

This document provides details about the API endpoints available in the Martian Republic system. These endpoints support both web and mobile clients.

## Authentication

All authenticated endpoints require a valid JWT token provided in the Authorization header:

```
Authorization: Bearer {token}
```

### Authentication Endpoints

#### POST /api/auth/sign-in
Authenticates a user and returns a JWT token.

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "citizenStatus": "citizen"
  },
  "token": "jwt_token_here"
}
```

#### POST /api/auth/register
Registers a new user.

Request:
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id": "new_user_id",
    "name": "New User",
    "email": "newuser@example.com",
    "citizenStatus": "newcomer"
  },
  "token": "jwt_token_here"
}
```

## User Endpoints

#### GET /api/user/profile
Returns the current user's profile.

Response:
```json
{
  "id": "user_id",
  "name": "User Name",
  "email": "user@example.com",
  "citizenStatus": "citizen",
  "profile": {
    "bio": "User bio here",
    "avatarUrl": "https://example.com/avatar.jpg",
    "joinedAt": "2025-01-01T00:00:00Z"
  }
}
```

#### PUT /api/user/profile
Updates the current user's profile.

Request:
```json
{
  "name": "Updated Name",
  "bio": "Updated bio",
  "avatarUrl": "https://example.com/updated-avatar.jpg"
}
```

Response:
```json
{
  "id": "user_id",
  "name": "Updated Name",
  "email": "user@example.com",
  "citizenStatus": "citizen",
  "profile": {
    "bio": "Updated bio",
    "avatarUrl": "https://example.com/updated-avatar.jpg",
    "joinedAt": "2025-01-01T00:00:00Z"
  }
}
```

## Wallet Endpoints

#### GET /api/wallet/balance
Returns the user's wallet balance.

Response:
```json
{
  "id": "wallet_id",
  "balance": 100.5,
  "publicAddress": "0x123abc...",
  "lastUpdated": "2025-04-01T12:00:00Z"
}
```

#### POST /api/wallet/send
Sends Marscoins to another user.

Request:
```json
{
  "recipientAddress": "0x456def...",
  "amount": 10.5,
  "memo": "Payment for services"
}
```

Response:
```json
{
  "txid": "0x789ghi...",
  "status": "pending",
  "timestamp": "2025-04-05T14:30:00Z",
  "amount": 10.5,
  "fee": 0.001,
  "recipientAddress": "0x456def..."
}
```

#### GET /api/wallet/transactions
Returns the user's transaction history.

Query Parameters:
- `limit`: Maximum number of transactions to return (default: 20)
- `offset`: Number of transactions to skip (default: 0)
- `type`: Filter by transaction type (send, receive, all)

Response:
```json
{
  "total": 45,
  "transactions": [
    {
      "id": "tx_id_1",
      "txid": "0x789ghi...",
      "type": "send",
      "amount": 10.5,
      "fee": 0.001,
      "recipientAddress": "0x456def...",
      "status": "confirmed",
      "timestamp": "2025-04-05T14:30:00Z",
      "confirmations": 6,
      "memo": "Payment for services"
    },
    {
      "id": "tx_id_2",
      "txid": "0xabc123...",
      "type": "receive",
      "amount": 5.25,
      "senderAddress": "0x789jkl...",
      "status": "confirmed",
      "timestamp": "2025-04-03T09:15:00Z",
      "confirmations": 15,
      "memo": "Monthly stipend"
    }
  ]
}
```

## Citizen Endpoints

#### GET /api/citizen/status
Returns the user's citizenship status.

Response:
```json
{
  "status": "citizen",
  "since": "2025-02-15T00:00:00Z",
  "rights": [
    "voting",
    "property",
    "representation"
  ],
  "idCardNumber": "MR-C-12345"
}
```

#### POST /api/citizen/apply
Submits a citizenship application.

Request:
```json
{
  "fullName": "Applicant Name",
  "birthdate": "1990-01-01",
  "currentResidence": "Earth, North America",
  "reason": "I want to contribute to Mars colonization",
  "skills": ["Engineering", "Agriculture"],
  "references": ["ref_user_id_1", "ref_user_id_2"]
}
```

Response:
```json
{
  "applicationId": "app_id",
  "status": "pending",
  "submittedAt": "2025-04-05T16:45:00Z",
  "estimatedReviewCompletion": "2025-04-20T00:00:00Z"
}
```

#### GET /api/citizen/application
Gets the status of the user's citizenship application.

Response:
```json
{
  "applicationId": "app_id",
  "status": "in_review",
  "submittedAt": "2025-04-05T16:45:00Z",
  "lastUpdated": "2025-04-10T09:30:00Z",
  "currentStage": "background_check",
  "estimatedCompletion": "2025-04-20T00:00:00Z",
  "notes": "Application proceeding normally."
}
```

## Congress Endpoints

#### GET /api/congress/proposals
Returns a list of proposals in the Martian Congress.

Query Parameters:
- `status`: Filter by status (active, passed, rejected, all)
- `limit`: Maximum number of proposals to return (default: 20)
- `offset`: Number of proposals to skip (default: 0)

Response:
```json
{
  "total": 156,
  "proposals": [
    {
      "id": "prop_id_1",
      "title": "Water Conservation Initiative",
      "summary": "Short summary here",
      "status": "active",
      "proposedBy": {
        "id": "user_id_1",
        "name": "Proposer Name"
      },
      "submittedAt": "2025-04-01T10:00:00Z",
      "votingEndsAt": "2025-04-15T10:00:00Z",
      "yesVotes": 42,
      "noVotes": 18,
      "userHasVoted": false
    },
    {
      "id": "prop_id_2",
      "title": "Solar Panel Expansion",
      "summary": "Short summary here",
      "status": "passed",
      "proposedBy": {
        "id": "user_id_2",
        "name": "Another Proposer"
      },
      "submittedAt": "2025-03-15T14:30:00Z",
      "votingEndedAt": "2025-03-29T14:30:00Z",
      "yesVotes": 65,
      "noVotes": 12,
      "userHasVoted": true,
      "userVote": "yes"
    }
  ]
}
```

#### GET /api/congress/proposals/:id
Returns details about a specific proposal.

Response:
```json
{
  "id": "prop_id_1",
  "title": "Water Conservation Initiative",
  "content": "Full proposal content here...",
  "status": "active",
  "proposedBy": {
    "id": "user_id_1",
    "name": "Proposer Name"
  },
  "submittedAt": "2025-04-01T10:00:00Z",
  "votingEndsAt": "2025-04-15T10:00:00Z",
  "yesVotes": 42,
  "noVotes": 18,
  "userHasVoted": false,
  "discussions": [
    {
      "id": "disc_id_1",
      "userId": "user_id_3",
      "userName": "Commenter Name",
      "content": "Comment content here",
      "timestamp": "2025-04-02T15:20:00Z"
    }
  ],
  "amendments": [
    {
      "id": "amend_id_1",
      "content": "Amendment content",
      "proposedAt": "2025-04-03T11:00:00Z",
      "status": "pending"
    }
  ],
  "blockchain": {
    "txid": "0xdef456...",
    "ipfsHash": "QmHash..."
  }
}
```

#### POST /api/congress/proposals
Creates a new proposal.

Request:
```json
{
  "title": "New Proposal Title",
  "content": "Full proposal content here...",
  "summary": "Short summary for listing"
}
```

Response:
```json
{
  "id": "new_prop_id",
  "title": "New Proposal Title",
  "status": "active",
  "submittedAt": "2025-04-05T17:30:00Z",
  "votingEndsAt": "2025-04-19T17:30:00Z"
}
```

#### POST /api/congress/proposals/:id/vote
Votes on a proposal.

Request:
```json
{
  "vote": "yes" // or "no"
}
```

Response:
```json
{
  "proposalId": "prop_id",
  "vote": "yes",
  "timestamp": "2025-04-05T18:00:00Z",
  "newTotals": {
    "yesVotes": 43,
    "noVotes": 18
  }
}
```

## Feed Endpoints

#### GET /api/feed
Returns feed posts.

Query Parameters:
- `limit`: Maximum number of posts to return (default: 20)
- `offset`: Number of posts to skip (default: 0)
- `tag`: Filter by tag (optional)

Response:
```json
{
  "total": 250,
  "posts": [
    {
      "id": "post_id_1",
      "userId": "user_id_1",
      "userName": "Post Author",
      "userAvatar": "https://example.com/avatar.jpg",
      "content": "Post content here...",
      "attachmentUrl": "https://example.com/image.jpg",
      "attachmentType": "image",
      "likesCount": 24,
      "commentsCount": 5,
      "isLikedByUser": false,
      "tag": "infrastructure",
      "createdAt": "2025-04-03T14:32:00Z",
      "txid": "0x7a9f8e7d...",
      "ipfsHash": "Qm7a9f8e7d..."
    }
  ]
}
```

#### POST /api/feed
Creates a new feed post.

Request:
```json
{
  "content": "New post content...",
  "attachmentUrl": "https://example.com/attachment.jpg",
  "attachmentType": "image",
  "tag": "community"
}
```

Response:
```json
{
  "id": "new_post_id",
  "userId": "user_id",
  "userName": "Post Author",
  "userAvatar": "https://example.com/avatar.jpg",
  "content": "New post content...",
  "attachmentUrl": "https://example.com/attachment.jpg",
  "attachmentType": "image",
  "likesCount": 0,
  "commentsCount": 0,
  "isLikedByUser": false,
  "tag": "community",
  "createdAt": "2025-04-05T18:30:00Z",
  "txid": "0xnew_txid...",
  "ipfsHash": "QmNewHash..."
}
```

#### GET /api/feed/:id
Returns a specific feed post with comments.

Response:
```json
{
  "post": {
    "id": "post_id_1",
    "userId": "user_id_1",
    "userName": "Post Author",
    "userAvatar": "https://example.com/avatar.jpg",
    "content": "Post content here...",
    "attachmentUrl": "https://example.com/image.jpg",
    "attachmentType": "image",
    "likesCount": 24,
    "commentsCount": 5,
    "isLikedByUser": false,
    "tag": "infrastructure",
    "createdAt": "2025-04-03T14:32:00Z",
    "txid": "0x7a9f8e7d...",
    "ipfsHash": "Qm7a9f8e7d..."
  },
  "comments": [
    {
      "id": "comment_id_1",
      "userId": "user_id_2",
      "userName": "Commenter Name",
      "userAvatar": "https://example.com/commenter.jpg",
      "content": "Comment content here...",
      "createdAt": "2025-04-03T15:10:00Z"
    }
  ]
}
```

#### POST /api/feed/:id/comments
Adds a comment to a feed post.

Request:
```json
{
  "content": "New comment content..."
}
```

Response:
```json
{
  "id": "new_comment_id",
  "userId": "user_id",
  "userName": "Commenter Name",
  "userAvatar": "https://example.com/avatar.jpg",
  "content": "New comment content...",
  "createdAt": "2025-04-05T19:00:00Z"
}
```

#### POST /api/feed/:id/like
Likes or unlikes a feed post.

Request:
```json
{
  "action": "like" // or "unlike"
}
```

Response:
```json
{
  "postId": "post_id",
  "isLiked": true,
  "likesCount": 25
}
```

## Logbook Endpoints

#### GET /api/logbook
Returns the user's logbook entries.

Query Parameters:
- `limit`: Maximum number of entries to return (default: 20)
- `offset`: Number of entries to skip (default: 0)
- `type`: Filter by entry type (optional)

Response:
```json
{
  "total": 35,
  "entries": [
    {
      "id": "entry_id_1",
      "userId": "user_id",
      "title": "Entry Title",
      "content": "Entry content here...",
      "type": "research",
      "createdAt": "2025-04-01T10:15:00Z",
      "ipfsHash": "QmEntryHash...",
      "txid": "0xentry_txid..."
    }
  ]
}
```

#### POST /api/logbook
Creates a new logbook entry.

Request:
```json
{
  "title": "New Entry Title",
  "content": "Entry content here...",
  "type": "research",
  "attachments": [
    {
      "url": "https://example.com/attachment.jpg",
      "type": "image",
      "name": "Research Image"
    }
  ]
}
```

Response:
```json
{
  "id": "new_entry_id",
  "userId": "user_id",
  "title": "New Entry Title",
  "content": "Entry content here...",
  "type": "research",
  "createdAt": "2025-04-05T19:30:00Z",
  "ipfsHash": "QmNewEntryHash...",
  "txid": "0xnew_entry_txid..."
}
```

## Inventory Endpoints

#### GET /api/inventory
Returns inventory resources.

Query Parameters:
- `limit`: Maximum number of resources to return (default: 20)
- `offset`: Number of resources to skip (default: 0)
- `type`: Filter by resource type (optional)
- `location`: Filter by location (optional)
- `status`: Filter by status (optional)

Response:
```json
{
  "total": 150,
  "resources": [
    {
      "id": "resource_id_1",
      "name": "Water",
      "type": "consumable",
      "quantity": 750,
      "unit": "L",
      "capacity": 1000,
      "location": "Habitat Module A",
      "status": "normal",
      "lastUpdated": "2025-04-03T00:00:00Z",
      "category": "life-support",
      "responsiblePerson": "Sarah Miller",
      "notes": "Daily consumption rate: ~25L. Recycling system operating at 97% efficiency.",
      "imageUrl": "https://example.com/water-tank.jpg"
    }
  ]
}
```

#### POST /api/inventory
Adds a new resource to inventory.

Request:
```json
{
  "name": "New Resource",
  "type": "equipment",
  "quantity": 5,
  "unit": "units",
  "capacity": 10,
  "location": "Storage Bay",
  "category": "equipment",
  "responsiblePerson": "John Chen",
  "notes": "New equipment notes",
  "imageUrl": "https://example.com/equipment.jpg"
}
```

Response:
```json
{
  "id": "new_resource_id",
  "name": "New Resource",
  "type": "equipment",
  "quantity": 5,
  "unit": "units",
  "capacity": 10,
  "location": "Storage Bay",
  "status": "normal",
  "lastUpdated": "2025-04-05T20:00:00Z",
  "category": "equipment",
  "responsiblePerson": "John Chen",
  "notes": "New equipment notes",
  "imageUrl": "https://example.com/equipment.jpg"
}
```

#### PUT /api/inventory/:id
Updates an inventory resource.

Request:
```json
{
  "quantity": 4,
  "notes": "Updated notes with usage information"
}
```

Response:
```json
{
  "id": "resource_id",
  "name": "Resource Name",
  "quantity": 4,
  "status": "normal",
  "lastUpdated": "2025-04-05T20:15:00Z",
  "notes": "Updated notes with usage information"
}
```

## Planet Endpoints

#### GET /api/planet/locations
Returns Mars locations.

Query Parameters:
- `type`: Filter by location type (optional)

Response:
```json
{
  "locations": [
    {
      "id": "location_id_1",
      "name": "Olympus City",
      "type": "settlement",
      "coordinates": {
        "lat": 18.65,
        "lng": -133.8
      },
      "description": "The capital city of the Martian Republic, located at the base of Olympus Mons.",
      "population": 1840,
      "established": "2031",
      "imageUrl": "https://example.com/olympus-city.jpg"
    }
  ]
}
```

#### GET /api/planet/locations/:id
Returns details about a specific location.

Response:
```json
{
  "id": "location_id_1",
  "name": "Olympus City",
  "type": "settlement",
  "coordinates": {
    "lat": 18.65,
    "lng": -133.8
  },
  "description": "The capital city of the Martian Republic, located at the base of Olympus Mons. Home to the Congress building and the primary administrative center.",
  "population": 1840,
  "established": "2031",
  "imageUrl": "https://example.com/olympus-city.jpg",
  "facilities": [
    {
      "name": "Congress Building",
      "type": "government",
      "description": "The seat of the Martian Republic government."
    },
    {
      "name": "Central Dome",
      "type": "habitat",
      "description": "The main pressurized habitat dome housing 800 residents."
    }
  ],
  "resources": [
    {
      "id": "resource_id_1",
      "name": "Water Reclamation Facility",
      "capacity": "5000L/day"
    }
  ]
}
```

## Mobile-Specific Endpoints

These endpoints are optimized for mobile apps to reduce data transfer.

#### GET /api/mobile/user/status
Returns essential user status information.

Response:
```json
{
  "id": "user_id",
  "name": "User Name",
  "citizenStatus": "citizen",
  "walletBalance": 325.75,
  "unreadNotifications": 3,
  "activeProposals": 2
}
```

#### GET /api/mobile/dashboard
Returns an overview of all essential user information for the mobile dashboard.

Response:
```json
{
  "user": {
    "id": "user_id",
    "name": "User Name",
    "avatarUrl": "https://example.com/avatar.jpg",
    "citizenStatus": "citizen"
  },
  "wallet": {
    "balance": 325.75,
    "recentTransactions": [
      {
        "id": "tx_id_1",
        "type": "receive",
        "amount": 25.5,
        "timestamp": "2025-04-05T14:30:00Z"
      }
    ]
  },
  "congress": {
    "activeProposals": 2,
    "endingSoonProposals": 1
  },
  "feed": {
    "newPosts": 5,
    "topPost": {
      "id": "post_id_1",
      "userName": "Post Author",
      "content": "Truncated content...",
      "likesCount": 42
    }
  },
  "inventory": {
    "criticalResources": 1,
    "warningResources": 2
  },
  "notifications": [
    {
      "id": "notif_id_1",
      "type": "proposal_ending",
      "title": "Proposal ending soon",
      "timestamp": "2025-04-05T19:00:00Z"
    }
  ]
}
```

## Notification Endpoints

#### GET /api/notifications
Returns user notifications.

Query Parameters:
- `limit`: Maximum number of notifications to return (default: 20)
- `offset`: Number of notifications to skip (default: 0)
- `read`: Filter by read status (true, false, all)

Response:
```json
{
  "total": 12,
  "unreadCount": 3,
  "notifications": [
    {
      "id": "notif_id_1",
      "type": "proposal_comment",
      "title": "New comment on your proposal",
      "content": "John commented on your proposal 'Water Conservation Initiative'",
      "relatedId": "proposal_id_1",
      "timestamp": "2025-04-05T15:30:00Z",
      "read": false
    }
  ]
}
```

#### PUT /api/notifications/:id/read
Marks a notification as read.

Response:
```json
{
  "id": "notif_id_1",
  "read": true,
  "timestamp": "2025-04-05T20:30:00Z"
}
```

## WebSocket Endpoints

For real-time updates, connect to:

```
wss://api.martianrepublic.com/ws
```

Authentication requires providing the JWT token as a query parameter:

```
wss://api.martianrepublic.com/ws?token=jwt_token_here
```

### Available Events

- `wallet_update`: Sent when wallet balance changes
- `notification`: Sent when a new notification is received
- `proposal_vote`: Sent when a proposal receives a new vote
- `resource_critical`: Sent when a resource reaches critical level

Example message:
```json
{
  "type": "notification",
  "data": {
    "id": "notif_id_1",
    "type": "proposal_comment",
    "title": "New comment on your proposal",
    "timestamp": "2025-04-05T15:30:00Z"
  }
}
```

## Error Handling

All endpoints return standard HTTP status codes:

- 200: Success
- 201: Resource created
- 400: Bad request
- 401: Unauthorized
- 403: Forbidden
- 404: Not found
- 409: Conflict
- 422: Unprocessable entity
- 500: Server error

Error responses have the following format:

```json
{
  "error": {
    "code": "invalid_request",
    "message": "Human-readable error message",
    "details": {
      "field": "specific_field",
      "issue": "specific issue with this field"
    }
  }
}
```

## Rate Limiting

API requests are rate-limited to:
- 60 requests per minute for standard users
- 120 requests per minute for citizen users

Rate limit information is provided in response headers:
- `X-RateLimit-Limit`: Maximum requests per minute
- `X-RateLimit-Remaining`: Remaining requests in the current minute
- `X-RateLimit-Reset`: Unix timestamp when the rate limit resets