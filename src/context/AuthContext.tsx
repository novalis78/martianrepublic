'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

// Extend the Session type to include our custom fields
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      publicAddress?: string | null;
      citizenStatus?: string;
    };
  }
}

export default function AuthContext({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}