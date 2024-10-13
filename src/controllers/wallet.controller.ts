import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '../utils';
import { BadRequestError, NotFoundError } from '../middlewares';
import knex from '../db/db';
import { get } from 'http';
import { fieldValidation, getUserById } from '../helpers/user.helper';
import {
  findUserByWalletId,
  findWalletByUserId,
  generateAccountNumber,
} from '../helpers/wallet.helper';
import walletSchema from '../db/schemas/WalletSchema';
import { v4 as uuidv4 } from 'uuid';

export const createWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user['userId'];
    // Find user and check if user has a wallet
    const user = await getUserById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const existingWallet = await findWalletByUserId(userId);

    if (existingWallet) {
      throw new BadRequestError('User already has a wallet');
    }

    const accountNumber = await generateAccountNumber();
    // Create a new wallet for the user
    const newWallet = {
      id: uuidv4(),
      user_id: userId,
      balance: 0,
      account_number: accountNumber,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Insert the new wallet into the database
    await knex('wallets').insert(newWallet);
    const createdWallet = await knex('wallets')
      .where({ id: newWallet.id })
      .first();

    const walletResponse = {
      id: createdWallet.id,
      balance: createdWallet.balance,
      account_number: createdWallet.account_number,
      createdAt: createdWallet.created_at,
      updatedAt: createdWallet.updated_at,
    };
    ResponseHandler.success(
      res,
      walletResponse,
      201,
      'Wallet created successfully'
    );
  } catch (error) {
    next(error);
  }
};

// export const fundWallet = (req: Request, res: Response, next: NextFunction) => {}

export const transferFunds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { toAccountNumber, amount } = req.body;
  const userId = req.user['userId'];
  let fromAccountNumber: string;
  let sender_name: string;
  let recipient_name: string;

  const requiredFields = ['toAccountNumber', 'amount'];

  const fieldDisplayNames = {
    toAccountNumber: 'Recipient account number',
    amount: 'Amount',
  };

  fieldValidation(requiredFields, fieldDisplayNames, req.body);

  try {
    // Validate the transfer amount
    if (amount <= 100) {
      throw new Error("Amount can't be less than 100");
    }

    // Start a database transaction
    await knex.transaction(async (trx) => {
      // Fetch the source account
      const sourceAccount = await findWalletByUserId(userId);
      if (!sourceAccount) {
        throw new Error('Sender account not found');
      }
      fromAccountNumber = sourceAccount.account_number;
      const sender = await getUserById(userId)
      sender_name = sender.first_name + ' ' + sender.last_name
      // Check if the source account has sufficient balance
      if (sourceAccount.balance < amount) {
        throw new Error('Insufficient balance');
      }

      // Fetch the destination account
      const toAccount = await trx('wallets')
        .where('account_number', toAccountNumber)
        .first();
      if (!toAccount) {
        throw new Error('Destination account not found');
      }

      const recipient = await findUserByWalletId(toAccount.id)
      recipient_name = recipient.first_name + ' ' + recipient.last_name
      // Debit source account
      await trx('wallets')
        .where('account_number', fromAccountNumber)
        .update({
          balance: knex.raw('balance - ?', [amount]),
          updated_at: knex.fn.now(),
        });

      // Credit destination account
      await trx('wallets')
        .where('account_number', toAccountNumber)
        .update({
          balance: knex.raw('balance + ?', [amount]),
          updated_at: knex.fn.now(),
        });

      // Insert into the `transfer` table
      await trx('transfers').insert({
        id: uuidv4(),
        sender_wallet_id: sourceAccount.id,
        sender_account_number: fromAccountNumber,
        receiver_wallet_id: toAccount.id,
        receiver_account_number: toAccount.account_number,
        amount: amount,
        created_at: knex.fn.now(),
      });

      // Fetch the transfer operation ID
      const [transfer] = await trx('transfers')
        .where({
          sender_wallet_id: sourceAccount.id,
          receiver_wallet_id: toAccount.id,
          amount: amount,
        })
        .select('id')
        .orderBy('created_at', 'desc')
        .limit(1);

      const transferId = transfer.id;

      // Insert into `transactions` table, linking the transfer operation
      await trx('transactions').insert({
        id: transferId,
        type: 'TRANSFER',
        amount: amount,
        status: 'SUCCESS',
        wallet_id: sourceAccount.id,
        operation_id: transferId, // Link to the specific transfer operation
        created_at: knex.fn.now(),
      });

      // Log details in `transaction_log`
      await trx('transaction_logs').insert({
        id: uuidv4(),
        transaction_id: transferId,
        description: `Transfer of ${amount} from ${fromAccountNumber} to ${toAccountNumber}`,
        created_at: knex.fn.now(),
      });
    });

    const responseData = {
      sender: sender_name,
      fromAccount: fromAccountNumber,
      amount: amount,
      recipient: recipient_name,
      toAccount: toAccountNumber,
    };
    // If everything was successful
    ResponseHandler.success(res, responseData, 200, 'Transfer successful');
  } catch (error) {
    next(error);
  }
};

export const checkWalletBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user['userId'];
    const userWallet = await findWalletByUserId(userId);
    if (!userWallet) {
      throw new NotFoundError('User has not created wallet');
    }
    const walletBalance = {
      balance: userWallet.balance,
      account_number: userWallet.account_number,
    };
    ResponseHandler.success(
      res,
      walletBalance,
      200,
      'Wallet Balance fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};
