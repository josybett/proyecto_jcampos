import { Router } from 'express';
import { addProductCart, deleteCart, deleteProductCart, getCartById, saveCart, updateCart, purchaseCart } from '../controllers/cartController.js';
import { isAuthenticatedLogin, hasRole } from '../middleware/auth.js';

export const router = Router()

router.post('/', saveCart)
router.get('/:cid', getCartById)
router.post('/:cid/product/:pid', isAuthenticatedLogin, hasRole(['user']), addProductCart)
router.delete('/:cid/products/:pid', isAuthenticatedLogin, hasRole(['user']), deleteProductCart)
router.put('/:cid', updateCart)
router.delete('/:cid', deleteCart)
router.post('/:cid/purchase', purchaseCart)