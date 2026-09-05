# Jama Masjid & Boys' Hostel Backend

## Render
Root Directory: `backend`
Build Command: `pip install -r requirements.txt`
Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

Keep Render environment variables in Render only:
- MONGO_URL
- DB_NAME
- CORS_ORIGINS
- JWT_SECRET
- ADMIN_EMAIL
- ADMIN_PASSWORD

Do not commit `.env` or real secrets.
