/**
 * Authentication utilities for the MartianRepublic application
 */
import { Session } from 'next-auth'
import type { User } from '@/types/models'

// Extend the Session type to include our custom fields
declare module 'next-auth' {
  interface Session {
    user: User & {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

/**
 * Check if the user is authenticated
 */
export function isAuthenticated(session: Session | null): boolean {
  return !!session?.user
}

/**
 * Check if the user is a Martian citizen
 * In a real implementation, this would check the user's profile in the database
 */
export function isCitizen(session: Session | null): boolean {
  // Mock implementation - in reality this would check the user's profile in the database
  return !!session?.user
}

/**
 * Get the user's full name
 */
export function getFullName(session: Session | null): string {
  if (!session?.user) {
    return 'Guest'
  }
  return session.user.fullname || session.user.name || 'Unknown'
}

/**
 * Check if the user has permissions for a specific action
 */
export function hasPermission(session: Session | null, permission: string): boolean {
  // Mock implementation - in reality this would check the user's permissions
  if (!session?.user) {
    return false
  }
  
  // For demonstration purposes, let's pretend all authenticated users have basic permissions
  const basicPermissions = ['view_proposals', 'view_wallet', 'view_profile']
  
  // Only citizens can vote and create proposals
  const citizenPermissions = ['vote', 'create_proposal']
  
  if (basicPermissions.includes(permission)) {
    return true
  }
  
  if (citizenPermissions.includes(permission)) {
    return isCitizen(session)
  }
  
  return false
}