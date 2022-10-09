import 'module-alias/register';

import app from './app';
import connectToDb from './utils/connectToDb';

connectToDb().then(
  () => {
    console.log('\x1b[36m%s\x1b[0m', 'Connected to MongoDb');

    app.listen(app.get('port'), () => {
      console.log('Server is running at http://localhost:%s', app.get('port'));
    });
  },
  () => console.error('Connenction error')
);
