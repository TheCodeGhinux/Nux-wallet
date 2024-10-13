import knex from '../db/db';

interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: Date;
  updated_at: Date;
}

export const findWalletByUserId = async (
  userId: string
) => {
  try {
    const wallet = await knex('wallets')
      .where({ user_id: userId })
      .first();

    if (!wallet) {
      return null;
    }

    return wallet;
  } catch (error) {
    console.error(`Error finding wallet for userId ${userId}: `, error);
    throw new Error('Unable to fetch wallet');
  }
};

export const findWalletById = async (walletId: string) => {
  try {
    const wallet = await knex('wallets').where({ id: walletId }).first();

    return wallet || null;
  } catch (error) {
    console.error('Error finding wallet by ID:', error);
    throw new Error('Error finding wallet by ID');
  }
};

export const findWalletByAcoountNumber = async (accountNumber: string) => {
  try {
    const wallet = await knex('wallets').where({ account_number: accountNumber }).first();

    return wallet || null;
  } catch (error) {
    console.error('Error finding wallet by Acoount number:', error);
    throw new Error('Error finding wallet by Acoount number');
  }
};

export const generateAccountNumber = async (): Promise<string> => {
  let accountNumber: string;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random 7-digit number
    const randomDigits = Math.floor(Math.random() * 10000000);
    accountNumber = '937' + randomDigits.toString().padStart(7, '0'); // Pad to 7 digits

    // Check if the account number is unique
    const existingAccount = await knex('wallets')
      .where({ account_number: accountNumber })
      .first();
    isUnique = !existingAccount; // If no existing account, it is unique
  }

  return accountNumber;
};
