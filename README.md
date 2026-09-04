# popquest

PopQuest is a gamified quiz platform focused on pop culture - movies, music, TV shows, video games, anime and manga.
Users progress through fivve levels by earning XP points from solving quizzes, with higher levels unlocking more challenging content and additional categories.


## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- Database: PostgreSQL
- ORM: Prisma
- Authentication: JSON Web Token (JWT)


## Database Schema

Database consists of six tables:

1. USER: stores user data, XP, level and role (USER/ADMIN)
2. CATEGORY: quiz categories with minimum level requirements
3. QUIZ: quizzes belonging to a category with XP reward
4. QUESTION: questions belonging to a quiz
5. ANSWER: possible answers for each question
6. QUIZ ATTEMPT: records of completed quizzes with score and XP earned


## API Endpoints

- Auth
    1. [POST] `/api/auth/register` (Registers new user) | Requires auth? No
    2. [POST] `/api/auth/login` (Login existing user and receive JWT token) | Requires auth? No

- Users
    1. [GET] `/api/users/me` (Get current user data) | Requires auth? Yes
    2. [GET] `/api/users/attempts` (Get current user's quiz history) | Requires auth? Yes

- Categories
    1. [GET] `/api/categories` (Get all categories) | Requires auth? Yes
    2. [POST] `/api/categories` (Create a new category) | Requires auth? Yes, Admin
    3. [PUT] `/api/categories/:id` (Update a category) | Requires auth? Yes, Admin
    4. [DELETE] `/api/categories/:id` (Delete a category) | Requires auth? Yes, Admin

- Quizzes
    1. [GET] `/api/quizzes` (Get all available quizzes) | Requires auth? Yes
    2. [GET] `/api/quizzes/all` (Get all available quizzes without taking user level into account) | Requires auth? Yes, Admin
    3. [GET] `/api/quizzes/:id` (Get a single quiz with questions) | Requires auth? Yes
    4. [POST] `/api/quizzes` (Create a new quiz) | Requires auth? Yes, Admin
    5. [PUT] `/api/quizzes/:id` (Update a quiz) | Requires auth? Yes, Admin
    6. [POST] `/api/quizzes/:id/submit` (Submit quiz answers) | Requires auth? Yes
    7. [DELETE] `/api/quizzes/:id` (Delete a quiz) | Requires auth? Yes, Admin


## User Roles

- USER:
    * Register and login
    * View and complete quizzess available for their level from categories available for their level
    * Earn XP and level up, unlocking more quizzes and categories
    * View their profile and quiz history

- ADMIN:
    * All USER permissions
    * Create, edit and delete categories
    * Create, edit and delete quizzes with questions and answers
    * Admin panel access


## Level System

1: Rookie [0 XP]
2: Fan [500 XP]
3: Enthusiast [1000 XP]
4: Expert [1500 XP]
5: Legend [2000 XP]

XP earned per quiz is proportional to achieved score.
Example: Scoring 70% on a quiz with 100 XP reward gives user 70 XP.


## How to Run Locally

### Prerequisites

- Node.js
- PostgreSQL
- npm

### Backend

________________
|cd backend     |
|npm install    |    
|_______________|

Create '.env' file in 'backend/' folder:
    DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/popquest"
    JWT_SECRET="your_secret_key"
    PORT=3000

Run database migrations:
________________________
|npx prisma migrate dev | 
|_______________________|

Start backend:
________________________
|npm run dev            | 
|_______________________|

### Frontend

________________
|cd frontend    |
|npm install    |
|npm run dev    |
|_______________|

The app will be available at `http://localhost:5173`.

### Important Notes

- Prisma Client
    After cloning the repository, Prisma client is generated automatically when you run `npm install` thanks to the `postinstall` script. If it fails for any reason, run manually:
    ________________________
    |npx prisma generate    | 
    |_______________________|

- Database Setup
    Database is not included in repository, only schema and migrations are.
    After setting up PostgreSQL create database manually:
    ________________________
    |createdb popquest      | 
    |_______________________|
    
    Then setup your `.env` file with correct `DATABASE_URL` and run migrations:
     ________________________
    |npx prisma migrate dev | 
    |_______________________|

## Project Structure

popquest/
├── backend/
│ ├── src/
│ │ ├── controllers/ # Request handlers
│ │ ├── middleware/ # Auth middleware
│ │ ├── routes/ # API routes
│ │ ├── prisma.ts # Prisma client
│ │ └── index.ts # Express server
│ ├── prisma/
│ │ └── schema.prisma # Database schema
│ └── .env # Environment variables (not in Git)
└── frontend/
  ├── src/
  │ ├── api/ # Axios configuration
  │ ├── components/ # Reusable components
  │ ├── context/ # Auth context
  │ └── pages/ # Application pages
  └── vite.config.ts