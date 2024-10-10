import { Router } from 'express';
import { getAllCartFS, getCartFSById, addCartFSProduct} from '../controllers/cartFSController.js'

export const router = Router()

router.post('/', getAllCartFS)
router.get('/:cid', getCartFSById)
router.post('/:cid/product/:pid', addCartFSProduct)