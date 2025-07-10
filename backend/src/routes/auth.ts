import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Public authentication routes
router.post('/signup', asyncHandler(authController.signup));
router.post('/signin', asyncHandler(authController.signin));
router.post('/signout', asyncHandler(authController.signout));
router.post('/refresh', asyncHandler(authController.refresh));
router.post('/forgot-password', asyncHandler(authController.forgotPassword));
router.post('/reset-password', asyncHandler(authController.resetPassword));

// Protected profile routes
router.get('/profile', authMiddleware, asyncHandler(authController.getProfile));
router.put('/profile', authMiddleware, asyncHandler(authController.updateProfile));

export default router;