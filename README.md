# proyecto_jcampos
Proyecto Backend

## 1era Pre-entrega
### Api de producto
- [x] Crear un producto
http://localhost:8080/api/products/
![alt text](src/images/postman/image-3.png)

- [x] Obtener todos los productos
http://localhost:8080/api/products?limit=10
![alt text](src/images/postman/image-4.png)

- [x] Obtener producto por id
http://localhost:8080/api/products/10
![alt text](src/images/postman/image-5.png)

- [x] Editar un producto
http://localhost:8080/api/products/10
![alt text](src/images/postman/image-6.png)

- [x] Eliminar un producto
http://localhost:8080/api/products/3
![alt text](src/images/postman/image-7.png)

### Api de carrito
- [x] Crear un carrito de compras
http://localhost:8080/api/carts/
![alt text](src/images/postman/image-2.png)

- [x] Agregar un producto al carrito
http://localhost:8080/api/carts/:idCarrito/product/:idProducto
![alt text](src/images/postman/image.png)

- [x] Consultar productos del carrito
http://localhost:8080/api/carts/:id
![alt text](src/images/postman/image-1.png)
