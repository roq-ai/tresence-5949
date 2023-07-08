const mapping: Record<string, string> = {
  clients: 'client',
  locations: 'location',
  'travel-agents': 'travel_agent',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
