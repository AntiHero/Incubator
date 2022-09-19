import express from 'express';

import blogsRouter from './routes/blogs.router';
import postsRouter from './routes/posts.router';
import testingRouter from './routes/testing.router';

const app = express();

app.set('port', process.env.PORT || 9000);

app.use('/posts', postsRouter);
app.use('/blogs', blogsRouter);
app.use('/testing', testingRouter);

export default app;
