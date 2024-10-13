import express, { Router} from "express";
import {
  loginUser,
  // login,
  register,
} from "../controllers/auth.controller";

// import { confirmPasswordChange } from "../controllers/user.controller";

// import { authenticateJWT } from "../middlewares/auth";

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization routes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *     UserResponse:
 *       type: object
 *       properties:
 *         userID:
 *           type: string
 *         email:
 *           type: string
 *     LoginCredentials:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *     AuthorizationResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 */

/**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.post("/auth/register", register);

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginCredentials'
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       '401':
 *         description: Unauthorized - Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/auth/login", loginUser);

/**
 * @swagger
 * /api/v1/logout:
 *   delete:
 *     summary: Log out the current user
 *     tags: [Authentication]
 *     responses:
 *       '302':
 *         description: Redirect to the home page after successful logout
 *         headers:
 *           Location:
 *             description: URL to redirect after logout
 *             schema:
 *               type: string
 *       '401':
 *         description: Unauthorized - User not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/logout", function (req, res, next) {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("https://evento1.vercel.app");
    });
  }
});


module.exports = router;
