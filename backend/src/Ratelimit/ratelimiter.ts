import { Request as ExpressRequest, Response, NextFunction } from 'express';

interface CustomRequest extends ExpressRequest {
  ip: string;
}

const store: Record<string, { requests: number; firstRequestTime: number }> = {};

export const customRateLimiter = ({windowMs = 15 * 60 * 1000, maxRequests = 100, message = 'Too many requests',} = {}) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const ip = req.ip;

    if (!ip) {
      return res.status(500).send("Couldn't identify IP");
    }

    const now = Date.now();
    const user = store[ip];

    if (!user) {
      store[ip] = { requests: 1, firstRequestTime: now };
      return next();
    }

    const timePassed = now - user.firstRequestTime;

    if (timePassed < windowMs) {
      if (user.requests >= maxRequests) {
        return res.status(429).json({ success: false, message });
      }
      store[ip].requests++;
      return next();
    }

    // reset after window
    store[ip] = { requests: 1, firstRequestTime: now };
    next();
  };
};
