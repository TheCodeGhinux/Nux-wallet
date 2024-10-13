import { Knex } from "knex";
import { addCommonFields } from "../utils/abstractEntity";

const transactionLogSchema = (table: Knex.CreateTableBuilder) => {
  addCommonFields(table);
  table
    .uuid('transaction_id')
    .references('id')
    .inTable('transactions')
    .onDelete('CASCADE');
  table.string('description').notNullable();
};

export default transactionLogSchema;
