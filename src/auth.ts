import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import credentials from "next-auth/providers/credentials";
import { AuthConfig } from "./auth.config";
import Gitee from "./lib/auth/provider/Gitee";
import prisma from "./lib/prisma";
import { userService } from "./service/user.service";

const providers = [
  Gitee,
  credentials({
    credentials: {
      username: {},
      password: {},
    },
    async authorize(credentials) {
        const user = await  userService.login(credentials.username as string, credentials.password as string);
        console.log("登录成功",user)
        return user
    }
  })
];

/**
 *  登录列表
 */
export const providerList = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider()
      return { id: providerData.id, name: providerData.name }
    } else {
      return { id: provider.id, name: provider.name }
    }
  })
  .filter((provider) => provider.id !== "credentials")



  export const { signIn, signOut, auth, handlers } = NextAuth({
    ...AuthConfig,
    providers,
    adapter: PrismaAdapter(prisma),
   
  });