import express from 'express';
import bodyParser from 'body-parser';

import authRouter from './routes/auth.router';
import blogsRouter from './routes/blogs.router';
import postsRouter from './routes/posts.router';
import usersRouter from './routes/users.router';
import testingRouter from './routes/testing.router';

const app = express();

app.set('port', process.env.PORT || 9000);

app.use(bodyParser.json());

app.use('/auth', authRouter);
app.use('/posts', postsRouter);
app.use('/blogs', blogsRouter);
app.use('/users', usersRouter);
app.use('/testing', testingRouter);

app.use('*', (_, res) => {
  res.status(200).end();
});

export default app;
