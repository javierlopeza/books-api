const fetch = require('node-fetch');
const camelcaseKeys = require('camelcase-keys');

async function getJSON(fileName) {
  let json;
  if (process.env.SEEDS_SERVER) {
    const response = await fetch(`${process.env.SEEDS_SERVER}/${fileName}`);
    json = response.json();
  } else {
    /* eslint-disable-next-line import/no-dynamic-require, global-require */
    json = require(`../../seeds/data/${fileName}`);
  }
  return camelcaseKeys(json, { deep: true });
}

module.exports = getJSON;
