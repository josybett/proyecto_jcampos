import { Router } from "express";
import { isAuthenticated, isNotAuthenticated, isAuthenticatedLogin } from '../middleware/auth.js';
import { viewCart, viewDetailProduct, viewHome, viewLogin, viewRealtimeProducts, viewRegister } from "../controllers/viewsRouterController.js";

export const router = Router()

router.get('/products', isAuthenticated, viewHome)
router.get('/realtimeproducts', viewRealtimeProducts)
router.get('/detail/:pid', viewDetailProduct)
router.get('/cart/:cid', isAuthenticatedLogin, viewCart)
router.get('/login', isNotAuthenticated, viewLogin)
router.get('/register', isNotAuthenticated, viewRegister)