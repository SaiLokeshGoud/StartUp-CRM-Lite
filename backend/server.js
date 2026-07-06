import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { connectDB } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import User from './models/User.js';
import { Lead } from './models/Lead.js';

// Load environment variables from .env to process.env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = Number(process.env.PORT || 5000);

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'development-secret-change-me';
}

const isProduction = NODE_ENV === 'production';

function sanitizeObject(value) {
  if (Array.isArray(value)) {
    return value.map(sanitizeObject);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, nestedValue]) => {
      if (key === '__proto__' || key.startsWith('$')) {
        return acc;
      }

      acc[key] = sanitizeObject(nestedValue);
      return acc;
    }, {});
  }

  return value;
}


const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://start-up-crm-lite-wut7.vercel.app',
  'https://start-up-crm-lite.vercel.app',
  'https://your-app.vercel.app',
  'http://localhost:5173',
];

// Consolidated dynamic CORS configuration to allow whitelisted origins and same-origin requests
app.use(
  cors((req, callback) => {
    const origin = req.header('Origin');
    const host = req.get('host');
    const isSameOrigin = origin && (origin === `http://${host}` || origin === `https://${host}`);

    let corsOptions;
    if (!origin || isSameOrigin || allowedOrigins.includes(origin)) {
      corsOptions = { origin: true, credentials: true };
    } else {
      corsOptions = { origin: false };
    }
    callback(null, corsOptions);
  })
);
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many auth attempts. Please try again later.',
});

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use((req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  next();
});

app.use(morgan(isProduction ? 'combined' : 'dev'));

// Rate limiting middleware
app.use('/api/auth', authLimiter);
app.use('/api', generalLimiter);

// Serve frontend only if the built frontend directory exists
const frontendDistExists = fs.existsSync(path.join(frontendDistPath, 'index.html'));
if ((process.env.NODE_ENV === 'production' || process.env.SERVE_FRONTEND === 'true') && frontendDistExists) {
  app.use(express.static(frontendDistPath));

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else if (process.env.NODE_ENV === 'production' && !frontendDistExists) {
  console.warn('Frontend dist directory not found at', frontendDistPath, '- skipping frontend serving');
}

// API route registration
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Debug endpoint to list accounts and their lead counts
app.get('/api/debug-leads', async (req, res, next) => {
  try {
    const leadGroups = await Lead.aggregate([
      {
        $group: {
          _id: '$owner',
          count: { $sum: 1 }
        }
      }
    ]);

    const results = [];
    for (const group of leadGroups) {
      if (!group._id) {
        results.push({
          email: 'Unassigned',
          name: 'Unassigned',
          ownerId: null,
          count: group.count
        });
        continue;
      }
      const user = await User.findById(group._id);
      results.push({
        email: user ? user.email : 'Unknown',
        name: user ? user.name : 'Unknown',
        ownerId: group._id,
        count: group.count
      });
    }

    res.json(results);
  } catch (error) {
    next(error);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const status = app.locals.dbConnected ? 'OK' : 'DEGRADED';
  const httpStatus = app.locals.dbConnected ? 200 : 503;

  res.status(httpStatus).json({
    status,
    database: app.locals.dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date(),
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler must be last
app.use(errorHandler);

let server;

const startServer = async () => {
  try {
    app.locals.dbConnected = false;
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    });

    app.locals.dbConnected = await connectDB();
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

async function shutdown(signal) {
  console.log(`Received ${signal}. Server shutting down gracefully...`);

  if (server) {
    server.close(async (err) => {
      if (err) {
        console.error('Error closing server:', err);
        process.exit(1);
      }

      try {
        await mongoose.connection.close(false);
        console.log('MongoDB connection closed. Server shutting down gracefully');
        process.exit(0);
      } catch (closeError) {
        console.error('Error closing MongoDB connection:', closeError);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

startServer();
