import express, { Router } from 'express';

import { checkWalletBalance, createWallet, transferFunds} from '../controllers/wallet.controller';
import { adminUserGuard, authenticateJWT, userWalletGuard } from '../middlewares';

const router: Router = express.Router();

router.post("/wallet/", authenticateJWT, createWallet)
// router.get('/wallet/', userWalletGuard, findWalletById);
router.get('/wallet/balance', userWalletGuard, checkWalletBalance);
router.post('/wallet/transfer', userWalletGuard, transferFunds);
// Create wallet for a user as an admin
// router.post("/wallet/:userId", authenticateJWT, createWallet)
// router.get('/wallet/:walletId', adminUserGuard, findWalletById);
// router.get('/wallet/find', adminUserGuard, findWallets);

module.exports = router;