require('dotenv-flow').config({ silent: true });

const config = {
  amazon: {
    keyId: process.env.AMAZON_ACCESS_KEY_ID,
    key: process.env.AMAZON_SECRET_KEY,
    region: process.env.AMAZON_REGION,
  },
  minio: {
    keyId: 'MINIOACCESSKEY',
    key: 'MINIOSECRETKEY',
    region: 'us-west-2',
    forcePathBucket: true,
    endpoint: 'http://127.0.0.1:9000',
  },
};

module.exports = config;
