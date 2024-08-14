import {Router} from 'express';
import { ProductManagerMongo } from '../dao/classes/productManagerMongo.js';
import { socketServer } from '../app.js';
import mongoose from "mongoose"

export const router = Router()
const pmm = new ProductManagerMongo();

router.get('/', async (req,res)=>{
    let resultado = await pmm.getProducts(req.query)

    res.setHeader('Content-Type','application/json')
    res.status(200).json(resultado)
})

router.get('/:pid', async (req,res) => {
    res.setHeader('Content-Type','application/json');
    let id = req.params.pid

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error:`Ingrese un argumento id válido`})
    }
    let resultado = await pmm.getProductById(id)
    if (Array.isArray(resultado) && !resultado.length || !resultado) {
        return res.status(404).json({'resultado': `No existe producto con id: ${id}`})
    }
    
    res.status(200).json({resultado})
})

router.post('/', async (req,res)=>{
    let {success, code, message, data} = await pmm.addProduct(req.body)
    if (success) {
        console.log("socket enviando: newProduct, mensaje: ", data)
        socketServer.emit("newProduct", data)
    }
    res.setHeader('Content-Type','application/json')
    res.status(code).json({'success': success, 'resultado': message})
})

router.put('/:pid', async (req,res)=>{
    let id = req.params.pid
    res.setHeader('Content-Type','application/json');

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error:`Ingrese un argumento id válido`})
    }
    let {success, code, message} = await pmm.updateProduct(id, req.body)
    res.status(code).json({'success': success, 'resultado': message})
})

router.delete('/:pid', async (req,res)=>{
    let id = req.params.pid

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error:`Ingrese un argumento id válido`})
    }
    let {success, code, message} = await pmm.deleteProductById(id)
    if (success) {
        console.log("socket enviando: deleteProduct, mensaje: ", id)
        socketServer.emit("deleteProduct", id)
    }
    res.setHeader('Content-Type','application/json')
    res.status(code).json({'success': success, 'resultado': message})
})