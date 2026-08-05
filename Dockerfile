# Two stages: build the static export with Node, then serve the plain files
# with nginx. The runtime image carries no Node and no application code —
# `output: 'export'` means there is nothing left to run.

FROM node:22-alpine AS build
WORKDIR /app

# Install against the lockfile first so a source-only change reuses this layer.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build          # -> /app/out

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out/ /usr/share/nginx/html/

EXPOSE 80
