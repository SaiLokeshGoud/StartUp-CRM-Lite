import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';
import { connectDB } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables from .env to process.env
dotenv.config();

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT;

/**
 * Verify required environment variables are present before startup.
 */
function checkRequiredEnvVars() {
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  const missingVars = requiredVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    process.exit(1);
  }
}

checkRequiredEnvVars();

const isProduction = NODE_ENV === 'production';

const allowedOrigins = [process.env.FRONTEND_URL, 'https://your-app.vercel.app'];

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
app.use(mongoSanitize());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(morgan(isProduction ? 'combined' : 'dev'));

// Rate limiting middleware
app.use('/api/auth', authLimiter);
app.use('/api', generalLimiter);

// API route registration
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
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
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
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
