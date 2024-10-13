import { Knex } from "knex";
import { addCommonFields } from "../utils/abstractEntity";

const transactionsSchema = (table: Knex.CreateTableBuilder) => {
  addCommonFields(table);
  table.string('type').notNullable();
  table.decimal('amount', 10, 2).notNullable();
  table.string('status').notNullable();
  table
    .uuid('wallet_id')
    .references('id')
    .inTable('wallets')
    .onDelete('CASCADE');
};

export default transactionsSchema;
