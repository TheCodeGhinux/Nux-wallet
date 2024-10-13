import { PrismaClient } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../middlewares';
import knex from '../db/db';

const prisma = new PrismaClient();

export const getUserById = async (id: string) => {
  try {
    const user = await knex
      .select()
      .from('users')
      .where('id', id)
      .then((user) => {
        return user[0];
      });

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error(`Error finding user with id ${id}: `, error);
    throw new Error('Unable to fetch user');
  }
};

export const fieldValidation = (requiredFields, fieldDisplayNames, data) => {
  // const missingFields = requiredFields.filter((field) => !req.body[field]);
  const missingFields = requiredFields.filter((field) => !data[field]);
  if (missingFields.length > 0) {
    const errorMessage =
      missingFields.length === 1
        ? `${fieldDisplayNames[missingFields[0]]} is required`
        : `${missingFields
            .map((field) => fieldDisplayNames[field])
            .join(', ')} are required`;

    throw new BadRequestError(errorMessage);
  }
  return;
};
