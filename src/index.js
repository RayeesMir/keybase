const app = require('express')();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    res.statusCode = 404;
    res.json(err);
    next(err);
});


const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Listening on port ', port));

module.exports = app;