import type { Knex } from "knex";


exports.up = function(knex: Knex) {
  return knex.schema.table('wallets', function(table) {
    table.index('account_number');
    table.index('user_id');
  });
};

exports.down = function(knex: Knex) {
  return knex.schema.table('wallets', function(table) {
    table.dropIndex('account_number');
    table.dropIndex('user_id');
  });
};
