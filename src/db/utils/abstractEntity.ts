import { Knex } from 'knex';
import knex from './knexInstance';

export const addCommonFields = (table: Knex.CreateTableBuilder): void => {
  table.uuid('id').primary().unique();
  table.timestamp('created_at').defaultTo(knex.fn.now());
  table.timestamp('updated_at').nullable();
    
};
