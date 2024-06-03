
import type { NextAuthConfig } from "next-auth";
import Gitee from "./lib/auth/provider/Gitee";

 
const AuthConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [ Gitee],
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

