import bodyParser from 'body-parser';
import express from 'express';
import { validatePaginationQuery } from './customValidators/paginationValidator';

import blogsRouter from './routes/blogs.router';
import postsRouter from './routes/posts.router';
import testingRouter from './routes/testing.router';

const app = express();

app.set('port', process.env.PORT || 9000);

app.use(bodyParser.json());

app.use('/posts', postsRouter);
app.use('/blogs', blogsRouter);
app.use('/testing', testingRouter);

app.use('/validators', validatePaginationQuery);

app.use('*', (_, res) => {
  res.status(200).end();
});

export default app;
