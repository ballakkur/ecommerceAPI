const moment = require('moment')

let now = () => {
  return moment.utc().format('LL')
}
// console.log(now());
module.exports = {
   now
}