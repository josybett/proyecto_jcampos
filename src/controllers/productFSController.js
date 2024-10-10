import { ProductManagerFSDao } from '../dao/classes/productManagerFSDao.js';
import { socketServer } from '../app.js'

const pm = new ProductManagerFSDao();

export const getProductFS = async (req,res)=>{
    const limit = parseInt(req.query.limit) ?? 0
    let resultado = await pm.getProducts(limit)

    res.setHeader('Content-Type','application/json')
    res.status(200).json({limit, resultado})
}

export const getProductFSById = async (req,res)=>{
    let id = req.params.pid

    id=parseInt(id)  
    if(isNaN(id)){
        return res.status(400).send('Error, ingrese un argumento id numerico')
    }
    let resultado = await pm.getProductById(id)
    if (Array.isArray(resultado) && !resultado.length) {
        res.setHeader('Content-Type','application/json')
        return res.status(404).json({'resultado': `No existe producto con id: ${id}`})
    }

    res.setHeader('Content-Type','application/json')
    res.status(200).json({resultado})
}

export const saveProductFS = async (req,res)=>{
    let {success, code, message, data} = await pm.addProduct(req.body)
    if (success) {
        console.log("socket enviando: newProduct, mensaje: ", data)
        socketServer.emit("newProduct", data)
    }
    res.setHeader('Content-Type','application/json')
    res.status(code).json({'success': success, 'resultado': message})
}

export const updateProductFS = async (req,res)=>{
    let {success, code, message} = await pm.updateProduct(req.params.pid, req.body)
    res.setHeader('Content-Type','application/json')
    res.status(code).json({'success': success, 'resultado': message})
}

export const deleteProductFS = async (req,res)=>{
    let id = req.params.pid
    let {success, code, message} = await pm.deleteProductById(id)
    if (success) {
        console.log("socket enviando: deleteProduct, mensaje: ", id)
        socketServer.emit("deleteProduct", id)
    }
    res.setHeader('Content-Type','application/json')
    res.status(code).json({'success': success, 'resultado': message})
}