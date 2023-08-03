var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var elasticsearch = require('elasticsearch');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cors = require('cors');
var apiTestRouter = require('./routes/api-test');
var candidatesRouter = require('./routes/candidates');
var bot = require('./routes/slack').bot;
var app = express();

global.client = new elasticsearch.Client({
  hosts: [process.env.ELASTIC_SEARCH_ENDPOINT]
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:4000' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/test', apiTestRouter)
app.use('/candidates', candidatesRouter);



module.exports = app;
