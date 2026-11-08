# HUFLIT IELTS Reading

## Requirements

- Node.js 22.13 or later
- npm

## First-Time Setup

```powershell
npm install
npm run setup
npm start
```

Open `http://127.0.0.1:3000`. The administrator account is `admin@huflit.edu.vn`; its randomly generated password is stored in `.env`. Do not share or commit `.env`.

Learners can create an account from **Sign In** by selecting **Create an Account**. Passwords must contain at least 8 characters.

## Deploy to Render

1. Push the project to GitHub. Keep `.env` and `storage/ielts.sqlite` out of the repository.
2. In Render, choose **New → Blueprint** and select this repository. Render will read `render.yaml`.
3. Enter a new, unique value for the `ADMIN_PASSWORD` secret when prompted. Use at least 12 characters.
4. Deploy the service and wait for `/api/health` to pass. Render provides the public URL.

The included Blueprint uses a persistent disk for SQLite, which requires a paid Render web service. Do not remove the disk after learners begin using the site, or their database will be lost.

The admin password shown in a local `.env` file is not synchronized to Render. Set or rotate the password in Render's environment settings. To rotate the local password without printing it in the terminal, run `npm run setup:rotate-admin` and copy it from `.env` directly into Render's `ADMIN_PASSWORD` setting. Restart or redeploy the service after changing secrets.

## GitHub Pages + Render split deployment

GitHub Pages cannot host the Express login/session backend or SQLite database. The safe setup is:

- Frontend: GitHub Pages static site
- Backend: Render Node service with Express and SQLite

In the static site, set the API base before app scripts load:

```html
<script>
  window.IELTS_API_BASE_URL = 'https://your-render-app.onrender.com';
</script>
<script src="config.js"></script>
<script src="app.js"></script>
```

If you do not set `window.IELTS_API_BASE_URL`, the app will keep using the same origin and work only when the API is served from the same domain.

On the backend, add the frontend origin in `FRONTEND_ORIGINS` so cookies can be sent across sites. Example:

```text
FRONTEND_ORIGINS=https://annihilate0502-ux.github.io
```

This is required for cross-site login with `SameSite=None; Secure` cookies.

## Data

Accounts, sessions, and results are stored in `storage/ielts.sqlite`. To back up the database, stop the server and copy the SQLite file. Passage highlights are currently stored in each browser.

To allow access from other devices on the same network, set `HOST=0.0.0.0` in `.env` and configure the firewall. For an Internet deployment, use HTTPS and set `NODE_ENV=production`.