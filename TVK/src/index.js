
import Promise from 'bluebird';

import AppInit from './modules/appInit';

module.exports = Promse.props({
    apiServer: new AppInit()
})
.then(initializartionParams => {
    return Promise.resolve(initializartionParams.apiServer.init());
})