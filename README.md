


## 安装next-auth@beat 

> 本次案例体验的是最新的Next-auth@5.0系列，所以选择Beat

``` shell
pnpm add next-auth@beta

```


## 生成环境变量

```shell
npx auth secret

Secret generated. Copy it to your .env/.env.local file (depending on your framework):

AUTH_SECRET=l35ZyaGsZmc3JOFBf3JJy+mMzyeMJlQqr8zMA6mBB7U=
```

复制到.env/.env.local文件中