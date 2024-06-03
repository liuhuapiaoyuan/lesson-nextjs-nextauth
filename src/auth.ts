import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { AuthConfig } from "./auth.config";

export const { signIn, signOut, auth, handlers } = NextAuth({
  ...AuthConfig,
  adapter: PrismaAdapter(prisma),
});
