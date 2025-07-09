// Then your other imports...
import { logger } from './utils/logger.js';
// ... rest of your imports
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { createServer } from 'http';

// Import routes
import authRoutes from './routes/auth.js';
import counsellorRoutes from './routes/counsellors.js';
import appointmentRoutes from './routes/appointments.js';
import wellnessRoutes from './routes/wellness.js';
import blogRoutes from './routes/blogs.js';
import articleRoutes from './routes/articles.js';
import resourceRoutes from './routes/resources.js';
import messageRoutes from './routes/messages.js';
import notificationRoutes from './routes/notifications.js';
import goalRoutes from './routes/goals.js';
import testimonialRoutes from './routes/testimonials.js';
import adminRoutes from './routes/admin.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';

const app = express();
const server = createServer(app);

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://10.255.247.55:5173'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
const apiVersion = process.env.API_VERSION || 'v1';
app.use(`/api/${apiVersion}/auth`, authRoutes);
app.use(`/api/${apiVersion}/counsellors`, authMiddleware, counsellorRoutes);
app.use(`/api/${apiVersion}/appointments`, authMiddleware, appointmentRoutes);
app.use(`/api/${apiVersion}/wellness`, authMiddleware, wellnessRoutes);
app.use(`/api/${apiVersion}/blogs`, authMiddleware, blogRoutes);
app.use(`/api/${apiVersion}/articles`, authMiddleware, articleRoutes);
app.use(`/api/${apiVersion}/resources`, authMiddleware, resourceRoutes);
app.use(`/api/${apiVersion}/messages`, authMiddleware, messageRoutes);
app.use(`/api/${apiVersion}/notifications`, authMiddleware, notificationRoutes);
app.use(`/api/${apiVersion}/goals`, authMiddleware, goalRoutes);
app.use(`/api/${apiVersion}/testimonials`, authMiddleware, testimonialRoutes);
app.use(`/api/${apiVersion}/admin`, authMiddleware, adminRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  logger.info(`🚀 U-Recover Backend Server running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
  logger.info(`🔗 API Base URL: http://localhost:${PORT}/api/${apiVersion}`);
  logger.info(`💚 Health Check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

export default app;