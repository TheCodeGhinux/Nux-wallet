// eslint-disable-next-line @typescript-eslint/no-require-imports
const knexConfig = require('../../../knexfile');
// import * as knexConfig from '../../../knexfile'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const knex = require('knex')(knexConfig.development);

export default knex;