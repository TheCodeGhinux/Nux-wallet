import { Knex } from 'knex';
import { addCommonFields } from '../utils/abstractEntity';

const transferSchema = (table: Knex.CreateTableBuilder) => {
  addCommonFields(table);
  table
    .uuid('sender_wallet_id')
    .references('id')
    .inTable('wallets')
    .onDelete('CASCADE');
  table.string('sender_account_number');
  table
  .uuid('receiver_wallet_id')
  .references('id')
  .inTable('wallets')
  .onDelete('CASCADE');
  table.string('receiver_account_number');
  table.decimal('amount', 10, 2).notNullable();
};

export default transferSchema;
