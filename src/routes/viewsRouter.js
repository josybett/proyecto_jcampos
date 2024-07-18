import { Router } from "express";
import { ProductManager } from "../productManagerFS.js";

export const router = Router()
const pm = new ProductManager()

router.get('/', async (req, res) => {
    let products = await pm.getProducts()
    res.status(200).render('home', {products})
})

router.get('/realtimeproducts', async (req,res)=>{
    let products = await pm.getProducts()
    res.status(200).render('realTimeProducts', {products})
})