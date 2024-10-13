import { Knex } from "knex";
import { addCommonFields } from "../utils/abstractEntity";


const userProfileSchema = (table: Knex.CreateTableBuilder) => {
  addCommonFields(table);
  table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
  table.string('avatar');
  table.string('address');
  table.string('bank_details');
};

export default userProfileSchema;
