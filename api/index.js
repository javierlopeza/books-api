import config from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import routes from './src/routes';

config.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 8000;

app.use('/api/v1', routes);

// when a random route is inputed
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to this API.',
}));

app.listen(port, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Server is running on PORT ${port}`);
});

module.exports = app;
