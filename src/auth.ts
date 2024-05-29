import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

const config: NextAuthConfig = {

  providers: [
    GitHub,
    Credentials({
      credentials: {
        email: { placeholder: "账号或者密码" },
        password: {},
      },
      authorize: async (credentials) => {
        let user = {
          username: credentials.email + "",
          email: credentials.email + "",
          name: credentials.email + "",
        };
        if (!user) {
          throw new Error("User not found.");
        }
        return user;
      },
    }),
  ],
};

export const { signIn, auth, handlers } = NextAuth(config);
