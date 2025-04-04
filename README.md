# Martian Republic - Next.js Edition

<p align="center">
  <strong>A decentralized governance system for Mars</strong>
</p>

## About MartianRepublic

MartianRepublic is a reference implementation of a decentralized governance system for Mars. This is a modern Next.js rewrite of the original Laravel-based implementation.

It includes the following subsystems:

- **Wallet** - Manage your Marscoin and digital assets
- **Citizen** - Manage your Martian identity and citizenship status
- **Congress** - Propose and vote on legislation for Mars
- **Feed** - Community social feed for announcements and discussions
- **Inventory** - Track resources and inventory on Mars
- **Logbook** - Record and browse Martian activities
- **Planet** - Explore Mars geography and locations with interactive maps

MartianRepublic makes extensive use of the Marscoin blockchain's immutable ledger for anchoring and timestamping and IPFS for decentralized data storage.

## Technology Stack

- **Next.js** - React framework for server-rendered applications
- **TypeScript** - Typed JavaScript for better development experience
- **TailwindCSS** - Utility-first CSS framework
- **NextAuth.js** - Authentication for Next.js
- **Web3.js** - Ethereum JavaScript API for blockchain integration
- **IPFS HTTP Client** - IPFS API for decentralized storage

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/martianrepublic.git
cd martianrepublic
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Development

### Prerequisites

To fully utilize this application, you'll need:

- **MongoDB** - A MongoDB database (local or Atlas)
- **Marscoind** - A local Marscoin node
- **IPFS** - For pinning local data and making it available across the network

### Environment Setup

Copy the sample environment file and configure it for your environment:

```bash
cp sample.env .env.local
```

Edit `.env.local` to add your MongoDB connection string and other required variables.

### Database Initialization

If you're setting up a new MongoDB instance, you can initialize the required collections and indexes:

```bash
node scripts/init-db.js
```

This script will create all necessary collections with proper validators and indexes.

### Project Structure

- `src/app` - Next.js app router pages and API routes
- `src/components` - Reusable React components
- `src/context` - React context providers
- `src/lib` - Utility functions and services
- `src/types` - TypeScript type definitions
- `public` - Static assets

### API Documentation

The Martian Republic provides a comprehensive API for both web and mobile clients. See the [API documentation](./src/app/api/README.md) for details on available endpoints.

### Deployment

For deployment instructions, see the [Deployment Guide](./DEPLOYMENT.md).

## For Mars

Copy project onto USB stick, including a copy of the Marscoin ledger, Marscoin node, IPFS node - then take a SpaceX Starship to Mars and upon arrival bootstrap an entire economic and governance hub using MartianRepublic.

## License

The MartianRepublic is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).