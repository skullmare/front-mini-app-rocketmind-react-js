import jwt from 'jsonwebtoken';
import config from '../config.js';

const SESSION_TTL = process.env.JWT_EXPIRES_IN || '1h';

export function issueSessionToken(user) {
  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET env variable is required');
  }

  const payload = {
    sub: String(user.id),
    username: user.username || null,
    firstName: user.first_name || null,
    lastName: user.last_name || null
  };

  return jwt.sign(payload, config.jwtSecret, { expiresIn: SESSION_TTL });
}

