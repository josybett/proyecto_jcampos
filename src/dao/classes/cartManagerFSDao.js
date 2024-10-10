import path from 'path'
import fs from 'fs'
import __dirname from '../../utils.js';
import { ProductManager } from './productManagerMongo.js';


export class CartsManagerFSDao {
    constructor() {
        this.path = path.join(__dirname, 'carritos.json')
    }
    async addCarts(request) {
        try {
            let { products } = request
            let carts = await this.getCarts();
            const id = carts.length ? (carts[carts.length-1].id+1) : 1
    
            let newCart = {
                id,
                products: products ?? [],
            }
    
            carts.push(newCart)
            await this.saveFile(carts)
            return {
                'success': true,
                'code': 200,
                'message': `Creado con éxito carrito id: ${id}`,
            }
        } catch (error) {
            console.log('addCarts error: ',error.message)
            return {
                'success': false,
                'code': 500,
                'message': `Error: ${error.message}`,
            }
        }
    }

    async saveFile(carts) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 5))
        } catch (error) {
            console.log('saveFile error: ',error.message)
            return {
                'success': false,
                'code': 500,
                'message': `Error: ${error.message}`,
            }
        }
    }

    async getCarts() {
        try {
            if (fs.existsSync(this.path)) {
                let carts = JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
                return carts
            }
            return []
        } catch (error) {
            console.log('getCarts error: ',error.message)
        }
    }

    async getCartById(req) {
        try {
            let id = req.params.cid
            id=parseInt(id)  
            if(isNaN(id)){
                return {
                    'success': false,
                    'code': 400,
                    'message': `Error, ingrese un argumento id numerico`,
                }
            }
            let carts = await this.getCarts();
            let cart = carts.find(c=>c.id===id)
            if (!cart) {
                console.log('Not found')
                return {
                    'success': false,
                    'code': 404,
                    'message': `No existe carrito con id: ${id}`,
                }
            }
            return {
                'success': true,
                'code': 200,
                'message': `Ok`,
                'data': cart
            }
        } catch (error) {
            console.log('getCartById error: ',error.message)
            return {
                'success': false,
                'code': 500,
                'message': `Error: ${error.message}`,
            }
        }
    }

    async updateCarts(req) {
        let cid = req.params.cid
        let pid = req.params.pid
        let qt = req.body?.quantity ?? 1
        id = parseInt(cid)  
        pid = parseInt(pid)  
        qt = parseInt(qt)
        if (isNaN(id) || isNaN(pid) || isNaN(qt)) {
            return {
                'success': false,
                'code': 400,
                'message': `Error, ingrese un argumento id numerico`
            }
        }
        if (qt <= 0) {
            return {
                'success': false,
                'code': 400,
                'message': `Error, quantity debe ser mayor a 0`
            }
        }

        let carts = await this.getCarts()
        let indexCart = carts.findIndex(c=>c.id===id)
        if (indexCart === -1) {
            return {
                'success': false,
                'code': 404,
                'message': `No existe carrito con id: ${id}`
            }
        }

        const pm = new ProductManager()
        let existProd = await pm.getProductById(pid)
        if (existProd.length === 0) {
            console.log(`return no existe: ${existProd}`)
            return {
                'success': false,
                'code': 404,
                'message': `No existe producto con id: ${pid}`
            }
        }

        let productsCarts = carts[indexCart].products
        let prod = {
            product: pid,
            quantity: qt
        }
        let index = productsCarts.findIndex(pc=>pc?.product==pid)
        if (index !== -1) {
            productsCarts[index] = {
                ...productsCarts[index],
                quantity: ( Number(productsCarts[index].quantity) + Number(qt))
            }
        } else {
            productsCarts.push(prod)
        }
        carts[indexCart].products = productsCarts
        await this.saveFile(carts)
            console.log(`Carrito editado con id: ${id}`)
            return {
                'success': true,
                'code': 200,
                'message': `Producto editado con id: ${pid}`,
                'data': productsCarts
            }
    }
}