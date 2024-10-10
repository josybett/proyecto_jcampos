import { Router } from 'express';
import { deleteProductFS, getProductFS, getProductFSById, saveProductFS, updateProductFS } from '../controllers/productoFSController';

export const router = Router()

router.get('/', getProductFS)
router.get('/:pid', getProductFSById)
router.post('/', saveProductFS)
router.put('/:pid', updateProductFS)
router.delete('/:pid', deleteProductFS)