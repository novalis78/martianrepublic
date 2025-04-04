import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { db } = await connectToDatabase();
          const user = await db.collection("users").findOne({ 
            email: credentials.email 
          });

          if (!user) {
            return null;
          }

          // Compare the provided password with the stored hash
          const isPasswordValid = await bcrypt.compare(
            credentials.password, 
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Return user data
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.fullname,
            publicAddress: user.publicAddress || null,
            citizenStatus: user.citizenStatus || 'newcomer',
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.publicAddress = user.publicAddress;
        token.citizenStatus = user.citizenStatus;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.publicAddress = token.publicAddress as string | null;
        session.user.citizenStatus = token.citizenStatus as string;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-out",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  secret: process.env.NEXTAUTH_SECRET || "martiansecret123",
};