import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { createHash, randomBytes } from 'crypto';
import { logger } from '../utils/logger.js';

// Enhanced rate limiting with different tiers
export const createRateLimit = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message: message || 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}, URL: ${req.url}`);
      res.status(429).json({
        error: 'Too Many Requests',
        message: message || 'Rate limit exceeded',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Strict rate limiting for authentication endpoints
export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts, please try again in 15 minutes'
);

// General API rate limiting
export const apiRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100 // 100 requests
);

// Strict rate limiting for sensitive operations
export const sensitiveRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hour
  10, // 10 attempts
  'Too many sensitive operations, please try again in 1 hour'
);

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      // Remove potential XSS patterns
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized: any = Array.isArray(value) ? [] : {};
      for (const key in value) {
        sanitized[key] = sanitizeValue(value[key]);
      }
      return sanitized;
    }
    return value;
  };

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }

  next();
};

// Security headers middleware
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Generate nonce for CSP
  const nonce = randomBytes(16).toString('base64');
  res.locals.nonce = nonce;

  // Set comprehensive security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}'`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
  
  res.setHeader('Content-Security-Policy', csp);

  next();
};

// Request logging for security monitoring
export const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration,
      timestamp: new Date().toISOString()
    };

    // Log suspicious activities
    if (res.statusCode >= 400 || duration > 5000) {
      logger.warn('Suspicious request detected', logData);
    }

    // Log all authentication attempts
    if (req.url.includes('/auth/')) {
      logger.info('Authentication attempt', logData);
    }
  });

  next();
};

// File upload security
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return next();
  }

  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain'
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      error: 'Invalid file type',
      message: 'Only JPEG, PNG, GIF, PDF, and TXT files are allowed'
    });
  }

  if (req.file.size > maxFileSize) {
    return res.status(400).json({
      error: 'File too large',
      message: 'File size must be less than 10MB'
    });
  }

  next();
};

// CSRF protection
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const token = req.headers['x-csrf-token'] as string;
    const sessionToken = req.headers['authorization']?.split(' ')[1];

    if (!token || !sessionToken) {
      return res.status(403).json({
        error: 'CSRF token required',
        message: 'CSRF token is required for this operation'
      });
    }

    // Verify CSRF token (simplified - in production use proper CSRF library)
    const expectedToken = createHash('sha256')
      .update(sessionToken + process.env.CSRF_SECRET)
      .digest('hex');

    if (token !== expectedToken) {
      return res.status(403).json({
        error: 'Invalid CSRF token',
        message: 'CSRF token validation failed'
      });
    }
  }

  return next();
};