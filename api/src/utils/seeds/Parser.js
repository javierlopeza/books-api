const chrono = require('chrono-node');

function parseDate(str) {
  if (str.match(/^[0-9]{4}$/)) {
    return chrono.parseDate(`1/1/${str}`);
  }
  return chrono.casual.parseDate(str);
}

module.exports = { parseDate };
