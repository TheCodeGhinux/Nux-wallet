import { PrismaClient } from '@prisma/client'
import { BadRequestError } from '../middlewares'
import knex from '../db/db';


const prisma = new PrismaClient()



export const getUserById = async (id: string) => {
  return await knex
    .select()
    .from('users')
    .where('id', id)
    .then((user) => {
      return user[0];
    });
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
  return
};