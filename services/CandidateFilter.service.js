var searchEngine = require('../elastic-search/search-engine');

class CandidateFilterService {
  constructor() {
    this.searchEngine = searchEngine;
  }

  async getCandidates(params) {
    try {
      const { status, filter } = params;

      const { skill, english, level } = filter;

      const query = {
        query: {
          bool: {
            must: [
              { terms: { skill } },
              { term: { english } },
              { term: { level } }
            ]
          }
        }
      }

      searchEngine.search(query)
        .then(result => {
          return res.send(result).statusCode(200);
        })
    } catch (error) {
      console.error('Error querying candidates:', error);
      throw error;
    }
  }

}

module.exports = new CandidateFilterService();