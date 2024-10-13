import { Knex } from 'knex';
import { addCommonFields } from '../utils/abstractEntity';

const walletSchema = (table: Knex.CreateTableBuilder) => {
  addCommonFields(table);
  table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
  table.string('account_number').notNullable().unique();
  table.integer('balance').notNullable();
};

export default walletSchema;
