import { IpsType } from '@/@types';

export const rateLimit = (
  ips: IpsType,
  ip: string,
  timeout: number
) => {
  if (ips[ip]) {
    ips[ip].count += 1;
  } else {
    ips[ip] = { count: 1 };

    setTimeout(() => {
      delete ips[ip];
    }, timeout);
  }
};
