import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import credentials from "next-auth/providers/credentials";
import { AuthConfig } from "./auth.config";
import Gitee from "./lib/auth/provider/Gitee";

export const { signIn, signOut, auth, handlers } = NextAuth({
  ...AuthConfig,
  providers: [
    Gitee,
    // 增加账号面膜
    credentials({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials, req) {
        return prisma.user.findUnique({
          where:{
            email:credentials.username as string
          }
        })
      }
  })
  ],
  adapter: PrismaAdapter(prisma),
});
