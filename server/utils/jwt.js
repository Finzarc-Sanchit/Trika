// JWT utilities
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

const generateToken = (user) => {
    return jwt.sign(
        { email: user.email },
        config.jwt_secret,
        { expiresIn: '30d' }
    );
};

export { generateToken };
