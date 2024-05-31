import WeChat from "@/lib/auth/provider/Wechat";
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";


// 模拟账号服务，实际上应该去数据库等渠道检索查询
async function mockUser(username: string, password: string) {
  if (password !== '123456') {
    return null
  }
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: username,
    email: username + "@mock.com",
  }
}
// 登录配置
const config: NextAuthConfig = {
  providers: [
    Github,
    WeChat,
    Credentials({
      credentials: {
        username: { label: "账号" },
        password: { label: "密码", type: "password" },
      },
      authorize: async ({ username, password }) => mockUser(username + "", password + ""),
    }),
  ],
};
export const { signIn, signOut, auth, handlers } = NextAuth(config);
