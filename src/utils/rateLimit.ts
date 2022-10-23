interface RateLimiter {
  count: number;
  timer: NodeJS.Timeout;
}

const ips: { [key: string]: RateLimiter } = {};

export const rateLimit = (
  ip: string,
  limit: number,
  options: { timeout: number; cb: () => void }
) => {
  if (ips[ip]) {
    ips[ip].count += 1;

    if (ips[ip].count > limit) {
      delete ips[ip];

      throw new Error('Rate limit exceeded');
    }
  } else {
    const timer = setTimeout(options.cb, options.timeout);

    ips[ip] = { count: 1, timer };
  }
};
