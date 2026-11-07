# charon

Operator console for the [thanatos](https://github.com/dfoltynski/thanatos) deployment orchestrator. Operators sign in with GitHub, choose a repository, branch and environment, ship it, and review release history per environment. Designed and built for my engineering degree.

## Features

- GitHub OAuth sign-in with session token validation
- Live, debounced branch validation before a deploy can start
- Paginated release history per environment

## Stack

React, TypeScript, Vite, React Router, Emotion, Axios. A Dockerfile is included.

## Run it

Requires Node (see `.nvmrc`), pnpm and a running thanatos instance.

```bash
cp .env.example .env   # fill in GitHub values
pnpm install
pnpm dev
```
