import Knex from 'knex';
import * as knexConfig from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';
const knex = Knex(knexConfig[environment]);

export default knex;
