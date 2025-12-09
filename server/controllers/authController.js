// Authentication controller
import { config } from '../config/env.js';
import { matchPassword } from '../utils/authentication.js';
import { generateToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';

/**
 * Login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        const user = config.user;

        // Check email
        if (email !== user.email) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect credentials',
            });
        }

        // Check password (always use bcrypt - password should be hashed)
        const isPasswordMatch = await matchPassword(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Incorrect credentials',
            });
        }

        // Generate token
        const token = generateToken(user);

        logger.info(`✅ User logged in: ${user.email}`);

        res.status(200).json({
            success: true,
            message: 'Login Successful!',
            token,
        });
    } catch (error) {
        logger.error('Login error:', error);
        return next(error);
    }
};

export default { login };

