# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base

# install Node.js version 22
RUN apt-get update && apt-get install -y curl gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install

RUN mkdir -p /temp/dev

COPY package.json bun.lock /temp/dev/
COPY prisma/ /temp/dev/prisma/

RUN cd /temp/dev && bun install --frozen-lockfile

FROM base AS dev

# copy the installed dependencies from the install stage
COPY --from=install /temp/dev/node_modules node_modules
