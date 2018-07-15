const logger = require('pino') ()
const moment = require('moment');

let captureError =  (message,origin,level)=>
{
    let time = moment();
    let errorResponse = {
        timeStamp:time,
        message:message,
        origin:origin,
        level:level
    }
    logger.error(errorResponse);
    return errorResponse
}
let captureInfo = (message,origin,importance)=>{
    let time = moment();
    let infoMessage = {
        timeStamp:time,
        message:message,
        origin:origin,
        level:importance
    }
    logger.info(infoMessage)
  return infoMessage
}
module.exports = {
    error: captureError,
    info: captureInfo
  }
