import { BASE_ROUTE } from "../constants";

export function getIdFromRoute(route: string): string {
  const regex = new RegExp(`${BASE_ROUTE}/(\\d+)`);
  const matches = regex.exec(route);

  if (matches) {
    return matches[1];
  }

  return '';
}