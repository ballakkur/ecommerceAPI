const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const logger = require('./library/logLib');
const globalErrorMiddleware = require('./middlewares/appErrorHandler');
const routeLoggerMiddleware = require('./middlewares/routeLogger');
var helmet =require('helmet');

const appConfig = require('./config/appConfig');
const app = express();

//middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(globalErrorMiddleware.globalErrorHandler);
app.use(routeLoggerMiddleware.logIp);
app.use(helmet());
    

//importing models
fs.readdirSync('./models').forEach((file)=>{
    if(~file.indexOf('.js')){
        console.log(file);
        logger.info(file,'index',5);
        require('./models/' + file);
    }
});
//importing routes from routes folder
 fs.readdirSync('./routes').forEach((file)=>{
    if(~file.indexOf('.js')){
        console.log(file);
        logger.info(file,'index',5);
        let route = require('./routes'+'/'+file);
        route.setRouter(app);
    }
});
//404 global error handler
app.use(globalErrorMiddleware.globalNotFoundHandler);
app.listen(appConfig.port,()=>{
    console.log('listening on port 3000');
    //mongoose connection
    mongoose.connect(appConfig.db.url,{useNewUrlParser: true})
    .then(()=>console.log('connected to database'))
    .catch((err)=>console.log(err));
})
