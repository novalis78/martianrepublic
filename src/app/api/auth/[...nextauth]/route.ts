import NextAuth from "next-auth";
import { authOptions } from "./auth-options";

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export only the handler functions
export { handler as GET, handler as POST };