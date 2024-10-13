import { Request, Response, NextFunction, RequestHandler } from 'express';
import bycrpt from 'bcryptjs';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
} from '../middlewares';
import { ResponseHandler } from '../utils/responsehandler';
import jwt from 'jsonwebtoken';
import knex from '../db/db';
import { CreateUserDto } from '../dtos/user/create-user.dto';
import { fieldValidation } from '../helpers/user.helper';
import { v4 as uuidv4 } from 'uuid';

// Assuming you have a secret for JWT signing
const jwtSecret = process.env.JWT_SECRET;

const userRepo = knex('users');

const getUser = async (email: string) => {
  return await knex
    .select()
    .from('users')
    .where('email', email)
    .then((user) => {
      return user[0];
    });
};

export const register: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      phone,
      role,
    }: CreateUserDto = req.body;
    const requiredFields = ['email', 'password', 'first_name', 'last_name'];

    const fieldDisplayNames = {
      email: 'Email',
      password: 'Password',
      first_name: 'First Name',
      last_name: 'Last Name',
    };

    fieldValidation(requiredFields, fieldDisplayNames, req.body);

    if (password.length < 6) {
      throw new BadRequestError('Password must be at least 6 characters');
    }

    const hashedPassword = await bycrpt.hash(password, 10);

    const user = await getUser(email);
    if (user) {
      throw new BadRequestError('User already exists');
    }

    const newUser = new CreateUserDto();
    Object.assign(newUser, req.body);
    newUser.id = uuidv4();
    newUser.password = hashedPassword;

    await userRepo.insert(newUser);

    const createdUser = await getUser(newUser.email);

    if (!createdUser) {
      throw new BadRequestError('Failed to create user');
    }

    const userWithoutPassword = {
      id: createdUser.id,
      email: createdUser.email,
      firstName: createdUser.first_name,
      lastName: createdUser.last_name,
      phone: createdUser.phone,
      role: createdUser.role,
    };

    ResponseHandler.success(
      res,
      userWithoutPassword,
      201,
      'User created successfully'
    );
  } catch (error) {
    next(error);
  }
};
// export const login = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   passport.authenticate("local", function (err, user, info) {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return next(new UnauthorizedError("Invalid email or password"));
//     }
//     req.logIn(user, function (err) {
//       const userWithoutPassword = {
//         id: user.userID,
//       };
//       const token = jwt.sign(userWithoutPassword, process.env.JWT_SECRET, {
//         expiresIn: "2 days",
//       });
//       if (err) {
//         return next(err);
//       }
//       return ResponseHandler.success(
//         res,
//         { userId: userWithoutPassword.id, token },
//         200,
//         "Login successful"
//       );
//     });
//   })(req, res, next);
// };

// async function loginUser(req: Request, user: any) {
//   return new Promise((resolve, reject) => {
//     req.logIn(user, (err) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(user);
//       }
//     });
//   });
// }

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const requiredFields = ['email', 'password'];

    const fieldDisplayNames = {
      email: 'Email',
      password: 'Password',
    };

    fieldValidation(requiredFields, fieldDisplayNames, req.body);

    const user = await getUser(email);
    if (!user) {
      throw new BadRequestError('User not registered, please sign up');
    }

    const isMatch = await bycrpt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestError('Incorrect email or password');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '2d' });

    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
    };

    ResponseHandler.success(
      res,
      {
        access_token: token,
        user: userWithoutPassword,
      },
      200,
      'Login successful'
    );
  } catch (error) {
    next(error);
  }
};
