import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { getUserById } from '../helpers/user.helper';
import {
  findWalletByAcoountNumber,
  findWalletById,
  findWalletByUserId,
} from '../helpers/wallet.helper';

dotenv.config();

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: Date;
  updated_at: Date;
}

const adminRole = 'admin';
const secretKey = process.env.JWT_SECRET || 'your-secret-key';
export const userWalletGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const identifier = req.params.identifier;
  const tokenFromCookie = req.cookies?.access_token;

  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (tokenFromCookie) {
    token = tokenFromCookie;
  } else {
    return res.status(401).json({ message: 'Authorization token missing for user' });
  }
  

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    const user = decoded as JwtPayload;
    req.user = user;

    const currentUser = await getUserById(user.userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    let wallet: Wallet;

    // Find wallet by identifier (walletId or accountNumber)
    if (identifier) {
      wallet =
        (await findWalletById(identifier)) ||
        (await findWalletByAcoountNumber(identifier));
    }
    if (!identifier) {
      wallet = await findWalletByUserId(user.userId);
      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
      }
    }
    // Check if user is admin or the owner of the wallet
    if (user.role !== adminRole && wallet.user_id !== user.userId) {
      return res
        .status(403)
        .json({ message: "You don't have permission to access this wallet" });
    }
    next();
  });
};
