
# Upwork Clone: Freelance Marketplace Application

## Project Overview

This is a full-stack Upwork clone built with a React frontend, Node.js/Express backend, and MySQL database. The application provides a platform for clients to post jobs and freelancers to find and apply for work.

## Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Router
- React Query

### Backend
- Node.js
- Express.js
- MySQL
- JSON Web Token (JWT) for authentication
- Bcrypt for password hashing

## Project Structure

```
upwork-clone/
│
├── src/
│   ├── backend/           # Backend server and configurations
│   │   └── server.js      # Express server with API routes
│   │   └── database.sql   # Database schema
│   │
│   ├── components/        # Reusable React components
│   ├── pages/             # Application page components
│   ├── contexts/          # React context providers
│   ├── services/          # API service functions
│   └── utils/             # Utility functions
│
└── package.json           # Project dependencies and scripts
```

## Prerequisites

- Node.js (v18+)
- MySQL
- npm or Bun

## Local Development Setup

### Backend Setup

1. Create MySQL Database
```sql
CREATE DATABASE upwork_clone;
USE upwork_clone;
-- Run the SQL scripts in src/backend/database.sql to create tables
```

2. Configure Database Connection
- Open `src/backend/server.js`
- Update database credentials:
```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'upwork_clone'
});
```

3. Install Backend Dependencies
```bash
cd path/to/project
npm install express cors mysql2 bcrypt jsonwebtoken
```

4. Start Backend Server
```bash
node src/backend/server.js
# Server will run on http://localhost:5000
```

### Frontend Setup

1. Install Frontend Dependencies
```bash
npm install
```

2. Start Development Server
```bash
npm run dev
# Frontend will run on http://localhost:3000
```

## Key Features

- User Authentication (Signup/Login)
- Job Posting for Clients
- Job Browsing for Freelancers
- User Profiles
- Protected Routes

## API Endpoints

### Authentication
- `POST /api/register`: User registration
- `POST /api/login`: User login

### Jobs
- `GET /api/jobs`: List all jobs
- `GET /api/jobs/:id`: Get job details
- `POST /api/jobs`: Create a new job (protected)

### Profiles
- `GET /api/profile/:id`: Get user profile
- `PUT /api/profile`: Update user profile (protected)

## Environment Variables

Create a `.env` file in the project root with:
```
JWT_SECRET=your_jwt_secret_key
DATABASE_HOST=localhost
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
DATABASE_NAME=upwork_clone
```

## Deployment

### Backend
- Recommended: Deploy on platforms like Heroku, DigitalOcean, or AWS
- Ensure MySQL database is accessible
- Set environment variables on the hosting platform

### Frontend
- Deploy on Vercel, Netlify, or Lovable
- Configure environment variables
- Set backend API URL in frontend configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - [Your Email]
Project Link: [https://github.com/yourusername/upwork-clone]
```

