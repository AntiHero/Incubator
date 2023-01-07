import { createEscapedString } from 'root/users/utils/createEscapedString';

export const updateSecurityDeviceQuery = (updates: any) => {
  const fields = createEscapedString(updates);

  return `
    UPDATE security_devices SET ${fields} WHERE "deviceId"=$1 RETURNING *
  `;
};
