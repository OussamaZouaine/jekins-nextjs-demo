# Build stage — official Node image via AWS Public ECR mirror (same as library/node on Docker Hub).
# Use this when the CI Docker daemon cannot authenticate to auth.docker.io (401 on Hub pulls).
FROM public.ecr.aws/docker/library/node:20-alpine AS builder

RUN apk add --no-cache bash curl unzip

ENV BUN_INSTALL=/root/.bun
ENV PATH="${BUN_INSTALL}/bin:${PATH}"
RUN curl -fsSL https://bun.sh/install | bash

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .
RUN mkdir -p public
RUN bun run build

# Runner stage - Next.js standalone uses Node.js
FROM public.ecr.aws/docker/library/node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
