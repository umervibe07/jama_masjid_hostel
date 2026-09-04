Jama Masjid Backend - Render Fix

Files:
- server.py: migrated from Motor to PyMongo AsyncClient
- requirements.txt: removes incompatible Motor and pins PyMongo 4.18.0
- .python-version: pins Render to Python 3.13.5

Render:
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT

Keep your Render Environment Variables:
MONGO_URL
DB_NAME
CORS_ORIGINS
JWT_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD

Do not commit your .env file or real secrets to GitHub.
