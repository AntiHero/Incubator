import { ReqCounterHistory } from '../types';

type ReqLimiterOpts = {
  limit: number;
  timeout: number;
};

const ips: ReqCounterHistory = {};

export const reqLimiter = (e: string, ip: string, opt: ReqLimiterOpts) => {
  if (!ips[e]) ips[e] = {};

  if (ips[e][ip]) {
    ips[e][ip]++;

    if (ips[e][ip] > opt.limit) return true;
  } else {
    ips[e][ip] = 1;

    setTimeout(() => (ips[e][ip] = 0), opt.timeout);
  }

  return false;
};
