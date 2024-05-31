## 一起干翻next-auth@5.0系列(二): 各种姿势集成第三方登录

**目录**

- `先来试试Github登录`
  - `Step1:开通Github App`
  - `Step2:使用next-auth/provider集成Github登录`
- `自定义 Provider，我要接入微信登录`
  - `Step1:创建微信登录应用`
  - `Step2: 自定义provider/wechat微信登录`
  - `Step3:配置微信登录Provider`
  - `Step4:测试微信登录`
  - `源码地址`
  - `重点讲解如何自定义provider`
- `总结`

> 上一集我们提到了 next-auth 的基本用法，包括如何安装、配置、使用。这一集我们来集成第三方登录。
> 第三方登录主要从几个方面思考：

1. 使用`next-auth/provider`快速集成第三方授权登录
2. 如何自定义`provider`接入国内的微信登录登
3. 如何通过数据库`Adapter`完成多第三方账号绑定[未完待续]

今天我们先来尝试一下`Github`登录，以及国内最流行的`微信登录`。

## 先来试试`Github`登录

要集成`Github`登录，我们需要先注册一个`Github`账号，然后创建一个`Github App`，并配置好回调地址。

### Step1:开通`Github App`

1. 打开网址：[Github App](https://github.com/settings/apps)，点击`New GitHub App`按钮。
2. 填写字段如下:
   ![Create Github App](https://gitee.com/sample_school/lesson-nextjs-nextauth/tree/lesson2-3rdauth/doc/oauth/image.png)

**注意**：把 webhook 的 active 关闭掉
**非常重要**：`callback` 注意填写你的回调地址：`[origin]/api/auth/callback/github`，其中`[origin]`是你的网站域名。我们在这里填写`http://localhost:3000`

3. 点击`Create GitHub App`按钮。

4. 创建成功过后，点击 `Generate a new client secret` 按钮，创建应用密钥。

![Generate a new client secret](https://gitee.com/sample_school/lesson-nextjs-nextauth/tree/lesson2-3rdauth/doc/oauth/image-2.png)

5. 在`.env`文件中添加以下内容:

```
GITHUB_ID=your_app_id
GITHUB_SECRET=your_app_secret
```

### Step2:使用`next-auth/provider`集成`Github`登录

> 修改`src/auth.ts`
> 步骤过于**简单**，以至于没什么可以讲的，直接贴代码。

```typescript
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";

// 模拟账号服务，实际上应该去数据库等渠道检索查询
async function mockUser(username: string, password: string) {
  if (password !== "123456") {
    return null;
  }
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: username,
    email: username + "@mock.com",
  };
}
// 登录配置
const config: NextAuthConfig = {
  providers: [
    Github,
    Credentials({
      credentials: {
        username: { label: "账号" },
        password: { label: "密码", type: "password" },
      },
      authorize: async ({ username, password }) =>
        mockUser(username + "", password + ""),
    }),
  ],
};
export const { signIn, signOut, auth, handlers } = NextAuth(config);
```

![登录](https://gitee.com/sample_school/lesson-nextjs-nextauth/tree/lesson2-3rdauth/doc/oauth/image-3.png)

> 注意：授权登录的时候请务必访问`http://localhost:3000`，要和你前面填写的`callback地址`一致

![github登录](https://gitee.com/sample_school/lesson-nextjs-nextauth/tree/lesson2-3rdauth/doc/oauth/image-4.png)

![登录成功](https://gitee.com/sample_school/lesson-nextjs-nextauth/tree/lesson2-3rdauth/doc/oauth/image-5.png)

## 自定义 Provider，我要接入`微信登录`

不得不说，集成第三方登录在`next-auth`内置的`provider`中，真的非常方便。但是，有时候我们需要接入一些比较特殊的第三方登录，比如`微信登录`。

### Step1:创建`微信登录`应用

微信登录需要先创建`微信公众平台`应用，并配置好回调地址。
案例这边我们选择 ： [微信公众平台接口测试](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login) https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login

注册方法就不多讲了，很简单。

![配置回调地址](https://gitee.com/sample_school/lesson-nextjs-nextauth/tree/lesson2-3rdauth/doc/oauth/image-6.png)

**注意**填写你的回调地址：我们在这里填写`http://192.168.2.4:3000`，因为微信不需要填写完整的回调，只要校验`域名`，而且注册发现，它不支持`localhost`，所以我们用`192.168.2.4`。这边通过`ipconfig`查看本机的`ip`。

![配置回调地址2](https://gitee.com/sample_school/lesson-nextjs-nextauth/tree/lesson2-3rdauth/doc/oauth/image-7.png)

### Step2: 自定义`provider/wechat`微信登录

本身`next-auth`是支持直接通过配置完成标准`oauth`服务的接入，但是奈何微信官方没有兼容标准的`oauth2`协议，所以我们要自定义`authorization`、`token`、`userinfo`的获取接口。

代码详细仓库.

### Step3:配置`微信登录`Provider

> 修改`src/auth.ts`

```typescript
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
      authorize: async ({ username, password }) =>
        mockUser(username + "", password + ""),
    }),
  ],
};
```

### Step4:测试`微信登录`

> 注意启动的时候应该制定`hostname`才能保证 IP 启动

```shell
npm run  dev --hostname 192.168.2.4
```

![IPq启动](https://gitee.com/sample_school/lesson-nextjs-nextauth/tree/lesson2-3rdauth/doc/oauth/image-9.png)

比较麻烦的是需要下载`微信开发者工具`进行体验，注意要切换到`公众号网页调试`的模式
![微信登录](https://gitee.com/sample_school/lesson-nextjs-nextauth/tree/lesson2-3rdauth/doc/oauth/image-8.png)

![微信授权登录](https://gitee.com/sample_school/lesson-nextjs-nextauth/tree/lesson2-3rdauth/doc/oauth/image-10.png)

![完成登录](https://gitee.com/sample_school/lesson-nextjs-nextauth/tree/lesson2-3rdauth/doc/oauth/image12.png)

### 源码学习：

[源码地址](https://github.com/liuhuapiaoyuan/lesson-nextjs-nextauth/tree/lesson2-3rdauth)

### 重点讲解如何自定义`provider`

`next-auth`只要我们返回一个合理的对象就可以完成`oauth`或者`oidc`的第三方接入点，我们来看看下面的代码

![WechatProvider代码](https://gitee.com/sample_school/lesson-nextjs-nextauth/tree/lesson2-3rdauth/doc/oauth/wechatprovider.png)

源码有点长，但是实际上代码主要关注以下几个点就可以了：

- 返回的数据结构，需要包含必须的字段
- 兼容处理微信`authorization`、`token`、`userinfo`的获取接口
- 微信返回的用户信息和 profile 的转化

## 总结

本集我们介绍了`next-auth`的基本用法，以及集成第三方登录的几种姿势。

- `next-auth/provider`快速集成第三方授权登录
- `oauth`连接器使得我们可以很容易的自定义第三方登录协议

下一集我们将介绍`next-auth`的`adapter`机制，如何通过数据库`Adapter`完成多第三方账号绑定
