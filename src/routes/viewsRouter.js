import { Router } from "express";
import { ProductManagerMongo } from "../dao/classes/productManagerMongo.js";
import { CartsManagerMongo } from '../dao/classes/cartsManagerMongo.js';

export const router = Router()
const pm = new ProductManagerMongo()
const cm = new CartsManagerMongo()

router.get('/', async (req, res) => {
    let products = await pm.getProducts(req.query)
    console.log('home', products)
    res.status(200).render('home', {products})
})

router.get('/realtimeproducts', async (req,res)=>{
    let products = await pm.getProducts(req.query)
    res.status(200).render('realTimeProducts', {products: products.payload})
})

router.get('/detail/:pid', async (req, res) => {
    let id = req.params.pid
    let producto = await pm.getProductById(id)
    res.status(200).render('detail', {producto})
})

router.get('/cart/:cid', async (req, res) => {
    let id = req.params.cid
    let cart = await cm.getCartById(id)
    console.log('cart', {cart: cart.data})
    res.status(200).render('cart', {cart: cart.data})
})