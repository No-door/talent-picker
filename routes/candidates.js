var express = require('express');
var router = express.Router();
const searchEngine = require('../elastic-search/search-engine');

/* GET users listing. */
router.get('/', async function (req, res, next) {
    //get array of candidates ids from request params
    const ids = req.query.ids.split(',');
    console.log(ids);
    //get array of candidates from elastic search
    const candidates = await searchEngine.getCandidatesByIds(ids);
    //return candidates
    if (candidates.length === 0) {
        res.status(404).send('No candidates found');
    }
    res.send(candidates);
});

module.exports = router;
