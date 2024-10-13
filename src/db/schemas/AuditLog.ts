import { Knex } from 'knex';
import { addCommonFields } from '../utils/abstractEntity';

const userSchema = (table: Knex.CreateTableBuilder) => {
  addCommonFields(table);
  table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
  table.string('action').notNullable();
};

export default userSchema;
