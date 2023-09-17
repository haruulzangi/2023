const express      = require('express');
const app          = express();
const bodyParser = require("body-parser");
const nunjucks     = require('nunjucks');
const cookieParser = require('cookie-parser');
const routes       = require('./routes/routes');

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.set('trust proxy', process.env.PROXY !== 'false');
app.use('/static', express.static('static'));

nunjucks.configure("views", {
    autoescape: true,
    express: app,
    views: "templates",
});

app.use(routes());

app.all('*', (req, res) => {
    return res.status(404).send({
        message: '404 page not found'
    });
});

//app.use(function (err, req, res, next) {
  //  res.status(500).json({
   //     error:err,
   //     message: 'Something went wrong!'
   // });
//cat });

(async() => {
    app.listen(1337, '0.0.0.0', () => console.log('Listening on port 1337'));
})();