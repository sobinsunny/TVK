import Promise from 'bluebird';


module.exports.init = function(app)
{

    app.get('/' ,(req, res) =>{
        res.json({message: 'Subscription created successfully! with sobin'});
    });

    return Promise.resolve();
}
