FROM node:20-alpine3.20 AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# 填充二维码方便打包
ENV AUTH_WECHATMP_QRCODE_IMAGE_URL="http://mmbiz.qpic.cn/mmbiz_jpg/Af7DiaPPhOEjZ338F3GdzEF8VIeP5eFaosiahgRQA0yrt4UtoUd8dgT2J9atyGCGawLntrMqsFqX17icTyR39egaw/0"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY package.json /app
COPY pnpm-lock.yaml /app
RUN  pnpm install


COPY . /app
COPY  ./next.docker.ts  ./next.config.ts
RUN pnpm run build


# 创建运行环境
FROM base as runtime
# 设置工作目录
WORKDIR /app

ENV NODE_ENV=production
ENV BASE_DIR=/data
ENV DATABASE_URL="file:/config/db.sqlite"

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static 


EXPOSE 3000
ENV PORT 3000
ENV HOST 0.0.0.0


CMD ["node","server.js"]
