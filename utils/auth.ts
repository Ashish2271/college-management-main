import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/utils/prismaDB";
import bcrypt from "bcryptjs";
import { UserRole } from "@prisma/client";

// Extend the built-in session types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      username?: string;
      rollno?: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    email: string;
    role: UserRole;
    username?: string;
    rollno?: string;
  }
}

// Extend JWT type
declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    username?: string;
    rollno?: string;
  }
}

export const authOptions: NextAuthOptions = {
    //@ts-ignore
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            teacher: true,
            student: true
          }
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          ...(user.teacher ? { username: user.teacher.username } : {}),
          ...(user.student ? { rollno: user.student.rollno } : {})
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as UserRole;
        if (token.username) session.user.username = token.username;
        if (token.rollno) session.user.rollno = token.rollno;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        if (user.username) token.username = user.username;
        if (user.rollno) token.rollno = user.rollno;
      }
      return token;
    }
  }
};