var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var elasticsearch = require('elasticsearch');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiTestRouter = require('./routes/api-test');
var bot = require('./routes/slack').bot;
var app = express();

global.client = new elasticsearch.Client({
  hosts: [process.env.ELASTIC_SEARCH_ENDPOINT]
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const CandidateFilterService = require('./services/CandidateFilter.service');

async function getCandidatesByFilter(filter) {
  try {
    const candidates = await CandidateFilterService.getCandidates(filter);
    return candidates;
  } catch (error) {
    console.error('Error getting candidates:', error);
    throw error;
  }
}

var filter = {
  "status": "success",
  "filter": {
    "skill": [
      "PHP"
    ],
    "english": 5,
    "level": "Junior"
  }
}
getCandidatesByFilter(filter);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/test', apiTestRouter)



module.exports = app;
