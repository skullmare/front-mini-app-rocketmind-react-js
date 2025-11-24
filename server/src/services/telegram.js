import crypto from 'crypto';
import config from '../config.js';

function buildDataCheckString(searchParams) {
  return Array.from(searchParams.entries())
    .filter(([key]) => key !== 'hash')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
}

export function verifyTelegramInitData(initDataRaw) {
  if (!config.botToken) {
    throw new Error('BOT_TOKEN env variable is required');
  }

  if (!initDataRaw) {
    throw new Error('initData payload is missing');
  }

  const searchParams = new URLSearchParams(initDataRaw);
  const hash = searchParams.get('hash');

  if (!hash) {
    throw new Error('hash field is missing inside initData');
  }

  const dataCheckString = buildDataCheckString(searchParams);

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(config.botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  const calculatedBuffer = Buffer.from(calculatedHash, 'hex');
  const hashBuffer = Buffer.from(hash, 'hex');

  if (
    calculatedBuffer.length !== hashBuffer.length ||
    !crypto.timingSafeEqual(calculatedBuffer, hashBuffer)
  ) {
    throw new Error('initData hash validation failed');
  }

  const authDate = Number(searchParams.get('auth_date')) * 1000;
  if (!authDate) {
    throw new Error('auth_date is missing or invalid');
  }

  const maxAllowedSkew = config.authMaxAgeSeconds * 1000;
  if (Date.now() - authDate > maxAllowedSkew) {
    throw new Error('initData payload is expired');
  }

  const userRaw = searchParams.get('user');
  if (!userRaw) {
    throw new Error('user object is missing in initData');
  }

  const user = JSON.parse(userRaw);

  return {
    user,
    authDate,
    startParam: searchParams.get('start_param') || null
  };
}

