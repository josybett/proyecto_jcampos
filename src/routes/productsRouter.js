import {Router} from 'express';
import { deleteProduct, getProduct, getProductById, saveProduct, updateProduct } from '../controllers/productController.js';

export const router = Router()

router.get('/', getProduct)
router.get('/:pid', getProductById)
router.post('/', saveProduct)
router.put('/:pid', updateProduct)
router.delete('/:pid', deleteProduct)