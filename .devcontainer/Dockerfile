# Mirrors the app's runtime (oven/bun) so the agent shares the project toolchain.
# Node and the Claude Code CLI are installed directly here rather than via the
# node dev container feature: the bun image is Debian (sh is dash), where that
# feature's `source` call fails with exit 127.
FROM oven/bun:1.3.4

# Pre-create the named-volume mount points owned by the non-root `bun` user.
# An empty Docker volume otherwise mounts as root, leaving Claude unable to
# write its auth token to ~/.claude, and `bun install` unable to write node_modules.
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
       bash procps sudo git ca-certificates curl wget gnupg openssl \
  && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y --no-install-recommends nodejs \
  && npm install -g @anthropic-ai/claude-code \
  && rm -rf /var/lib/apt/lists/* \
  && echo 'bun ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/bun \
  && chmod 0440 /etc/sudoers.d/bun \
  && mkdir -p /home/bun/.claude /commandhistory /app/node_modules \
  && chown -R bun:bun /home/bun/.claude /commandhistory /app/node_modules

ENV DEVCONTAINER=true
ENV HISTFILE=/commandhistory/.bash_history
