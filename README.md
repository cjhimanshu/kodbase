# Kodbase

A modern web-based code editor with powerful features, user authentication, and project management capabilities. Write, edit, and manage code seamlessly in your browser.

<!-- Last updated: 2026-02-23 -->

## 🌟 Features

- **Online Code Editor** - Write and edit code with syntax highlighting
- **User Authentication** - Secure login/signup with OAuth (Google, GitHub, Facebook)
- **Project Management** - Create, save, and organize your projects
- **Real-time Compilation** - Execute code and see instant results
- **Password Reset** - Forgot password recovery with OTP verification
- **Responsive Design** - Works perfectly on desktop and mobile devices
- **Monaco Editor Integration** - Professional code editing experience

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Monaco Editor** - Powerful code editor component
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Passport.js** - Authentication middleware
- **JWT** - Token-based authentication
- **Nodemailer** - Email service for OTP

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas cloud)
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/cjhimanshu/kodbase.git
cd kodbase
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example`:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/kodbase
JWT_SECRET=your_secure_jwt_secret_key_here
PORT=5000
```

Start the backend server:

```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
kodbase/
├── backend/
│   ├── config/          # Database and authentication configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions and services
│   ├── app.js          # Express app setup
│   └── package.json    # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── package.json    # Frontend dependencies
│
└── README.md           # This file
```

## 🔐 Authentication

The application supports multiple authentication methods:

- **Email/Password** - Traditional signup and login
- **Google OAuth** - Sign in with Google
- **GitHub OAuth** - Sign in with GitHub
- **Facebook OAuth** - Sign in with Facebook
- **OTP Verification** - For password reset and account verification

## 🌐 API Endpoints

### Authentication

- `POST /auth/signup` - Create new account
- `POST /auth/login` - Login with credentials
- `POST /auth/logout` - Logout
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/reset-password` - Reset password

### Projects

- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Users

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/verify-email` - Verify email

## 👨‍💻 Development

### Run Backend in Development Mode

```bash
cd backend
npm run dev
```

### Run Frontend in Development Mode

```bash
cd frontend
npm run dev
```

### Build Frontend for Production

```bash
cd frontend
npm run build
```

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Ensure MongoDB is running
- Check if MONGODB_URI is correct in `.env`
- Verify IP whitelist in MongoDB Atlas (if using cloud)

### Port Already in Use

- Change PORT in `.env` to a different port (e.g., 5001)
- Or kill the process using the port

### CORS Errors

- Ensure backend is running on the expected port
- Check CORS configuration in `backend/app.js`

## 📝 Environment Variables

### Backend (.env)

```
MONGODB_URI=          # MongoDB connection string
JWT_SECRET=           # Secret key for JWT tokens
PORT=5000            # Server port
NODE_ENV=development # Environment (development/production)
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍🎓 Author

**Himanshu** - [GitHub Profile](https://github.com/cjhimanshu)

## 📞 Support

For support, email support@kodbase.com or open an issue on GitHub.

---

**Made with ❤️ by Himanshu**
