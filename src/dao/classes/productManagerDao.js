import { productModel } from "../models/productModel.js"
import { logError } from "../../utils.js"
import mongoose from "mongoose"

export class ProductManagerDao {

    async addProduct(request) {
        console.log(request)

        let {title, description, code, price, stock, category, thumbnails} = request
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                console.log('Todos los parámetros son requeridos')
                return {
                    'success': false,
                    'code': 400,
                    'message': 'Todos los parámetros son requeridos',
                    'data': []
                }
            }
            price = parseFloat(price)
            stock = parseFloat(stock)
            if (Number.isNaN(price) || Number.isNaN(stock)) {
                return {
                    'success': false,
                    'code': 400,
                    'message': 'Price y Stock deben se numéricos',
                    'data': []
                }
            }
    
            let valCode = {}
            try {
                valCode = await productModel.findOne({code: code.toLowerCase() })
            } catch (error) {
                return logError('addProduct error mongoose: ', 500, error)
            }
            if (valCode) {
                console.log(`Ya se encuentra registrado code: ${code.toLowerCase()}`)
                return {
                    'success': false,
                    'code': 400,
                    'message': `Ya se encuentra registrado code: ${code.toLowerCase()}`,
                    'data': []
                }
            }

            let newProduct = {}
            try {
                newProduct = await productModel.create({
                    title: title,
                    description: description,
                    code: code.toLowerCase(),
                    price: price,
                    status: true,
                    stock: stock,
                    category: category,
                    thumbnails: Array.isArray(thumbnails) ? thumbnails : []
                })
            } catch (error) {
                return logError('addCarts error mongoose: ', 500, error)
            }
            
            return {
                'success': true,
                'code': 200,
                'message': `Creado con éxito producto con code: ${code.toLowerCase()}`,
                'data': newProduct
            }
        } catch (error) {
            console.log('addProduct error: ',error.message)
            return logError('addProduct error: ', 500, error)
        }
    }

    async getProducts(queryParams) {
        let { limit, page, sort, category, isAvailable } = queryParams
        let response;
        try {
            const query = {}
            const queryOptions = {
                limit,
                page,
            }
            if (sort) {
                queryOptions.sort = { price: sort === 'asc' ? 1 : -1 }
            }
            if (category) {
                query.category = { $regex: new RegExp(category), $options: "i" }
            }
            if (isAvailable) {
                query.status = true
                query.stock = { "$gt": 0 }
            }
            response = await productModel.paginate(
                query,
                queryOptions
            );
        } catch (error) {
            return {
                status: 'error',
                message: error.message
            }
        }

        return {
            status: 'success',
            payload: response.docs,
            totalPages: response.totalPages,
            prevPage: response.prevPage,
            nextPage: response.nextPage,
            page: response.page,
            hasPrevPage: response.hasPrevPage,
            hasNextPage: response.hasNextPage,
            prevLink: response.hasPrevPage
                ? `/api/products?limit=${limit}&page=${page-1}`
                : null,
            nextLink: response.hasNextPage
                ? `/api/products?limit=${limit}&page=${page+1}`
                : null,
        }
    }

    async getProductById(id) {
        if(!mongoose.Types.ObjectId.isValid(id)){
            return {
                'success': false,
                'code': 400,
                'message': `Ingrese un argumento id válido`,
                'data': []
            }
        }
        let product = []
        try {
            product = await productModel.findOne({_id: id, delete:false})
            if (!product) {
                console.log('Not found')
                return {
                    'success': false,
                    'code': 404,
                    'message': `No existe producto con id: ${id}`,
                    'data': []
                }
            }
        } catch (error) {
            console.log('getProductById error mongose: ',error.message)
            return {
                'success': false,
                'code': 500,
                'message': `Ocurrió un error, intente de nuevo`,
                'data': []
            }
        }
        return {
            'success': true,
            'code': 200,
            'message': `Producto encontrado con id: ${id}`,
            'data': product
        }
    }

    async updateProduct(id, updProduct) {
        try {
            let product = []
            let updProd = {}
            let resp = {
                'success': true,
                'code': 200,
                'message': `Producto editado con id: ${id}`,
            }
            try {
                product = await productModel.findOne({_id: id, delete:false})
            } catch (error) {
                console.log('updateProduct error mongoose: ',error.message)
                return logError('updateProduct error: ', 500, error)
            }
            if (!product) {
                console.log(`No existe producto con id: ${id}`)
                return {
                    'success': false,
                    'code': 400,
                    'message': `No existe producto con id: ${id}`,
                }
            }

            const keysString = ['title', 'description', 'thumbnails', 'category']
            const keysNumber = ['price', 'stock']
            const keysBool = ['status']
            let prod = Object.fromEntries(Object.entries(updProduct).
                            filter(([k, v]) => 
                                (((v != null && v != '') || v > 0 ) && keysString.includes(k)) ||
                                ((keysNumber.includes(k)) && !isNaN(parseInt(v))) ||
                                ((keysBool.includes(k)) && typeof v ==='boolean')
                            ))
            updProd = {
                ...product,
                ...prod,
                price: (prod.price) ? parseFloat(prod.price) : product.price,
                stock: (prod.stock) ? parseFloat(prod.stock) : product.stock,
                thumbnails: (prod.thumbnails && Array.isArray(prod.thumbnails)) ? prod.thumbnails : [],
            }
            delete updProd['_id']
            delete updProd['__v']
            console.log(updProd)
            let resultado
            try {
                resultado = await productModel.updateOne({_id:id, delete: false}, updProd)
                console.log(resultado)
                if(resultado.modifiedCount == 0) {
                    resp = {
                        'success': true,
                        'code': 400,
                        'message': `No se concretó la modificación con id: ${id}`,
                    }
                }
            } catch (error) {
                return logError('updateProduct error mongoose: ', 500, error)
            }

            return resp
        } catch (error) {
            return logError('updateProduct error: ', 500, error)
        }
    }

    async deleteProductById(id) {
        try {
            let product
            let resp = {
                'success': true,
                'code': 200,
                'message': `Ha sido eliminado el producto con id: ${id}`,
            }
            try {
                product = await productModel.findOne({_id: id, delete:false})
            } catch (error) {
                console.log('deleteProductById error mongoose: ',error.message)
                return logError('deleteProductById error: ', 500, error)
            }
            if (!product) {
                console.log(`No existe producto con id: ${id}`)
                return {
                    'success': false,
                    'code': 400,
                    'message': `No existe producto con id: ${id}`,
                }
            }
            let resultado = await productModel.updateOne({_id:id}, {delete: true})
            console.log(resultado)
            if(resultado.modifiedCount == 0) {
                resp = {
                    'success': true,
                    'code': 400,
                    'message': `No se concretó la eliminación del id: ${id}`,
                }
            }
            return resp
        } catch (error) {
            console.log('deleteProductById error: ',error.message)
            return logError('deleteProductById error: ', 500, error)
        }
    }
}