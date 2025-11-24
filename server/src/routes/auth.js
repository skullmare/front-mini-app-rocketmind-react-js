import { Router } from 'express';
import config from '../config.js';
import { issueSessionToken } from '../services/session.js';
import { verifyTelegramInitData } from '../services/telegram.js';

const router = Router();

router.post('/telegram', (req, res) => {
  try {
    const { initData } = req.body;

    const verification = verifyTelegramInitData(initData);
    const token = issueSessionToken(verification.user);

    const isProduction = config.nodeEnv === 'production';

    res.cookie('session_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 60 * 60 * 1000
    });

    res.json({
      user: verification.user,
      token,
      startParam: verification.startParam
    });
  } catch (error) {
    res.status(401).json({
      message: 'Telegram authorization failed',
      details: error.message
    });
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie('session_token');
  res.status(204).send();
});

export default router;

