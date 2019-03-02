const enable = true

module.exports = (req, res, next) => {
    if(!enable) next()
    console.log()
    let proto = req.protocol
    let port = (req.app.locals.port === "443" && proto === 'https') || (req.app.locals.port === "80" && proto === 'http') ?'': `:${req.app.locals.port}` 
    console.log(`Url: ${proto}://${req.hostname}${port}${req.originalUrl}`)
    console.log(`METHOD: ${req.method}`)
    console.log(`HEADERS: ${JSON.stringify(req.headers)}`)
    if(Object.entries(req.query).length !== 0) {
        console.log(`Querry: ${JSON.stringify(req.query)}`)
    }
    else if (Object.entries(req.params).length !== 0){
        console.log(`PARAMS: ${JSON.stringify(req.params)}`)
    }
    else if (Object.entries(req.body).length !== 0) {
        console.log(`BODY: ${JSON.stringify(req.body)}`)
    }
    console.log("Handler Output:")
    try {
        next();
    }
    catch (err) {
        console.error(err);
        res.status(500).send();
    }
  }
  