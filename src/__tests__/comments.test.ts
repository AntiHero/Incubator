import supertest from 'supertest';
import { ObjectId } from 'mongodb';

import app from '@/app';
import { testClient } from '@/clients';
import connectToDb from '@/utils/connectToDb';
import { basicLogin, basicPassword } from '@/constants';

let api: supertest.SuperTest<supertest.Test>;

const basicAuthHeader = {
  Authorization: `Basic ${Buffer.from(
    [basicLogin, basicPassword].join(':')
  ).toString('base64')}`,
};

const bearerAuthHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

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

describe('testing /posts/:postId/comments', () => {
  let postId: string;
  let token: string;

  beforeAll(async () => {
    api = supertest(app);

    const userCreds = { login: 'testUser', password: 'testPass' };
    const user = { ...userCreds, email: 'custom-email@gmail.com' };

    await api.post('/users').set(basicAuthHeader).send(user).expect(201);

    const authResponse = await api
      .post('/auth/login')
      .send(userCreds)
      .expect(200);

    token = authResponse.body.accessToken;

    const blog = { name: 'youtube', youtubeUrl: 'https://youtube.com' };

    const postBlogResponse = await api
      .post('/blogs')
      .set(basicAuthHeader)
      .set('Accept', 'text/plain')
      .send(blog)
      .expect(201);

    const { id } = JSON.parse(postBlogResponse.text);

    const post = {
      title: 'new title',
      shortDescription: 'description',
      blogId: id,
      content: 'interesting content',
    };

    const postPostResponse = await api
      .post('/posts')
      .set(basicAuthHeader)
      .send(post)
      .expect(201);

    postId = JSON.parse(postPostResponse.text)['id'];
  });

  test('should return 401 status if user is not authnticated', async () => {
    await api
      .post(`/posts/${postId}/comments`)
      .set(bearerAuthHeader(token.slice(0, -1)))
      .send({})
      .expect(401);
  });

  test("should return 404 status if post id doesn't exist", async () => {
    await api
      .post(`/posts/${new ObjectId()}/comments`)
      .set(bearerAuthHeader(token))
      .send({})
      .expect(404);
  });

  test('should return 400 status and error message if request is not valid', async () => {
    const badComment = { content: 'too small' };

    await api
      .post(`/posts/${postId}/comments`)
      .set(bearerAuthHeader(token))
      .send(badComment)
      .expect(400);
  });

  test('should return 201 status and comment after successful request', async () => {
    const goodComment = { content: 'enough length for a good commen' };

    const commentResponse = await api
      .post(`/posts/${postId}/comments`)
      .set(bearerAuthHeader(token))
      .send(goodComment)
      .expect(201);

    const content = JSON.parse(commentResponse.text)['content'];

    expect(content).toBe(goodComment.content);
  });
});
