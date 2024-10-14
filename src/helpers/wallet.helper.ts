import knex from '../db/db';

interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: Date;
  updated_at: Date;
}

export const findWalletByUserId = async (userId: string) => {
  try {
    const wallet = await knex('wallets').where({ user_id: userId }).first();

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
  if (!walletId) {
    throw new Error('Wallet ID is required but was not provided.');
  }
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
    const wallet = await knex('wallets')
      .where({ account_number: accountNumber })
      .first();

    return wallet || null;
  } catch (error) {
    console.error('Error finding wallet by Acoount number:', error);
    throw new Error('Error finding wallet by Acoount number');
  }
};

// Function to find user by wallet ID
export const findUserByWalletId = async (walletId: string) => {
  try {
    // Fetch the wallet associated with the given walletId
    const wallet = await knex('wallets')
      .select('user_id')
      .where('id', walletId)
      .first();

    // If no wallet found, return null or throw an error
    if (!wallet) {
      return null;
    }

    // Fetch the user associated with the user_id from the wallet
    const user = await knex('users')
      .select('*')
      .where('id', wallet.user_id)
      .first();

    return user;
  } catch (error) {
    console.error('Error fetching user by wallet ID:', error);
    throw error;
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
