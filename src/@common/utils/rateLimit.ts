import { IpsType } from '../types';

let i = 0;

export const rateLimit = (
  ips: IpsType,
  url: string,
  ip: string,
  limit: number,
  timeout: number,
) => {
  if (!ips[url]) {
    ips[url] = {};
  }

  console.log(ips);
  console.log(++i);

  if (ips[url][ip]) {
    ips[url][ip].count += 1;

    if (ips[url][ip].count > limit) {
      throw new Error('Rate limit exceeded');
    }
  } else {
    ips[url][ip] = { count: 1 };

    setTimeout(() => {
      delete ips[url][ip];
    }, timeout);
  }
};
