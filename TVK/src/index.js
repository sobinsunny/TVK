
import Promise from 'bluebird';

import ApiServer from './modules/appInit';


module.exports = Promise.props({
    apiServer: new ApiServer()
})
.then(initializartionParams => {
    return Promise.resolve(initializartionParams.apiServer.init());
})
.catch(error => {
    console.log(error)
})