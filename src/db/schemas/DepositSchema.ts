import { Knex } from 'knex';
import { addCommonFields } from '../utils/abstractEntity';

const depositSchema = (table: Knex.CreateTableBuilder) => {
  addCommonFields(table);
  table
    .uuid('wallet_id')
    .references('id')
    .inTable('wallets')
    .onDelete('CASCADE');
  table.string('account_number');
  table.decimal('amount', 10, 2).notNullable();
};

export default depositSchema;
