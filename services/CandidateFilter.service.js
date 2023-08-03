var searchEngine = require('../elastic-search/search-engine');

class CandidateFilterService {
  constructor() {
    this.searchEngine = searchEngine;
  }

  async getCandidates(params) {
    try {
      const { status, filter } = params;

      const { skill, english, level, FTE } = filter;

      const shouldQueries = [];

      if (Array.isArray(skill) && skill.length > 0) {
        var matchSkills = [];
        skill.forEach(element => {
          matchSkills.push({ match: { skill: element } });
        });
        var skillQuery = {
          bool: {
            should: matchSkills,
            minimum_should_match: 1
          }
        }

        shouldQueries.push(skillQuery);
      }

      if (typeof english === 'number') {
        // Use Range Query for 'english' field
        shouldQueries.push({ range: { english: { gte: english } } });
      }

      if (typeof FTE === 'number') {
        // Use Range Query for 'english' field
        shouldQueries.push({ range: { FTE: { lte: FTE } } });
      }

      if (level) {
        // Use Match Query for 'level' field
        shouldQueries.push({ match: { level: level } });
      }

      const query = {
        query: {
          bool: {
            must: shouldQueries,
          },
        },
      };

      // const allQuery = {
      //   query: {
      //     match_all: {}
      //   }
      // }

      var result = await searchEngine.search(query);
      const candidates = result.results.map(element => element._source);
      return candidates;
    } catch (error) {
      console.error('Error querying candidates:', error);
      throw error;
    }
  }

}

module.exports = new CandidateFilterService();