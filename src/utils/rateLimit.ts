interface RateLimiter {
  count: number;
  // error: boolean;
}

export const ips: { [key: string]: RateLimiter } = {};

export const rateLimit = (ip: string, timeout: number) => {
  if (ips[ip]) {
    ips[ip].count += 1;

    // if (ips[ip].count > limit) {
    //   ips[ip].error = true;

    //   throw new Error('Rate limit exceeded');
    // }
  } else {
    // ips[ip] = { count: 1, error: false };
    ips[ip] = { count: 1 };

    // return new Promise(res =>
    //   setTimeout(() => {
    //     res(!ips[ip].error);

    //     delete ips[ip];
    //   }, timeout)
    // );
    setTimeout(() => {
      delete ips[ip];
    }, timeout);
  }
};
