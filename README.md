# 🚗 SmartPark

## 📝 Project Overview

The **SmartPark App** is a full-featured platform designed to streamline parking management and improve user convenience. It provides admins with powerful tools to manage parking locations, slots, and reservations, while offering users an intuitive interface to find, reserve, and manage parking slots in real-time.

---

## 🛠️ Tech Stack
- **Frontend:** Next.js ⚛️
- **Backend:** FastAPI, Python 🐍
- **Database:** PostgreSQL 🐘
- **Authentication:** Next-Auth 🔐
- **Containerization:** Docker, Docker Compose 🐳

---

## ⚙️ Setup and Installation
You can run the Smart Parking App in two ways:

### 🐳 Option 1: Using Docker (Recommended)
**Prerequisites**
- Docker 🐳
- Docker Compose

**Steps**
1. Clone the repository:
```
git clone https://github.com/jnvillamor/smart-parking-app.git
cd smart-parking-app
```
2. Set up for `.env` file for backend:
```
# backend/.env

DB_URL=postgresql://user:password@db:5432/database
ALLOWED_ORIGINS=["http://localhost:3000"]
ENVIRONMENT=development
SECRET_KEY= //your-secret-key

# Admin Credentials
# Initialize the credentials of your admin account
ADMIN_EMAIL=        # default: admin@example.com 
ADMIN_PASSWORD=     # default: admin_password
```
you can generate a secret key using using `openssl`.
```
openssl rand -base64 32 
```

3. Set up the `.env` file for the frontend:
```
# frontend/.env

API_BASE_URL=http://backend:8000
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL=http://localhost:3000
```
since we are using docker, the host for the `API_BASE_URL` is the service name of our backend instead of `localhost`.

4. Start services using `Docker Compose:
```
docker-compose up --build
```
5. Access the app:
- Frontend: http://localhost:3000
- FastAPI API docs: http://localhost:8000/docs
- PGAdmin: http://locahost:8080

---

### 🧪 Option 2: Manual Setup
- Python 3.12+
- PostgreSQL database installed locally
- Virtual environment (venv or conda)

**Steps**
1. Clone the repository:
```
git clone https://github.com/jnvillamor/smart-parking-app.git
cd smart-parking-app
```
**Set up Backend**
2. Create and activate python virtual environment:
```
cd backend
python3 -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate
```

3. Install Depedencies:
```
pip install -r requirements.txt
```

4. Create a `.env` file in the `backend` directory:
```
# backend/.env

DB_URL= # url of your chosen database.
ALLOWED_ORIGINS=["http://localhost:3000"]
ENVIRONMENT=development
SECRET_KEY= //your-secret-key

# Admin Credentials
# Initialize the credentials of your admin account
ADMIN_EMAIL=        # default: admin@example.com 
ADMIN_PASSWORD=     # default: admin_password
```
you can generate a secret key using using `openssl`.
```
openssl rand -base64 32 
```

5. Initialize the database:
- Make sure that your database is running.
- Run database migration:
```
alembic upgrade head.
``` 
6. Run the application:
```
uvicorn app.main:app --reload
```

7. Access API docs:
- FastAPI Swagger UI: http://localhost:8000/docs

**Set up Frontend**

8. Install Dependencies:
```
# Current directory: smart-parking-app/frontend
npm i
```

9. Set up the `.env` file in the `frontend` directory:
```
# frontend/.env

API_BASE_URL=http://localhost:8000
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL=http://localhost:3000
```

10. Run the frontend application:
```
npm run dev
```

11. Access frontend application:
- SmartPark URL: http://localhost:3000

---

## Development Notes

- Use Alembic for handling schema migrations.
- Use SQLAlchemy sessions properly with transactions and rollback on errors.
- Implement pagination for lists to optimize performance.
- Protect sensitive endpoints with authentication and role-based access.
- Use Pydantic models for request validation and response serialization.
- Handle concurrency in reservations to avoid race conditions.