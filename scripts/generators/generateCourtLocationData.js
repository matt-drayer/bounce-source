const fs = require('fs');
const path = require('path');
const getCourtLocations = require('../graphql/getCourtLocations');

const WRITE_LOCATION = path.join(__dirname, '../../src/constants/data/courtLocations.json');

const run = async () => {
  const courtLocations = await getCourtLocations();
  fs.writeFileSync(WRITE_LOCATION, JSON.stringify(courtLocations));
};

run();
