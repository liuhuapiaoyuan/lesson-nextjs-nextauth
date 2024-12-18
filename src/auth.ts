
import Wehcatmp from '@next-auth-oauth/wechatmp'
import NextAuth from "next-auth"

export const wechatMpProvder = Wehcatmp({
  
    // 参数可以手工初始化，也可以让系统自动读取环境变量
})
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [ wechatMpProvder],
}) 