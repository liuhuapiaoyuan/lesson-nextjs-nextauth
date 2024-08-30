import type { NextAuthConfig } from "next-auth";
import { DefaultSession } from 'next-auth';
declare module 'next-auth' {
  interface User {
    username: string; // 添加新的属性
  }

  interface Session extends DefaultSession {
    user: User; // 确保 Session 中的 user 使用扩展后的 User 类型
  }
}
const AuthConfig: NextAuthConfig = {
  session: {
    // 使用JWT模式替换数据库模式，支持Nextjs的Edge模式
    strategy: "jwt",
  }, 
  providers:[], 
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username; 
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token?.sub) {
        // 补充JWT缺少userId
        session.user.id = token.sub;
      }
      session.user.username = token.username as string

      return session;
    },
  },
};
export { AuthConfig };

