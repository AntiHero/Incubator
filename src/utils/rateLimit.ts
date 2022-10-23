import { Response } from 'express';

interface RateLimiter {
  count: number;
  error: boolean;
}

const ips: { [key: string]: RateLimiter } = {};

export const rateLimit = (
  ip: string,
  limit: number,
  timeout: number,
  cb: () => void
) => {
  if (ips[ip]) {
    ips[ip].count += 1;

    if (ips[ip].count > limit) {
      ips[ip].error = true;

      throw new Error('Rate limit exceeded');
    }
  } else {
    ips[ip] = { count: 1, error: false };

    // cb();

    return new Promise(res =>
      setTimeout(() => {
        console.log(ips[ip])
        res(!ips[ip].error);

        delete ips[ip];
      }, timeout)
    );
  }
};
