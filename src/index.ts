import express from 'express';

const app = express();

app.set('port', process.env.PORT || 9000);



app.listen(app.get('port'), () => {
  console.log('Server is running at http://localhost:%s', app.get('port'));
});
