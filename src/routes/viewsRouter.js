import { Router } from "express";
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';
import { viewCart, viewDetailProduct, viewHome, viewLogin, viewRealtimeProducts, viewRegister } from "../controllers/viewsRouterController.js";

export const router = Router()

router.get('/', isAuthenticated, viewHome)
router.get('/realtimeproducts', viewRealtimeProducts)
router.get('/detail/:pid', viewDetailProduct)
router.get('/cart/:cid', viewCart)
router.get('/login', isNotAuthenticated, viewLogin)
router.get('/register', isNotAuthenticated, viewRegister)