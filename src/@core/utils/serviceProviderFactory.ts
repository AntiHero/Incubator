export function serviceProviderFactory(service: new (...args: any[]) => any) {
  return {
    provide: service.name,
    useClass: service,
  };
}
