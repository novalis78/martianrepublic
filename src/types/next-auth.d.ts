import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    publicAddress?: string | null;
    citizenStatus?: string;
  }

  interface Session extends DefaultSession {
    user?: {
      id: string;
      publicAddress?: string | null;
      citizenStatus?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    publicAddress?: string | null;
    citizenStatus?: string;
  }
}