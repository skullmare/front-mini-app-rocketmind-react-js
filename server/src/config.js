import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  botToken: process.env.BOT_TOKEN || '',
  jwtSecret: process.env.JWT_SECRET || '',
  authMaxAgeSeconds: Number(process.env.AUTH_MAX_AGE_SECONDS) || 300
};

export default config;

