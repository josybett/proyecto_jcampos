import {Router} from 'express';
import { deleteProduct, getProduct, getProductById, saveProduct, updateProduct } from '../controllers/productController.js';
import { isAuthenticatedLogin, hasRole } from '../middleware/auth.js';

export const router = Router()

router.get('/', getProduct)
router.get('/:pid', getProductById)
router.post('/', isAuthenticatedLogin, hasRole(['admin']), saveProduct)
router.put('/:pid', isAuthenticatedLogin, hasRole(['admin']), updateProduct)
router.delete('/:pid', isAuthenticatedLogin, hasRole(['admin']), deleteProduct)