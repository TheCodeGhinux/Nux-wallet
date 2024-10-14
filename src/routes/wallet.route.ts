import express, { Router } from 'express';

import { checkWalletBalance, createWallet, findUserWallet, findWallets, getWallet, transferFunds} from '../controllers/wallet.controller';
import { adminUserGuard, authenticateJWT, userWalletGuard } from '../middlewares';

const router: Router = express.Router();

router.post("/wallet/", authenticateJWT, createWallet)
router.get('/wallet/', userWalletGuard, findUserWallet);
router.get('/wallet/balance', userWalletGuard, checkWalletBalance);
router.post('/wallet/transfer', userWalletGuard, transferFunds);
// Create wallet for a user as an admin
router.post("/wallet/:userId", adminUserGuard, createWallet)
// Get wallet by ID or account number
router.get('/wallet/:identifier', userWalletGuard, getWallet);

router.get('/wallet/find', adminUserGuard, findWallets);

module.exports = router;