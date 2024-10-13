import { Knex } from 'knex';
import userSchema from '../schemas/UserSchema';
import auditLogSchema from '../schemas/AuditLog';
import transferSchema from '../schemas/TransferSchema';
import transactionLogSchema from '../schemas/TransLog';
import transactionsSchema from '../schemas/TransactionSchema';
import walletSchema from '../schemas/WalletSchema';
import userProfileSchema from '../schemas/UserProfileSchema';

export const up = async (knex: Knex) => {
  await knex.schema
    .createTable('users', userSchema)
    .createTable('user_profiles', userProfileSchema) 
    .createTable('wallets', walletSchema)
    .createTable('transactions', transactionsSchema)
    .createTable('transfers', transferSchema)
    .createTable('transaction_logs', transactionLogSchema)
    .createTable('audit_logs', auditLogSchema);
};

export const down = async (knex: Knex) => {
  await knex.schema
    .dropTableIfExists('audit_logs')
    .dropTableIfExists('transaction_logs')
    .dropTableIfExists('transfers')
    .dropTableIfExists('transactions')
    .dropTableIfExists('wallets')
    .dropTableIfExists('user_profiles')
    .dropTableIfExists('users')
};
