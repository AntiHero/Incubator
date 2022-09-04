import express from 'express';
import bodyParser from 'body-parser';

const app = express();

interface Car {
  make: string;
  model: string;
  color: string;
  engine: string;
  year: string;
}

const cars: { [key: number | string]: Car } = {
  0: { make: 'BMW', model: 'E46', engine: 'M57D30', color: '317', year: '2002' },
};

let id = 1;

app.use(bodyParser.json());

app.get('/', (_, res) => {
  res.status(200).send('<h1>Hello, Express</h1>');
});

app.get('/cars', (_, res) => {
  res.status(200).json(cars);
});

app.post('/cars', (req, res) => {
  const { make = '', model = '', engine = '', color = '', year = '' } = req.body;

  if (make.length && engine.length && color.length && year.length) {
    const car: Car = { make, model, engine, color, year };

    cars[id] = car;
    ++id;

    res.status(201).json(car);
  } else {
    res.status(400).send({ error: 'Invalid object', path: '/cars' });
  }
});

app.put('/cars/:id', (req, res) => {
  const { make, model, engine, color, year } = req.body;
  const { id } = req.params;

  if (cars[id]) {
    let car = {
      make: make ?? cars[id].make,
      model: model ?? cars[id].model,
      engine: engine ?? cars[id].engine,
      color: color ?? cars[id].color,
      year: year ?? cars[id].year,
    };

    cars[id] = car;

    res.status(200).json(car);
  } else {
    res.status(400).send({ error: 'Id not found', path: `/cars/${id}` });
  }
});

app.delete('/cars/:id', (req, res) => {
  const { id } = req.params;

  if (cars[id]) {
    delete cars[id];

    res.status(200).send(`${id} has been successfully deleted`);
  } else {
    res.status(400).send({ error: 'Id not found', path: `/cars/${id}` });
  }
});

export default app;
