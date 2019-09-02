import config from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import routes from './src/routes';

config.config();

const app = express();

// parse request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// session
app.use(cookieSession({
  keys: JSON.parse(process.env.SECRET_KEYS),
  maxAge: 14 * 24 * 60 * 60 * 1000, // 2 weeks
}));

// state
app.use((req, res, next) => {
  req.state = {};
  return next();
});

// routing
app.use('/api/v1', routes);
app.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to this API.',
}));

// app
const port = process.env.PORT || 8000;
app.listen(port, () => {
  /* eslint-disable-next-line no-console */
  console.log(`Server is running on PORT ${port}`);
});

module.exports = app;
