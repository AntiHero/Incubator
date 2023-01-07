export type SecurityDeviceDTO = {
  id: string;
  ip: string;
  title: string;
  deviceId: string;
  lastActiveDate: string;
  userId: string;
};

export type SecurityDeviceInput = Partial<Omit<SecurityDeviceDTO, 'id'>>;

export type SecurityDeviceViewModel = {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;
};
