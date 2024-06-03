## 一起干翻next-auth@5.0系列(三): 数据库集成授权登录

可以说`next-auth`虽然很强大，但是由于新版本被大规模重构了，所以要讲清楚它并不是那么容易,
好吧，终于来到了数据库环节了，为了让我们的教程更加简单，我们这次集成`prisma+sqlite`作为数据库。



## 思路

这次我们不那么简单的上来就讲代码了，我们梳理一下相关的思路，然后一步步实现。

1. 配置 `next-auth`的授权登录,集成Gitee授权登录
2. 配置 `prisma`的数据库配置，配置`schema.prisma`文件
3. 配置 `auth.ts`的`prisma-adapter`
4. 解决`edge`运行模式下`prisma`的兼容问题(使用`JWT`来管理`Session`)

> 小知识：`sqlite`： 一个基于文件的轻量级的关系型数据库，可以嵌入到应用中，用于开发和测试(**好处就是不用再安装数据库服务**)

### 1. 初始化`prisma`项目


`NextAuth`提供了非常方便的数据库集成能力，我们只要按照文档配置好`schema.prisma`文件，就可以快速的集成数据库了。最爽的是官方已经提供了完整的`schema`文件，我们只需要复制粘贴即可。

[NextAuth官方指引](https://authjs.dev/getting-started/adapters/prisma)

![用户管理数据库](https://m.ggss.club/images/oauth-provider/image.png)
![Schema配置](https://m.ggss.club/images/oauth-provider/image-1.png)



#### 1.1 安装`prisma`

```bash
npm install prisma --save-dev
```

#### 1.2 通过 `prisma/schema.prisma`来初始化`prisma`项目

注意这里，我们使用和官方不太一样的简化版本的数据库，因为我们的`session`管理机制使用`jwt`模式，并不是需要通过水库来管理`session`，所以我们只要有`User`和`Account` 

> 创建 `prisma/schema.prisma`

```javascript
datasource db {
  provider = "sqlite"
  url      ="database.sql"
}
 
generator client {
  provider = "prisma-client-js"
}
 
// 本系统账号
model User {
  id            String          @id @default(cuid())
  name          String?
  email         String?         @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
// 第三方账号
model Account {
  id                String  @id @default(cuid())
  userId            String?
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
 
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
 
  user User? @relation(fields: [userId], references: [id], onDelete: Cascade)
 
  @@unique([provider, providerAccountId])
}
```

#### 1.3 初始化系统


```bash
npm exec prisma migrate dev
```

通过这个指令，我们能够获得`prisma`的数据库迁移能力，通过`prisma migrate`我们可以快速的创建、修改、删除数据库表结构。日常我们也可以通过该指令创建、修改、删除数据库表结构。



### 2. 顺手搞定`Gitee`授权登录
考虑到国内的环境，以及微信测试的麻烦，我们还是来集成`Gitee`吧。
其实搞定了微信登录这么麻烦的异类`oauth`，其他的符合`oauth`标准协议的授权登录是很容易集成，所以我们就顺手解决一下吧。

#### 2.1 注册`Gitee`开发者账号，并创建应用

有了前面Github的经验，这边应该很简单
打开：(创建应用https://gitee.com/oauth/applications/new)[https://gitee.com/oauth/applications/new]
完成登录，并创建应用，这边应用回调地址和Github一样，填写`http://localhost:3000/api/auth/callback/gitee`

#### 2.2 配置`next-auth`
核心代码如下，非常简单，因为`Gitee`符合标准的`oauth`协议，所以我们只需要配置一下`client_id`和`client_secret`，以及`scope`即可。

> 创建 `/lib/auth/provider/Gitee.ts`

```typescript
export default function Gitee<P extends GiteeProfile>(
  options: OAuthUserConfig<P>
): OAuth2Config<P>   {
  const {
    clientId = process.env.AUTH_GITEE_ID!,              // 环境变量 AUTH_GITEE_ID
    clientSecret = process.env.AUTH_GITEE_SECRET!,      // 环境变量 AUTH_GITEE_SECRET
    checks=["pkce", "state"],
    ...rest
  } = options; 


  return {
    id: "gitee",        // 这边的ID应该和上面`callback`地址中的`api/auth/callback/gitee`对应
    name: "Gitee登录",
    type: "oauth",
    style: { logo: "/providers/gitee.jpg", bg: "#fff", text: "#000" },
    checks: ["pkce", "state"],
    clientId,
    clientSecret,
    authorization: {
      url: "https://gitee.com/oauth/authorize",
      params: {
        response_type: "code",
        scope:"user_info"
      }
    },
    userinfo: {
      url: "https://gitee.com/api/v5/user",
    },
    token: {
      url: "https://gitee.com/oauth/token",
    },
    profile: (profile) => {
      return {
        id: profile.id+"",
        name:profile.name,
        email:profile.email,
        image:profile.avatar_url 
      }
    },
    ...rest,
  };
}

```


### 3. 打通`next-auth`和`prisma`

可以说这里有很多坑，核心问题是因为`Next.js`的`middleware`仅支持`Edge`运行模式，所以如果我们继续复用之前的配置，会导致`prisma`无法正常工作，所以我们需要重新配置一下。

#### 3.1 拆分`next-auth`的配置文件为 `auth.config.ts`和`auth.ts`

> 创建 `src/auth.config.ts`

```typescript

import type { NextAuthConfig } from "next-auth";
import Gitee from "./lib/auth/provider/Gitee";

 
const AuthConfig: NextAuthConfig = {
  session: {
    // session管理，使用JWT模式替换数据库模式
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

```

> 修改`src/auth.ts`

```typescript
import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { AuthConfig } from "./auth.config";

const prisma = new PrismaClient()

export const { signIn, signOut, auth, handlers } = NextAuth({
  ...AuthConfig,
  adapter: PrismaAdapter(prisma),
});

```

#### 3.2 重写`src/middleware.ts`

> `src/middleware.ts`

```typescript
import NextAuth from "next-auth"
import { AuthConfig } from "./auth.config"
 /**
  * 通过拆分配置的方式，我们来解决`edge`中兼容数据库的方案
  * 具体的配置可以参考`next-auth`的文档
  * [拆分配置](https://authjs.dev/guides/edge-compatibility#split-config)
  */
export const { auth: middleware } = NextAuth(AuthConfig)
```


##  运行效果

### 页面效果

![页面效果](https://m.ggss.club/images/oauth-provider/image-2.png)

### 数据库写入效果

![数据库数据](https://m.ggss.club/images/oauth-provider/image-3.png)



##  代码

[仓库地址](https://github.com/liuhuapiaoyuan/lesson-nextjs-nextauth/tree/lesson3-auth-adapter)

##  总结

我们深入探讨了如何使用 `NextAuth` 进行授权登录，并集成 Prisma + SQLite 作为数据库的方案。整个过程分为以下几个关键步骤：

1. **配置 NextAuth 授权登录并集成 Gitee 授权登录**：首先，介绍了如何配置 NextAuth 进行授权登录，特别是如何配置 Gitee 作为 OAuth 提供商。我们需要在 Gitee 开发者平台上注册应用并获取 `client_id` 和 `client_secret`，然后在 NextAuth 中进行相应配置。

2. **配置 Prisma 数据库**：详细讲解了如何安装 Prisma，并使用 `schema.prisma` 文件配置数据库。通过简单的配置，我们可以快速初始化 Prisma 项目，并利用 Prisma 的迁移能力管理数据库表结构。

3. **配置 Auth.ts 的 Prisma Adapter**：为了让 NextAuth 能够与 Prisma 适配，我们配置了 `PrismaAdapter`，并将 NextAuth 的配置文件拆分为 `auth.config.ts` 和 `auth.ts`。这样做的目的是解决在 Edge 运行模式下 Prisma 的兼容问题。

4. **解决 Edge 运行模式下 Prisma 的兼容问题**：通过将 NextAuth 的配置文件拆分，我们能够在 Edge 环境中兼容数据库操作，并确保整个系统能够正常运行。

#### 难点和重点

- **Edge 运行模式兼容性问题**：Next.js 的 middleware 仅支持 Edge 运行模式，因此需要重新配置 NextAuth，并将配置文件拆分为 `auth.config.ts` 和 `auth.ts`，以解决兼容性问题。

- **理解Adapter是如何工作**：NextAuth通过`profile()` 将第三方账户`Account`转换成`User`,如果已经入库则复用原来的信息，如果没有入住，会通过`linkAccount()`方法创建新的`User`和`Account`数据。


通过以上步骤和配置，我们可以实现一个完整的授权登录系统，并确保其在不同的运行环境中都能稳定工作。

> 当然新版本的`prisma`已经支持了`edge`运行模式，但是我觉得似乎还不稳定，所以也不敢尝试，等稳定了再尝试吧。

## 未完待续:

1. 不得不说，`next-auth`特别美式，不太符合国内互联网的体验流程，我们下次尝试美化登录页面，优化体验流程
2. 继续集成其他授权登录，如QQ、微信小程序等
3. `next-auth`如何解决`RBAC`权限管理
4. `next-auth`不提倡我们多种`provider`同时登陆，甚至不提倡我们自己管理`password`模式登录，但是国内的互联网平台肯定更需要多渠道登录，我们该如何`介入Adapter`的授权工作流？