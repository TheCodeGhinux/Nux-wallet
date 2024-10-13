import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '../utils';
import { BadRequestError, NotFoundError } from '../middlewares';
import knex from '../db/db';
import { get } from 'http';
import { fieldValidation, getUserById } from '../helpers/user.helper';
import { findWalletByUserId, generateAccountNumber } from '../helpers/wallet.helper';
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
