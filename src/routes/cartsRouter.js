import { Router } from 'express';
import { addProductCart, deleteCart, deleteProductCart, getCartById, saveCart, updateCart } from '../controllers/cartController.js';

export const router = Router()

router.post('/', saveCart)
router.get('/:cid', getCartById)
router.post('/:cid/product/:pid', addProductCart)
router.delete('/:cid/products/:pid', deleteProductCart)
router.put('/:cid', updateCart)
router.delete('/:cid', deleteCart)