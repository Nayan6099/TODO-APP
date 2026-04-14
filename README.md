# TaskFlow — MERN Stack Todo Application

A full-stack todo application built with MongoDB, Express.js, React.js, and Node.js featuring JWT authentication, protected routes, and full CRUD operations.

---

## Features

- User registration and login with JWT authentication
- Protected dashboard — only accessible after login
- Add, edit, delete, and mark tasks as complete/pending
- Filter tasks by: All / Pending / Completed
- Task stats (total, completed, pending)
- Fully responsive design
- Toast notifications for all actions

---

## Project Structure

```
todo-app/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   │   ├── axios.js
    │   │   ├── auth.js
    │   │   └── tasks.js
    │   ├── components/
    │   │   └── PrivateRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Register.js
    │   │   ├── Login.js
    │   │   └── Dashboard.js
    │   ├── styles/
    │   │   ├── global.css
    │   │   ├── auth.css
    │   │   └── dashboard.css
    │   ├── App.js
    │   └── index.js
    ├── .env.example
    ├── .gitignore
    └── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

---

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET in .env
npm run dev
```

The backend will run on `http://localhost:5000`

---

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000/api
npm start
```

The frontend will run on `http://localhost:3000`

---

## API Endpoints

### Auth
| Method | Endpoint             | Description        | Access  |
|--------|----------------------|--------------------|---------|
| POST   | /api/auth/register   | Register new user  | Public  |
| POST   | /api/auth/login      | Login user         | Public  |
| GET    | /api/auth/me         | Get current user   | Private |

### Tasks
| Method | Endpoint          | Description                   | Access  |
|--------|-------------------|-------------------------------|---------|
| GET    | /api/tasks        | Get all tasks for user        | Private |
| POST   | /api/tasks        | Create a new task             | Private |
| PUT    | /api/tasks/:id    | Update task (edit/complete)   | Private |
| DELETE | /api/tasks/:id    | Delete a task                 | Private |

---

## Deployment

### Frontend — Vercel
1. Push the `frontend` folder to GitHub
2. Import into [Vercel](https://vercel.com)
3. Set environment variable: `REACT_APP_API_URL=https://your-backend-url/api`
4. Deploy

### Backend — Render
1. Push the `backend` folder to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`
4. Start command: `node server.js`

---

## Tech Stack

- **Frontend**: React.js, React Router v6, Axios, React Toastify
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Auth**: JWT (JSON Web Tokens), bcryptjs
