import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const adminRole = 'admin';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';
export const adminUserGuard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const tokenFromCookie = req.cookies?.token;

  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (tokenFromCookie) {
    token = tokenFromCookie;
  } else {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded;

    if (decoded.role != adminRole) {
      return res
        .status(403)
        .json({ message: "You don't have permission to perform action" });
    }

    next();
  });
};
