import express from 'express';

const app = express();

app.set('port', process.env.PORT || 9000);

export default app;
