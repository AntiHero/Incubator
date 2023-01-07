export type TokenInputModel = {
  value: string;
  expDate: string;
};

export type UserForToken = {
  login: string;
  userId: string;
  deviceId: string;
};

export type LoginSuccessViewModel = {
  accessToken: string;
};
