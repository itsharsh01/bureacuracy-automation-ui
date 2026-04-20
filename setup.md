# Local Setup Guide

This guide explains how to run the `bureacuracy-automation-ui` project on your local machine.

## Prerequisites

- Node.js 18+ (recommended: latest LTS)
- npm 9+
- Git

## 1) Clone and open the project

```bash
git clone <your-repo-url>
cd bureacuracy-automation-ui
```

## 2) Install dependencies

```bash
npm install
```

## 3) Configure API base URL (optional but recommended)

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

If this is not set, the frontend uses hardcoded fallbacks in some pages (for example `http://localhost:8000` / `http://127.0.0.1:8000`).

## 4) Start the frontend

```bash
npm run dev
```

Vite will print a local URL (usually `http://localhost:5173`).

## 5) Open in browser

Go to:

`http://localhost:5173`

---

## Important

> **API SERVER MUST BE RUNNING BEFORE USING THE UI.**
>
> This frontend depends on backend endpoints for login, query retrieval, role-based dashboards, and query actions.  
> If the API server is down, login and most dashboard actions will fail.

Make sure your backend is running at the same base URL configured in `VITE_API_BASE_URL`.

---

## Useful Commands

- Start dev server: `npm run dev`
- Build production bundle: `npm run build`
- Preview production build: `npm run preview`
- Run lint checks: `npm run lint`

