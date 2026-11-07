# charon

Frontend for a small deploy manager. Sign in with GitHub, pick a repository, branch and environment, then trigger a deploy and browse the history. The backend is [thanatos](https://github.com/dfoltynski/thanatos), which does the building and container work.

## Features

- GitHub OAuth login with token validation
- Debounced branch validation before a deploy
- Deploy history per environment, with pagination

## Stack

React, TypeScript, Vite, React Router, Emotion, Axios. A Dockerfile is included.

## Run it

Requires Node (see `.nvmrc`) and a running thanatos instance.

```bash
cp .env.example .env   # fill in GitHub values
npm install
npm run dev
```
