import { Knex } from 'knex';
import { addCommonFields } from '../utils/abstractEntity';

const userSchema = (table: Knex.CreateTableBuilder) => {
  addCommonFields(table);
  table.string('first_name').notNullable();
  table.string('last_name').notNullable();
  table.string('email').notNullable().unique();
  table.string('password').notNullable();
  table.string('phone').nullable();
  table.string('role').notNullable().defaultTo('user');
};

export default userSchema;
