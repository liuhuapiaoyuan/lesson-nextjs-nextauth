


## Next.js生态太差！一起干翻next-auth@5.0系列！(一)

不得不说，Next.js的生态和Spring Boot、Laravel、Django这些框架相比简直太差了。

Next.js的官方文档也太简陋了，让人望而生畏。

作为一个前端开发者，我深知Next.js的强大功能，但我还是不得不说，Next.js的生态太差！

作为一个Next.js的爱好者，我深知Next.js的潜力，但我还是不得不说，Next.js的生态太差！

作为一个Next.js的粉丝，我深知Next.js的魅力，但我还是不得不说，Next.js的生态太差！

我们且说一套系统，最基本的就是账号系统，那么我们就先从账号系统出发！

## [Next-auth](https://authjs.dev/) 是什么？

Next-auth是一个用于管理用户身份验证的开源库，它可以帮助你快速添加用户注册、登录、密码重置、电子邮件确认、OAuth登录、JSON Web Tokens（JWT）等功能到你的Next.js应用中。

![alt text](image.png)

> 吐槽，Next-auth 几个大版本的调整，现在的用法已经非常简洁，但是因为v5大版本的变动，使得过去遇到的问题很难从网上找到，用法也有比较大的变更，甚至有一些不可预料的bug，需要通过`github`提交问题来尝试解决。


### 准备工作：初始化项目

```shell
pnpm dlx create-app-next@canary nextjs-nextauth
```
> 注意，这里使用 **`canary`** 版本，因为最新版的next@rc版本有一些bug未修复，导致无法使用next-auth的`middleware`。

### 安装next-auth@beat 

> 本次案例体验的是最新的Next-auth@5.0系列，所以选择Beat

``` shell
pnpm add next-auth@beta
```


### 准备工作：生成环境变量

```shell
npx auth secret
Secret generated. Copy it to your .env/.env.local file (depending on your framework):
AUTH_SECRET=l35ZyaGsZmc3JOFBf3JJy+mMzyeMJlQqr8zMA6mBB7U=
```
按照指引复制到.env/.env.local文件中 ， 该key是作为cookie sessionid的加密key



## 代码开始 案例：最小可运行demo

![alt text](image-1.png)


这个案例非常简单，配置一个登录组件，就可以获得系统登录能力。系统尽量使用最新的`ServerAction`特性进行展示 。


> 创建`auth.js`

```typescript
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";


// 模拟账号服务，实际上应该到数据库等渠道检索查询
async function mockUser(username:string , password:string){
  if(password!=='123456'){
    return null
  }
  return {
    id:Math.random().toString(36).substr(2, 9),
    name: username,
    email: username + "@mock.com",
  }
}
// 登录配置
const config: NextAuthConfig = {
  providers: [
    Credentials({
      credentials: {
        username: { label: "账号" },
        password: { label: "密码", type: "password" },
      },
      authorize: async ({username,password}) => mockUser(username+"",password+""), 
    }),
  ],
};
export const { signIn , signOut, auth, handlers } = NextAuth(config);

```

> 创建`src/app/api/auth/[...nextauth]/route.ts`

```typescript
import { handlers } from "@/auth"
export const { GET, POST } = handlers
```

> 创建 `src/middleware.ts` 
```typescript   
export { auth as middleware } from "@/auth";
```

> 创建登录组件： `src/components/SignInButton.tsx`
```typescript
import { signIn } from "@/auth";

export function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn();
      }}
    >
      <button
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        type="submit"
      >
        登录系统
      </button>
    </form>
  );
}
```

> 创建登出组件 `src/components/SignOutButton.tsx`

```typescript
import { signOut } from "@/auth";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-[#cf3434] text-background gap-2 hover:bg-[#680505] dark:hover:bg-[#b93636] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        type="submit"
      >
        退出系统
      </button>
    </form>
  );
}

```


> 创建展示页面： `src/app/page.tsx`

```typescript
import { auth } from "@/auth";
import { SignInButton } from "@/components/SignInButton";
import { SignOutButton } from "@/components/SignOutButton";
import Image from "next/image";

export default async function Home() {
  const session = await auth();
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <div>当前账号信息 ：{session?.user?.email ?? "未登录"}</div>
        <div className="flex gap-4">
          <SignInButton />
          {session?.user && <SignOutButton />}
        </div>
      </main>
    </div>
  );
}
```


代码仓库：[https://github.com/zhengxs2018/nextjs-nextauth](https://github.com/zhengxs2018/nextjs-nextauth)


### 