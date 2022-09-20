import 'module-alias/register';
import app from './app';

app.listen(app.get('port'), () => {
  console.log('Server is running at http://localhost:%s', app.get('port'));
});
