import express from 'express';
import winston from 'winston';



const ApiServer = function(config) {
    this.config = extends(true, ApiServer.defaultConfig,config)
};

ApiServer.defaultConfig = {
    serviceName: "JW",
    port: 3000,
    apiRoutePaths: [ process.cwd() + '/src/api' ],
    envirorment: 'Dev'
};
ApiServer.prototype.init = function()
{

    const app =  express();
    const port = this.config.port || 3000;


    const includeApis = (path,app) =>{
        try
        {
            return require(path).init(app);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }

    app.use((req,res, next) =>
    {
        req.APP = req.APP || {};
        req.APP.startTime = process.hrtime();
        req.APP.logger = new winston.createLogger({
            format: winston.format.json(),
            transports: [
              new winston.transports.Console()
            ]
          });
          res.on('finish',() => {
               const timerRun = process.hrtime(req.APP.startTime);
               req.APP.logger.info({message: "Finished request in %s", timerRun });
          });
          next();
    });
    this.logger.info('Adding routes...');


    let initializers = Promise.all( this.config.apiRoutePaths.map((path) => {
        return includeApis(path,app);
    }));

    return initializers.then(() =>{
        this.logger.info('API Server started.');
        this.server = app.listen(this.config.port);
        return Promise.resolve(this.server);
    });
}

