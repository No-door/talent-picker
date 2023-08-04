// importData.js
const fs = require('fs');
const { Client } = require('elasticsearch');
const searchEngine = require('./elastic-search/search-engine');

const client = new Client({ node: 'http://localhost:9200' }); // Replace with your Elasticsearch endpoint

const indexName = 'candidates'; // Replace with your desired index name
const docType = '_doc';

async function importData() {
  try {
    const fileContent = fs.readFileSync('candidates.json', 'utf8');
    const data = JSON.parse(fileContent).candidates;

    let bulkBody = [];
    data.forEach(item => {
      bulkBody.push({ index: { _index: indexName, _type: docType, _id: item.id } });
      bulkBody.push(item);
    });

    const { body: bulkResponse } = await client.bulk({ refresh: true, body: bulkBody });

    console.log(`Successfully imported ${data.length} items into ${indexName}`);
  } catch (error) {
    console.error(error);
  }
}

// Function to delete the index
async function deleteIndex() {
  try {
    const response = await client.indices.delete({
      index: indexName,
    });
    console.log(`Index '${indexName}' deleted:`, response);
  } catch (error) {
    console.error('Error deleting index:', error);
  }
}

deleteIndex();
importData();
