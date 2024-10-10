import { ProductManagerDao } from "../dao/classes/productManagerDao.js";
import { CartsManagerDao } from '../dao/classes/cartsManagerDao.js';

const pm = new ProductManagerDao()
const cm = new CartsManagerDao()

export const viewHome = async (req, res) => {
    let products = await pm.getProducts(req.query)
    console.log('home', products)
    res.status(200).render('home', {products})
}

export const viewRealtimeProducts = async (req,res)=>{
    let products = await pm.getProducts(req.query)
    res.status(200).render('realTimeProducts', {products: products.payload})
}

export const viewDetailProduct = async (req, res) => {
    let id = req.params.pid
    let producto = await pm.getProductById(id)
    res.status(200).render('detail', {producto})
}

export const viewCart = async (req, res) => {
    let id = req.params.cid
    let cart = await cm.getCartById(id)
    console.log('cart', {cart: cart.data})
    res.status(200).render('cart', {cart: cart.data})
}

export const viewLogin = (req, res) => {
    res.render('login');
}

export const viewRegister = (req, res) => {
    res.render('register');
}