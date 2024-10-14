import express, { Router } from 'express';

import { checkWalletBalance, createWallet, findUserWallet, findWallets, fundWallet, getWallet, transferFunds} from '../controllers/wallet.controller';
import { adminUserGuard, authenticateJWT, userWalletGuard } from '../middlewares';

const router: Router = express.Router();

router.post("/wallet/", authenticateJWT, createWallet)
router.get('/wallet/', userWalletGuard, findUserWallet);
router.get('/wallet/balance', userWalletGuard, checkWalletBalance);
router.post('/wallet/transfer', userWalletGuard, transferFunds);
router.post('/wallet/deposit', userWalletGuard, fundWallet);
// Get wallet by ID or account number
router.get('/wallet/find/:identifier', userWalletGuard, getWallet);
// Create wallet for a user as an admin
router.get('/wallet/admin/find', adminUserGuard, findWallets);
router.post("/wallet/create/:userId", adminUserGuard, createWallet)


module.exports = router;