import NextAuth, { AuthOptions } from "next-auth";
import prisma from "@/app/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid Credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            gym: {
              select: {
                id: true,
                slug: true,
              },
            },
          },
        });

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid Credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid Credentials");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          gymId: user.gym?.id,
          gymSlug: user.gym?.slug,
        };
      },
    }),
  ],

  pages: {
    signIn: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,


  cookies: {
    sessionToken: {
      name: "bjjmat-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`, 
      },
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user && typeof user === "object" && "role" in user) {
        const typedUser = user as {
          id: string;
          role: "VISITOR" | "ADMIN";
          gymId?: string;
          gymSlug?: string;
        };
        token.userId = typedUser.id;
        token.role = typedUser.role;
        token.gymId = typedUser.gymId ?? null;
        token.gymSlug = typedUser.gymSlug ?? null;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as "VISITOR" | "ADMIN";
        session.user.gymId = token.gymId as string  | undefined;
        session.user.gymSlug = token.gymSlug as string | null;
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export const GET = handler;
export const POST = handler;
