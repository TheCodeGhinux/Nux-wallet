import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getUserById } from '../helpers/user.helper';
import { findWalletByAcoountNumber } from '../helpers/wallet.helper';



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
export const adminUserGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const tokenFromCookie = req.cookies?.token;
  const walletId = req.params?.walletId;
  const accountNumber = req.params?.accountNumber;

  let token = '';
  let walletUser = null;

  if(walletId) {
    walletUser = await getUserById(walletId);
  } else if (accountNumber) {
    walletUser = await findWalletByAcoountNumber(accountNumber);
    console.log(walletUser);
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (tokenFromCookie) {
    token = tokenFromCookie;
  } else {
    return res.status(401).json({ message: 'Authorization token missing for admin' });
  }

  jwt.verify(token, secretKey, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    // req.user = decoded;
    const user = decoded as JwtPayload;
    req.user = user;

    const currentUser = await getUserById(user.userId);

    if (user.role != adminRole ) {
      return res
        .status(403)
        .json({ message: "You don't have permission to perform action" });
    }

    next();
  });
};
