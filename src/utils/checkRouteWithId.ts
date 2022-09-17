import { BASE_ROUTE } from '../constants'

export function checkRouteWithId (route: string) {
  const regex = new RegExp(`^${BASE_ROUTE}/[0-9]+$`);
  if (regex.test(route)) return true;

  return false;
}
