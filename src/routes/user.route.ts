import { Router } from 'express'
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from '../controllers/user.controller'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile routes
 */

/**
 * @swagger
 * /api/v1/user/:
 *   get:
 *     summary: Get all user.
 *     description: View all user.
 *     responses:
 *       '200':
 *         description: Successful
 *       '500':
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 'Input Error':
 *                   type: string
 *     tags:
 *       - User
 */
router.get('/user', getAllUsers)

/**
 * @swagger
 * /api/v1/user/{userId}:
 *   get:
 *     summary: Get a user by id.
 *     description: View a user profile.
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: The ID of the user to update.
 *         required: true
 *         type: string
 *     responses:
 *       '200':
 *         description: Successful
 *       '500':
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 'Input Error':
 *                   type: string
 *     tags:
 *       - User
 */
router.get('/user/:id', getUser)

/**
 * @swagger
 * /api/v1/user/{userId}:
 *   patch:
 *     summary: Update a user by ID.
 *     description: Update a user's information by providing its ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         description: The ID of the user to update.
 *         required: true
 *         type: string
 *       - in: body
 *         name: updateUser
 *         description: Updated user data.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *             bio:
 *               type: string
 *             profileImage:
 *               type: string
 *             coverImage:
 *               type: string
 *             googleAccountID:
 *               type: string
 *             displayName:
 *               type: string
 *             firstName:
 *               type: string
 *             lastName:
 *               type: string
 *             Role:
 *               type: string
 *             slug:
 *               type: string
 *             otp_enabled:
 *               type: boolean
 *             otp_verified:
 *               type: boolean
 *             isVerified:
 *               type: boolean
 *             # Add other properties based on your Prisma User schema
 *         example:
 *           email: "updated@example.com"
 *           password: "newpassword"
 *           bio: "Updated user bio"
 *           profileImage: "https://updated-profile-image.com"
 *           coverImage: "https://updated-cover-image.com"
 *           googleAccountID: "updated-google-id"
 *           displayName: "Updated Display Name"
 *           firstName: "Updated First Name"
 *           lastName: "Updated Last Name"
 *           Role: "User"
 *           slug: "updated-slug"
 *           otp_enabled: true
 *           otp_verified: true
 *           isVerified: true
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                     # Add other properties based on your Prisma User schema
 *                 statusCode:
 *                   type: integer
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 'Input Error':
 *                   type: string
 *       '404':
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 'Input Error':
 *                   type: string
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 'Input Error':
 *                   type: string
 *     tags:
 *       - User
 */
router.patch('/user/:id', updateUser)

/**
 * @swagger
 * /api/v1/user/{userId}:
 *   delete:
 *     summary: Delete a user by id.
 *     description: Deletes a user profile.
 *     responses:
 *       '204':
 *         description: Successful
 *       '500':
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 'Input Error':
 *                   type: string
 *     tags:
 *       - User
 */
router.delete('/user/:id', deleteUser)

module.exports = router
