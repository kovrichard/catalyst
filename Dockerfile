# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.3.4 AS base

WORKDIR /app


# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install

RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
# @catalyst:db-start
COPY prisma/ /temp/dev/prisma/
# @catalyst:db-end
WORKDIR /temp/dev
RUN bun install --frozen-lockfile
WORKDIR /app

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
# @catalyst:db-start
COPY prisma/ /temp/prod/prisma/
# @catalyst:db-end
WORKDIR /temp/prod
RUN bun install --frozen-lockfile --production --ignore-scripts
# @catalyst:db-start
RUN bun run postinstall
# @catalyst:db-end


FROM base AS prerelease

ARG NEXT_PUBLIC_TURNSTILE_SITEKEY
ARG NEXT_PUBLIC_GOOGLE_ANALYTICS_ID
ARG NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID
ARG NEXT_PUBLIC_GOOGLE_ADS_ID
ARG NEXT_PUBLIC_CLARITY_ID
ARG NEXT_PUBLIC_AUTH_REDIRECT_PATH

ENV NEXT_PUBLIC_TURNSTILE_SITEKEY=${NEXT_PUBLIC_TURNSTILE_SITEKEY}
ENV NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=${NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}
ENV NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=${NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID}
ENV NEXT_PUBLIC_GOOGLE_ADS_ID=${NEXT_PUBLIC_GOOGLE_ADS_ID}
ENV NEXT_PUBLIC_CLARITY_ID=${NEXT_PUBLIC_CLARITY_ID}
ENV NEXT_PUBLIC_AUTH_REDIRECT_PATH=${NEXT_PUBLIC_AUTH_REDIRECT_PATH}

COPY --from=install /temp/dev/node_modules node_modules
# @catalyst:db-start
COPY --from=install /temp/dev/src/lib/prisma/generated ./src/lib/prisma/generated
# @catalyst:db-end

COPY ./emails ./emails
COPY ./public ./public
COPY ./src ./src
COPY package.json bun.lock ./
COPY ./next.config.mjs next.config.mjs
COPY postcss.config.mjs postcss.config.mjs
COPY tsconfig.json tsconfig.json

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build:standalone


FROM base AS release

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

RUN useradd --system --uid 1001 nextjs

# Copy files as root:root (default), then set permissions for nextjs to read/execute only
COPY --from=prerelease --chmod=755 /app/public ./public
COPY --from=prerelease --chmod=755 /app/.next/standalone ./
COPY --from=prerelease --chmod=755 /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["bun", "./server.js"]


FROM base AS dev

# copy the installed dependencies from the install stage
COPY --from=install /temp/dev/node_modules node_modules
# @catalyst:db-start
COPY --from=install /temp/dev/src/lib/prisma/generated ./src/lib/prisma/generated
# @catalyst:db-end
