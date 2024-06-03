
import type { NextAuthConfig } from "next-auth";
import Gitee from "./lib/auth/provider/Gitee";

 
const AuthConfig: NextAuthConfig = {
  session: {
    // 使用JWT模式替换数据库模式，支持Nextjs的Edge模式
    strategy: "jwt",  
  },
  providers: [ Gitee ],
  callbacks: {
    session: async ({ session, token }) => {
      if (token?.sub) {
        // 补充JWT缺少userId
        session.user.id = token.sub;
      }
      return session;
    },
     
  },
};
export { AuthConfig };

