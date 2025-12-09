// Authentication utilities
import bcrypt from 'bcryptjs';

const matchPassword = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
};

export { matchPassword };
