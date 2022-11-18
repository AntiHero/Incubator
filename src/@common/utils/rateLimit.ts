import { IpsType } from '../types';

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
// if (ips[url]) {
//   if (ips[url][ip]) {
//     ips[url][ip].count += 1;

//     if (ips[url][ip].count > limit) {
//       throw new Error('Rate limit exceeded');
//     }
//   }
// } else {
//   ips[ip] = { count: 1 };

//   setTimeout(() => {
//     delete ips[ip];
//   }, timeout);
// }
// };
