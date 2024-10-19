import { cartsModel } from "../models/cartModel.js"
import { logError } from "../../utils.js"
import mongoose from "mongoose"
import { ProductManagerDao } from "./productManagerDao.js"
import { ticketModel } from "../models/ticketModel.js"
import { UserReadDTO } from "../../DTO/userDto.js"
import { productModel } from "../models/productModel.js"
import { ticket } from "../../controllers/ticketPdfController.js"
import { sendEmail } from "../../controllers/emailController.js"
import { TicketDao } from "./ticketDao.js"

export class CartsManagerDao {
    
    async addCarts(request) {
        try {
            let { products } = request
            let newCart = {}

            try {
                newCart = await cartsModel.create({products: products ?? []})
            } catch (error) {
                return logError('addCarts error mongose: ', 500, error)
            }

            return {
                'success': true,
                'code': 200,
                'message': `Creado con éxito carrito id: ${newCart}`,
            }
        } catch (error) {
            return logError('addCarts error: ', 500, error)
        }
    }

    async getCartById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return {
                    'success': false,
                    'code': 400,
                    'message': `Ingesar un id válido`,
                }
            }
            let cart = {}
            try {
                cart = await cartsModel.findOne({_id: id}).populate({lean:true, path: 'products.product'})
            } catch (error) {
                return logError('getCartById error mongose: ', 500, error)
            }

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
            return logError('getCartById error: ', 500, error)
        }
    }

    async updateCarts(id, pid, qt) {
        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(pid)) {
            return {
                'success': false,
                'code': 400,
                'message': `Ingesar un id válido`,
            }
        }
        qt=parseInt(qt)
        if(isNaN(qt)){
            return {
                'success': false,
                'code': 400,
                'message': `quantity debe ser numérico`,
            }
        }
        if(qt <= 0){
            return {
                'success': false,
                'code': 400,
                'message': `quantity debe ser mayor a 0`,
            }
        }
        let cart = {}
        let resultado = {}
        let resp = {
            'success': true,
            'code': 200,
            'message': `Carrito editado con id: ${id}`,
            'data': resultado
        }
        try {
            cart = await cartsModel.findOne({_id: id})
        console.log('cart', cart)
        } catch (error) {
            return logError('updateCarts error mongose: ', 500, error)
        }
        if (cart == {}) {
            return {
                'success': false,
                'code': 404,
                'message': `No existe carrito con id: ${id}`
            }
        }

        let productsCarts = cart?.products ?? []
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
            const pm = new ProductManagerDao()
            let prodById = await pm.getProductById(pid)
            if (!Array.isArray(prodById)) {
                productsCarts.push(prod)
            } else {
                resp.message = `No existe producto con id: ${pid}`
            }
        }
        cart.products = productsCarts
        console.log(cart)   
        try {
            resultado=await cartsModel.updateOne({_id:id }, cart)
            console.log(resultado)
            if(resultado.modifiedCount == 0) {
                resp = {
                    'success': true,
                    'code': 400,
                    'message': `No se concretó la modificación con id: ${id}`,
                }
            }
        } catch (error) {
            return logError('updateCarts error mongoose: ', 500, error)
        }
        console.log(`Carrito editado con id: ${id}`)
        return resp
    }

    async deleteCartProductById(id, pid, qt) {
        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(pid)) {
            return {
                'success': false,
                'code': 400,
                'message': `Ingesar un id válido`,
            }
        }
        let cart = {}
        let message = `Producto eliminado del carrito con id: ${pid}`
        let resultado = {}
        let resp = {
            'success': true,
            'code': 200,
            'message': message,
            'data': resultado
        }
        try {
            cart = await cartsModel.findOne({_id: id})
        } catch (error) {
            return logError('deleteCartProductById error mongose: ', 500, error)
        }
        if (cart == {}) {
            return {
                'success': false,
                'code': 404,
                'message': `No existe carrito con id: ${id}`
            }
        }

        let productsCarts = cart.products
        let index = productsCarts.findIndex(pc=>pc?.product==pid)
        if (index !== -1) {
            productsCarts.splice(index, 1);
        } else {
            resp.message = `No existe producto con id: ${pid} en el carrito`
        }
        cart.products = productsCarts
        try {
            resultado = await cartsModel.updateOne({_id:id }, cart)
            if(resultado.modifiedCount == 0) {
                resp = {
                    'success': true,
                    'code': 400,
                    'message': `No se concretó la modificación con id: ${id}`,
                }
            }
        } catch (error) {
            return logError('deleteCartProductById error mongoose: ', 500, error)
        }
        return resp
    }

    async updateCartsById(id, products) {
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return {
                'success': false,
                'code': 400,
                'message': `Ingrese un argumento id válido`,
                'data': resultado
            }
        }
        if (!Array.isArray(products)) {
            return {
                'success': false,
                'code': 400,
                'message': `products debe ser un array`,
                'data': resultado
            }
        }
        let cart = {}
        let resultado = {}
        let resp = {
            'success': true,
            'code': 200,
            'message': `Carrito editado con id: ${id}`,
            'data': resultado
        }
        try {
            cart = await cartsModel.findOne({_id: id})
        } catch (error) {
            return logError('updateCartsById error mongose: ', 500, error)
        }
        if (cart == {}) {
            return {
                'success': false,
                'code': 404,
                'message': `No existe carrito con id: ${id}`
            }
        }
        try {
            resultado=await cartsModel.updateOne({_id:id }, { products })
            console.log(resultado)
            if(resultado.modifiedCount == 0) {
                resp = {
                    'success': true,
                    'code': 400,
                    'message': `No se concretó la modificación con id: ${id}`,
                }
            }
        } catch (error) {
            return logError('updateCartsById error mongoose: ', 500, error)
        }
        console.log(`Carrito editado con id: ${id}`)
        return resp
    }

    async deleteCartProduct(id) {
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return {
                'success': false,
                'code': 400,
                'message': `Ingrese un argumento id válido`,
                'data': resultado
            }
        }

        let cart = {}
        let resultado = {}
        let resp = {
            'success': true,
            'code': 200,
            'message': `Carrito vacío con id: ${id}`,
            'data': resultado
        }
        try {
            cart = await cartsModel.findOne({_id: id})
        } catch (error) {
            return logError('deleteCartProduct error mongose: ', 500, error)
        }
        if (cart == {}) {
            return {
                'success': false,
                'code': 404,
                'message': `No existe carrito con id: ${id}`
            }
        }
        try {
            resultado=await cartsModel.updateOne({_id:id }, { products: [] })
            console.log(resultado)
            if(resultado.modifiedCount == 0) {
                resp = {
                    'success': true,
                    'code': 400,
                    'message': `No se concretó la modificación con id: ${id}`,
                }
            }
        } catch (error) {
            return logError('deleteCartProduct error mongoose: ', 500, error)
        }
        return resp
    }

    async purchaseCart(idCart, req) {
        try {
            const ticketDao = new TicketDao()
            const sessionMongo = await mongoose.startSession()
            sessionMongo.startTransaction()

            const user = new UserReadDTO(req.user)
            let cart = {}
            let products = []
            let resultUpdCart = {}
            let message = 'Compra no procesada'
            if(!mongoose.Types.ObjectId.isValid(idCart)) {
                return {
                    'success': false,
                    'code': 400,
                    'message': `Ingesar un id válido`,
                }
            }
            try {
                cart = await cartsModel.findOne({_id: idCart})
                products = cart?.products
            } catch (error) {
                return logError('updateCarts error mongose: ', 500, error)
            }

            if (cart == {}) {
                return {
                    'success': false,
                    'code': 404,
                    'message': `No existe carrito con id: ${id}`
                }
            }

            // Verificación de stock de productos
            let { productsNoStock, productsTicket } = await this.productsStock(products, sessionMongo)

            if (productsTicket.length > 0) {
                // Totalizar el valor de la compra
                const sumaTotalTickets = await this.sumTotalTicket(sessionMongo)

                // Crear el ticket de compra
                const newTicket = await ticketDao.createTicket(user, sumaTotalTickets, productsTicket, sessionMongo)
                message = `Creado ticket: ${newTicket.code}`

                // Editar stock de productos
                for (const item of productsTicket) {
                    await productModel.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } }).session(sessionMongo); 
                }
    
                // Editar carrito con productos no procesados en la compra
                resultUpdCart = await cartsModel.updateOne({_id: idCart }, { products: productsNoStock }).session(sessionMongo)
                if(resultUpdCart.modifiedCount == 0) {
                    resp = {
                        'success': true,
                        'code': 400,
                        'message': `No se concretó la modificación con id: ${id}`,
                    }
                }

                await sessionMongo.commitTransaction()
                sessionMongo.endSession()

                // Envio de ticket pdf por correo
                const ticketPdf = await ticketDao.getByIdTicket(newTicket._id)
                const pdf = await ticket(ticketPdf)
                await sendEmail(user.email, `Ticket de compra ${ticketPdf.code}`, `Compra bajo el ticket ${ticketPdf.code}`, [pdf])

            } else {
                message = 'No hay stock de los productos seleccionados en carrito'
            }
            
            return {
                'success': true,
                'code': 200,
                'message': message
            }
        } catch (error) {
            console.error('Error al realizar la compra:', error)
            if (sessionMongo) {
                await sessionMongo.abortTransaction()
                sessionMongo.endSession()
            }
            
            return {
                'success': false,
                'code': 500,
                'message': `Ocurrió un error intente de nuevo`
            }
        }
    }

    async productsStock(products, sessionMongo) {
        let productsNoStock = []
        let productsTicket = []
        for (const item of products) {
            const producto = await productModel.findById(item.product).session(sessionMongo); // Usar la sesión
    
            if (!producto || producto.stock < item.quantity) {
                productsNoStock.push({product: item.produc,  quantity: item.quantity})
            } else {
                productsTicket.push({product: item.product, quantity: item.quantity})
            }
        }
        return {
            productsNoStock,
            productsTicket
        }
    }

    async sumTotalTicket(sessionMongo) {
        const [sumaTotalTickets] = await cartsModel.aggregate([
            { $unwind: '$products' },
            { $lookup: {
                from: 'products',
                localField: 'products.product',
                foreignField: '_id',
                as: 'productInfo'
            }},
            { $unwind: '$productInfo' },
            {$project: {
                'products.product': 1,
                'products.quantity': 1,
                'productInfo.price': 1,
                subtotal: { $multiply: ['$products.quantity', '$productInfo.price'] }
            }},
            {$group: {
                _id: '$_id',
                products: { $push: '$products' },
                amount: { $sum: '$subtotal' }
            }}
        ], { sessionMongo });
        
        console.log(sumaTotalTickets.amount);

        return sumaTotalTickets.amount ?? 0;
    }
}