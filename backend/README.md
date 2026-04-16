# Backend Deployment

This backend is an Express + MongoDB app.

## Vercel deployment

1. Create a new Vercel project and point it to the `backend` folder.
2. Set the environment variable `MONGO_URI` or `MONGO_URL` in Vercel to your MongoDB connection string.
3. Deploy.

## Local development

1. Copy `.env.example` to `.env`.
2. Set `MONGO_URI` in `.env`.
3. Run:

```bash
cd backend
npm install
npm start
```

The backend will start on `http://localhost:5000` by default.
