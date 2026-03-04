# KodeBase

A modern, full-stack web-based code editor with multi-language support, user authentication, project management, and real-time code execution — all in your browser.

---

## ✨ Features

- **Multi-language Code Editor** — Syntax highlighting for 20+ languages powered by CodeMirror
- **Real-time Code Execution** — Run code instantly via Wandbox (free, no API key needed)
- **User Authentication** — Email/password + OAuth (Google, GitHub, Facebook)
- **Guest Mode** — Try the editor without creating an account
- **Project Management** — Create, save, rename, and delete projects
- **Download as ZIP** — Download your code as a ZIP archive
- **Password Reset** — Secure OTP-based forgot password flow via email
- **Dark / Light Theme** — Toggle between themes with persistence
- **Font Size Control** — Adjustable editor font size (A- / A+)
- **Mobile Responsive** — Fully usable on phones and tablets
- **Keyboard Shortcuts** — `Ctrl+S` to save, `Ctrl+D` to download

---

## 🛠️ Tech Stack

### Frontend

| Technology      | Purpose                           |
| --------------- | --------------------------------- |
| React 18        | UI library                        |
| Vite            | Build tool & dev server           |
| TailwindCSS     | Utility-first styling             |
| CodeMirror 6    | Code editor component             |
| React Router v7 | Client-side routing               |
| React Toastify  | Notifications                     |
| JSZip           | ZIP file generation for downloads |
| Framer Motion   | Animations                        |
| Axios           | HTTP client                       |

### Backend

| Technology         | Purpose                    |
| ------------------ | -------------------------- |
| Node.js (≥18)      | JavaScript runtime         |
| Express.js         | Web framework              |
| MongoDB + Mongoose | Database & ODM             |
| Passport.js        | OAuth authentication       |
| JWT (jsonwebtoken) | Token-based auth           |
| Bcryptjs           | Password hashing           |
| Nodemailer         | Email service (OTP)        |
| Wandbox API        | Free code execution engine |

---

## 📋 Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org)
- **npm** v8 or higher (comes with Node.js)
- **MongoDB** — Local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)
- **Git** — [Download](https://git-scm.com)

---

## 🚀 Getting Started

Start the backend:

```bash
npm run dev
```

Backend runs on **`http://localhost:3001`**

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

Frontend runs on **`http://localhost:5173`**

> ⚠️ **Important:** If Vite starts on a different port (e.g. `5174` because `5173` is busy), update `FRONTEND_URL` in `backend/.env` to match, then restart the backend.

---

## 📁 Project Structure

```
kodbase/
├── backend/
│   ├── bin/
│   │   └── www                  # HTTP server entry point
│   ├── config/
│   │   ├── db.js                # MongoDB connection
│   │   ├── passport.js          # Passport base config
│   │   ├── passport-github.js   # GitHub OAuth strategy
│   │   ├── passport-google.js   # Google OAuth strategy
│   │   └── passport-facebook.js # Facebook OAuth strategy
│   ├── controllers/
│   │   ├── userController.js    # Auth, projects, code execution
│   │   └── contactController.js # Contact form handler
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification middleware
│   ├── models/
│   │   ├── userModel.js         # User schema
│   │   └── projectModel.js      # Project schema
│   ├── routes/
│   │   ├── index.js             # Main API routes
│   │   ├── auth.js              # OAuth callback routes
│   │   └── users.js             # User routes
│   ├── utils/
│   │   ├── emailService.js      # Nodemailer OTP emails
│   │   └── logger.js            # Logging utility
│   ├── scripts/
│   │   └── fix-indexes.js       # DB index repair script
│   ├── app.js                   # Express app setup + CORS
│   ├── nodemon.json             # Nodemon config (PORT=3001)
│   └── package.json
│
├── frontend/
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── assets/              # Images, logos
│   │   ├── components/
│   │   │   ├── Navbar.jsx       # Top navigation bar
│   │   │   ├── Footer.jsx       # Footer component
│   │   │   ├── Layout.jsx       # Page layout wrapper
│   │   │   └── ScrollToTop.jsx  # Scroll restoration
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Dashboard / project list
│   │   │   ├── Editor.jsx       # Code editor page
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── SignUp.jsx       # Registration page
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── VerifyOTP.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── NoPage.jsx       # 404 page
│   │   ├── helper.js            # API URL, token utils
│   │   ├── App.jsx              # Routes definition
│   │   └── main.jsx             # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🔧 Environment Variables

### Backend — `backend/.env`

| Variable               | Required | Description                                             |
| ---------------------- | -------- | ------------------------------------------------------- |
| `MONGODB_URI`          | ✅       | MongoDB connection string                               |
| `JWT_SECRET`           | ✅       | Secret key for signing JWTs                             |
| `PORT`                 | ✅       | Server port (default: `3001`)                           |
| `FRONTEND_URL`         | ✅       | Frontend origin for CORS (e.g. `http://localhost:5173`) |
| `NODE_ENV`             | ✅       | `development` or `production`                           |
| `GITHUB_CLIENT_ID`     | ⚪       | GitHub OAuth app client ID                              |
| `GITHUB_CLIENT_SECRET` | ⚪       | GitHub OAuth app client secret                          |
| `GITHUB_CALLBACK_URL`  | ⚪       | e.g. `http://localhost:3001/auth/github/callback`       |
| `GOOGLE_CLIENT_ID`     | ⚪       | Google OAuth client ID                                  |
| `GOOGLE_CLIENT_SECRET` | ⚪       | Google OAuth client secret                              |
| `FACEBOOK_APP_ID`      | ⚪       | Facebook app ID                                         |
| `FACEBOOK_APP_SECRET`  | ⚪       | Facebook app secret                                     |

### Frontend — `frontend/.env`

| Variable       | Required | Description                                     |
| -------------- | -------- | ----------------------------------------------- |
| `VITE_API_URL` | ✅       | Backend base URL (e.g. `http://localhost:3001`) |

---

## 🌐 API Reference

All endpoints are prefixed with the backend URL (default: `http://localhost:3001`).

### Auth

| Method | Endpoint                | Auth | Description                 |
| ------ | ----------------------- | ---- | --------------------------- |
| POST   | `/signUp`               | ❌   | Register new user           |
| POST   | `/login`                | ❌   | Login with email & password |
| POST   | `/forgot-password`      | ❌   | Send OTP to email           |
| POST   | `/verify-reset-code`    | ❌   | Verify OTP code             |
| POST   | `/reset-password`       | ❌   | Set new password            |
| GET    | `/auth/github`          | ❌   | Initiate GitHub OAuth       |
| GET    | `/auth/github/callback` | ❌   | GitHub OAuth callback       |
| GET    | `/auth/google`          | ❌   | Initiate Google OAuth       |
| GET    | `/auth/google/callback` | ❌   | Google OAuth callback       |

### Projects

| Method | Endpoint         | Auth | Description                |
| ------ | ---------------- | ---- | -------------------------- |
| POST   | `/createProj`    | ✅   | Create a new project       |
| POST   | `/getProjects`   | ✅   | Get all user projects      |
| POST   | `/getProject`    | ✅   | Get a single project by ID |
| POST   | `/saveProject`   | ✅   | Save code to a project     |
| POST   | `/editProject`   | ✅   | Rename a project           |
| POST   | `/deleteProject` | ✅   | Delete a project           |

### Code Execution

| Method | Endpoint   | Auth | Description              |
| ------ | ---------- | ---- | ------------------------ |
| POST   | `/runCode` | ❌   | Execute code via Wandbox |

**`/runCode` request body:**

```json
{
  "language": "python",
  "files": [{ "filename": "main.py", "content": "print('Hello')" }],
  "stdin": ""
}
```

**`/runCode` response:**

```json
{
  "run": {
    "stdout": "Hello\n",
    "stderr": "",
    "code": 0,
    "output": "Hello\n"
  }
}
```

### Contact

| Method | Endpoint   | Auth | Description             |
| ------ | ---------- | ---- | ----------------------- |
| POST   | `/contact` | ❌   | Send contact form email |

---

## 🔐 Authentication

KodeBase supports multiple authentication flows:

1. **Email / Password** — Passwords are hashed with bcryptjs (12 salt rounds). JWT is issued on login.
2. **Google OAuth** — Via `passport-google-oauth20`. Requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
3. **GitHub OAuth** — Via `passport-github2`. Requires `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.
4. **Facebook OAuth** — Via `passport-facebook`. Requires `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET`.
5. **OTP Password Reset** — A 6-digit code is sent to the user's email via Nodemailer, valid for 10 minutes.

The JWT token is stored in `localStorage` on the client. All protected API calls include it in the request body as `{ token: "..." }`.

---

## ⚡ Code Execution

Code is executed via the **[Wandbox](https://wandbox.org) API** — completely free, no API key or registration required.

**Supported languages:**

| Language   | Compiler       |
| ---------- | -------------- |
| Python     | CPython 3.13   |
| JavaScript | Node.js 20     |
| Java       | OpenJDK 22     |
| C++        | GCC (head)     |
| C          | GCC (head)     |
| Go         | Go 1.23        |
| Ruby       | Ruby 3.4       |
| Rust       | Rust 1.82      |
| PHP        | PHP 8.3        |
| Swift      | Swift 6.0      |
| Bash       | Bash           |
| Haskell    | GHC 9.10       |
| Perl       | Perl 5.42      |
| Lua        | Lua 5.4        |
| R          | R 4.4          |
| C#         | .NET 8         |
| Scala      | Scala 3.5      |
| Elixir     | Elixir 1.17    |
| Erlang     | Erlang 27      |
| TypeScript | TypeScript 5.6 |

---

## 👤 Guest Mode

Users can try KodeBase without signing up:

- A guest session is created with a `guest_` prefixed token stored in `localStorage`
- Projects are stored in `localStorage` as `guestProjects`
- All editor features work in guest mode (run, save, download)
- Guest data is lost when `localStorage` is cleared

---

## 🚢 Deployment

### Backend (e.g. Vercel / Railway / Render)

1. Set all environment variables in your hosting dashboard
2. Set `NODE_ENV=production`
3. Set `FRONTEND_URL` to your deployed frontend URL
4. Deploy the `backend/` folder

### Frontend (e.g. Vercel / Netlify)

1. Set `VITE_API_URL` to your deployed backend URL
2. Build command: `npm run build`
3. Output directory: `dist`
4. Deploy the `frontend/` folder

The project includes `vercel.json` in both `frontend/` and `backend/` for Vercel deployments.

---

## 🐛 Troubleshooting

### `ERR_CONNECTION_REFUSED` on `/runCode`

- Backend is not running. Start it with `cd backend && npm run dev`.
- Check the port: `nodemon.json` sets `PORT=3001`, ensure `VITE_API_URL=http://localhost:3001`.

### CORS Error

- The frontend origin doesn't match `FRONTEND_URL` in `backend/.env`.
- Check which port Vite is using (could be `5173` or `5174`) and update `FRONTEND_URL` accordingly.

### Port 3001 Already in Use

```bash
# Find the PID
netstat -ano | findstr ":3001"

# Kill it (replace <PID> with actual value)
taskkill /PID <PID> /F
```

### MongoDB Connection Failed

- Check `MONGODB_URI` in `backend/.env`
- If using Atlas, whitelist your IP in **Network Access**

### OAuth Not Working

- Set the correct `CLIENT_ID`, `CLIENT_SECRET`, and `CALLBACK_URL` in `backend/.env`
- Ensure the callback URL is registered in the OAuth provider's app settings

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'feat: add YourFeature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request

Please follow conventional commit messages (`feat:`, `fix:`, `docs:`, `chore:`).

---

## ‍💻 Author

**Himanshu** — [GitHub](https://github.com/cjhimanshu)

For support, open an issue on GitHub or reach out via the contact form on the site.

---

_Made with ❤️ by Himanshu_
