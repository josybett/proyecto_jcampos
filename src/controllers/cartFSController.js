import { CartsManagerFSDao } from '../dao/classes/cartManagerFSDao.js';

const cm = new CartsManagerFSDao();

export const getAllCartFS = async (req,res)=>{
    let {success, code, message} = await cm.addCarts(req.body)

    res.setHeader('Content-Type','application/json')
    res.status(code).json({'success':success, 'resultado': message})
}

export const getCartFSById  = async (req,res)=>{
    let {success, code, message, data} = await cm.getCartById(req)
    if (!success) {
        res.setHeader('Content-Type','application/json')
        return res.status(code).json({message})
    }

    res.setHeader('Content-Type','application/json')
    res.status(200).json(data)
}

export const addCartFSProduct = async (req,res)=>{
    let {success, code, message} = await cm.updateCarts(req)
    res.setHeader('Content-Type','application/json')
    res.status(code).json({'success': success, 'resultado': message})
}