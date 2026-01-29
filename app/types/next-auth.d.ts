import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "ADMIN" | "VISITOR";
      firstName?: string | null;
      lastName?: string | null;
      gymId?: string | null;
      gymSlug?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId: string;
    role: "ADMIN" | "VISITOR";
    gymId?: string | null;
    gymSlug?: string | null;
  }
}