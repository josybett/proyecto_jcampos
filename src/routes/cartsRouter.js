import {Router} from 'express';
import { CartsManagerMongo } from '../dao/classes/cartsManagerMongo.js';
import mongoose from "mongoose"

export const router = Router()
const cm = new CartsManagerMongo();

router.post('/', async (req,res)=>{
    let {success, code, message} = await cm.addCarts(req.body)

    res.setHeader('Content-Type','application/json')
    res.status(code).json({'success':success, 'resultado': message})
})

router.get('/:cid', async (req,res)=>{
    let id = req.params.cid
    res.setHeader('Content-Type','application/json');

    let {success, code, message, data} = await cm.getCartById(id)
    if (!success) {
        return res.status(code).json({message})
    }

    res.status(200).json(data)
})

router.post('/:cid/product/:pid', async (req,res)=>{
    let cid = req.params.cid
    let pid = req.params.pid
    let qt = req.body?.quantity ?? 1
    res.setHeader('Content-Type','application/json');

    if(!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({error:`Ingrese un argumento id válido`})
    }

    qt=parseInt(qt)
    if(isNaN(qt)){
        return res.status(400).json({error:`quantity debe ser numérico`})
    }
    if(qt <= 0){
        return res.status(400).json({error:`quantity debe ser mayor a 0`})
    }
    let {success, code, message} = await cm.updateCarts(cid, pid, qt)
    res.status(code).json({'success': success, 'resultado': message})
})


router.delete('/:cid/products/:pid', async (req,res)=>{
    let {cid, pid } = req.params
    res.setHeader('Content-Type','application/json');

    let {success, code, message, data} = await cm.deleteCartProductById(cid, pid)
    res.status(code).json({'success': success, 'resultado': message})
})

router.put('/:cid', async (req,res)=>{
    let cid = req.params.cid
    let products = req.body?.products
    res.setHeader('Content-Type','application/json');

    if(!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(400).json({error:`Ingrese un argumento id válido`})
    }

    if (!Array.isArray(products)) {
        return res.status(400).json({error:`products debe ser un array`})
    }

    let {success, code, message} = await cm.updateCartsById(cid, products)
    res.status(code).json({'success': success, 'resultado': message})
})

router.delete('/:cid', async (req,res)=>{
    let cid = req.params.cid
    res.setHeader('Content-Type','application/json');

    if(!mongoose.Types.ObjectId.isValid(cid)) {
        return res.status(400).json({error:`Ingrese un argumento id válido`})
    }

    let {success, code, message, data} = await cm.deleteCartProduct(cid)
    res.status(code).json({'success': success, 'resultado': message})
})