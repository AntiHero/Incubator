import app from '@/app';
import supertest from 'supertest';

import { testClient } from '@/clients';
import connectToDb from '@/utils/connectToDb';
import { basicLogin, basicPassword } from '@/constants';

let api: supertest.SuperTest<supertest.Test>;

beforeAll(async () => {
  await connectToDb(testClient);
});

beforeEach(async () => {
  api = supertest(app);
});

afterAll(async () => {
  await supertest(app).delete('/testing/all-data');
  await testClient.close();
});

describe('testing /auth/login', () => {
  test('should sign in user when POST /auth/login', async () => {
    expect.assertions(1);

    const customUserCreds = { login: 'testUser', password: 'testPass' };
    const customUser = { ...customUserCreds, email: 'custom-email@gmail.com' };

    await api
      .post('/users')
      .set(
        'Authorization',
        `Basic ${Buffer.from([basicLogin, basicPassword].join(':')).toString(
          'base64'
        )}`
      )
      .send(customUser)
      .expect(201);

    const authResponse = await api
      .post('/auth/login')
      .send(customUserCreds)
      .expect(200);

    expect(authResponse.body.accessToken).toMatch(/^\w+\.\w+\.\w+$/);
  });
});
