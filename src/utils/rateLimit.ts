import { IpsType } from '@/@types';

export const rateLimit = (
  ips: IpsType,
  ip: string,
  limit: number,
  timeout: number
) => {
  if (ips[ip]) {
    ips[ip].count += 1;

    if (ips[ip].count > limit) {
      throw new Error('Rate limit exceeded');
    }
  } else {
    ips[ip] = { count: 1 };

    setTimeout(() => {
      delete ips[ip];
    }, timeout);
  }
};
