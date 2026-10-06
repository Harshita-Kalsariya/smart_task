// server.js - Main entry point for the Smart Task Manager backend

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// =====================
//  Middleware
// =====================
app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

// Parse incoming JSON request bodies
app.use(express.json());

// =====================
//  API Routes
// =====================
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Smart Task Manager API is running!',
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// =====================
//  Error Handling Middleware (must be last)
// =====================
const { errorHandler } = require('./middleware/errorMiddleware');
app.use(errorHandler);

// =====================
//  Database Connection & Server Start
// =====================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smarttasks';

let memoryServer = null;

async function startServer() {
  try {
    // 1. Try connecting to configured MongoDB (Local or Atlas)
    console.log(`⏳ Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 2500, // Quick 2.5s timeout to fail fast if local MongoDB service is stopped
    });
    console.log('✅ Connected to MongoDB Server successfully');
  } catch (primaryErr) {
    console.warn(`⚠️ Primary MongoDB connection failed: ${primaryErr.message}`);
    console.log('🔄 Launching automatic embedded In-Memory MongoDB fallback...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memoryUri = memoryServer.getUri();

      await mongoose.connect(memoryUri);
      console.log('⚡ Connected to Embedded In-Memory MongoDB Server successfully!');
      console.log('💡 Note: Data will be kept in memory. To use persistent local MongoDB, start the Windows MongoDB Service (net start MongoDB).');
    } catch (fallbackErr) {
      console.error('❌ Failed to launch In-Memory MongoDB fallback:', fallbackErr.message);
      process.exit(1);
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Handle process termination gracefully
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  if (memoryServer) await memoryServer.stop();
  process.exit(0);
});

startServer();

