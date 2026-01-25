FROM node:24-alpine AS build-stage 
WORKDIR /building-stage
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm i --frozen-lockfile

ARG VITE_GITHUB_TOKEN
ARG VITE_GITHUB_ORGANIZATION_NAME
ARG VITE_GITHUB_CLIENT_ID
ENV VITE_GITHUB_TOKEN=${VITE_GITHUB_TOKEN}
ENV VITE_GITHUB_ORGANIZATION_NAME=${VITE_GITHUB_ORGANIZATION_NAME}
ENV VITE_GITHUB_CLIENT_ID=${VITE_GITHUB_CLIENT_ID}

COPY . .
RUN pnpm build

FROM nginx:alpine AS app-runner  
WORKDIR /app
COPY --from=build-stage /building-stage/dist ./dist

RUN printf 'server {\n\
  listen 80;\n\
  server_name _;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80