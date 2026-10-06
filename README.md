# 📝 Smart Task & Notes Management System (MERN)

A premium, full-stack application for managing tasks with a modern UI, featuring secure authentication, real-time filtering, and a sleek dark mode.

---

## 🛠️ Error Solution & Updates (Hindi & English)

### ❓ What caused the Error? (`ECONNREFUSED 127.0.0.1:27017`)
The error `MongoDB connection failed: connect ECONNREFUSED ::1:27017, connect ECONNREFUSED 127.0.0.1:27017` occurs because:
1. **Local MongoDB Service was stopped** or not installed on your system.
2. Node.js attempted to connect to `localhost:27017` on IPv6 (`::1`) first before IPv4 (`127.0.0.1`).
3. The server executed `process.exit(1)`, crashing the backend process immediately.

### 💡 How We Fixed & Updated the Code:
1. **IPv4 Binding Fix**: Updated `backend/.env` `MONGO_URI` to `mongodb://127.0.0.1:27017/smarttasks` for direct IPv4 loopback connection.
2. **Automatic In-Memory Fallback (`mongodb-memory-server`)**: Updated `backend/server.js` with smart failover logic. If local MongoDB service is stopped, it automatically starts an embedded **In-Memory MongoDB server**. The server **never crashes** and works 100% out of the box!
3. **Optional Persistent Local MongoDB**: If you want your tasks saved permanently on your local disk, start the Windows MongoDB Service by opening PowerShell as Administrator and running:
   ```powershell
   Start-Service MongoDB
   ```
   Or open Windows Services (`services.msc`) -> find **MongoDB Server** -> right click -> **Start**.

---

## 🚀 Quick Access (Running Project)

- **Frontend UI**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

---

## 🚀 How to Run the Project

### Option A: Standard Step-by-Step

1. **Start Backend Server**:
   ```bash
   cd backend
   npm start
   ```
   *(Or `npm run dev` for auto-reloading with nodemon)*

2. **Start Frontend Dev Server** (in a new terminal window):
   ```bash
   cd frontend
   npm run dev
   ```

### Option B: From Root Directory
   ```bash
   npm run dev:backend   # Starts backend
   npm run dev:frontend  # Starts frontend
   ```

---

## ✨ Features

- **🔐 Secure Auth**: Register and Login with JWT authentication and bcrypt password hashing.
- **📊 Real-time Dashboard**: Interactive stats for Total, Pending, Completed, and Overdue tasks.
- **🛠 Full CRUD**: Create, read, update, and delete tasks with ease.
- **🎨 Modern UI**: Clean, professional design built with vanilla CSS and Lucide icons.
- **🌓 Dark Mode**: Fully integrated dark/light mode toggle (persisted in local storage).
- **📱 Responsive**: Mobile-first design with a collapsible sidebar.
- **🔍 Smart Search**: Filter tasks instantly by title or description.
- **⏳ Due Dates**: Track deadlines with automatic overdue detection.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite, Axios, React Router, Lucide Icons |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB + Mongoose (with In-Memory Fallback) |
| **Security** | JWT (JSON Web Tokens), bcryptjs |
| **Styling** | Vanilla CSS (Custom Design System) |

---

## 📄 License
MIT License - Feel free to use this for your own projects!
