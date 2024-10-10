import { CartsManagerDao } from '../dao/classes/cartsManagerDao.js';

const cm = new CartsManagerDao();

export const saveCart = async (req,res)=>{
    let {success, code, message} = await cm.addCarts(req.body)

    res.setHeader('Content-Type','application/json')
    res.status(code).json({'success':success, 'resultado': message})
}

export const getCartById = async (req,res)=>{
    let id = req.params.cid
    res.setHeader('Content-Type','application/json');

    let {success, code, message, data} = await cm.getCartById(id)
    if (!success) {
        return res.status(code).json({message})
    }

    res.status(200).json(data)
}

export const addProductCart = async (req,res)=>{
    let cid = req.params.cid
    let pid = req.params.pid
    let qt = req.body?.quantity ?? 1
    res.setHeader('Content-Type','application/json');
    let {success, code, message} = await cm.updateCarts(cid, pid, qt)
    res.status(code).json({'success': success, 'resultado': message})
}

export const deleteProductCart = async (req,res)=>{
    let {cid, pid } = req.params
    res.setHeader('Content-Type','application/json');

    let {success, code, message, data} = await cm.deleteCartProductById(cid, pid)
    res.status(code).json({'success': success, 'resultado': message})
}

export const updateCart = async (req,res)=>{
    let cid = req.params.cid
    let products = req.body?.products
    res.setHeader('Content-Type','application/json');

    let {success, code, message} = await cm.updateCartsById(cid, products)
    res.status(code).json({'success': success, 'resultado': message})
}

export const deleteCart = async (req,res)=>{
    let cid = req.params.cid
    res.setHeader('Content-Type','application/json');

    let {success, code, message, data} = await cm.deleteCartProduct(cid)
    res.status(code).json({'success': success, 'resultado': message})
}