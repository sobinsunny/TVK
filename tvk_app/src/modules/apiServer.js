import express from 'express';
import winston from 'winston';
import extend from 'extend';
import { start } from 'repl';



const ApiServer = function(config) {
    this.config = extend(true, ApiServer.defaultConfig,config);
};

ApiServer.defaultConfig = {
    serviceName: "JW",
    port: 3000,
    apiRoutePaths: [ process.cwd() + '/src/api' ],
    envirorment: 'Dev',
    logger: null
};

/**
 * 
 */
ApiServer.prototype.init = function()
{

    const app =  express();
    const port = process.env.PORT || this.config.port;
    this.logger = winston;

    const includeApis = (path, app) => {
        try
        {
            return require(path).init(app);
        }
        catch (e) {
            return Promise.reject(e);
        }
    };


    app.use((req,res, next) => {
        req.APP = req.APP || {};
        req.APP.logger = this.logger;
        const startTime = process.hrtime();
          res.on('finish',() => {
               const timeRequired = (process.hrtime(startTime)[1]/1e6);
               req.APP.logger.info({url: req.originalUrl,method: req.method,host: req.headers.host, reqAgent: req.headers["user-agent"], requestTime: `${timeRequired} ms`, requestStatus: res.status });
          });
          next();
    });

    let initializers = Promise.all( this.config.apiRoutePaths.map((path) => {
        return includeApis(path,app);
    }));

    this.logger.info("")
    return initializers.then((_response) =>{
        this.server = app.listen(this.config.port);
        this.logger.info("Api server is starting in port in " + port);
        return Promise.resolve(this.server);
    });
};

module.exports =  ApiServer;

