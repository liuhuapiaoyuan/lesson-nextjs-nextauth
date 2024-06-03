import NextAuth from "next-auth"
import { AuthConfig } from "./auth.config"
 /**
  * 通过拆分配置的方式，我们来解决`edge`中兼容数据库的方案
  * 具体的配置可以参考`next-auth`的文档
  * [拆分配置](https://authjs.dev/guides/edge-compatibility#split-config)
  */
export const { auth: middleware } = NextAuth(AuthConfig)