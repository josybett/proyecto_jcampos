import { ProductManagerDao } from "../dao/classes/productManagerDao.js";
import { socketServer } from '../app.js';

const pmm = new ProductManagerDao();

export const getProduct = async (req, res) => {
    let resultado = await pmm.getProducts(req.query)

    res.setHeader('Content-Type','application/json')
    res.status(200).json(resultado)
}

export const getProductById = async (req, res) => {
    res.setHeader('Content-Type','application/json');
    let id = req.params.pid
    let resultado = await pmm.getProductById(id)
    if (!resultado.success) {
      return res.status(resultado.code).json({'resultado': resultado.message})
    }

    res.status(200).json({resultado})
}

export const saveProduct = async (req, res) => {
    let {success, code, message, data} = await pmm.addProduct(req.body)
    if (success) {
        console.log("socket enviando: newProduct, mensaje: ", data)
        socketServer.emit("newProduct", data)
    }
    res.setHeader('Content-Type','application/json')
    res.status(code).json({'success': success, 'resultado': message})
}

export const updateProduct = async (req,res) => {
    let id = req.params.pid
    res.setHeader('Content-Type','application/json');

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({error:`Ingrese un argumento id válido`})
    }
    let {success, code, message} = await pmm.updateProduct(id, req.body)
    res.status(code).json({'success': success, 'resultado': message})
}

export const deleteProduct = async (req,res)=>{
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
}
