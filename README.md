# proyecto_jcampos
Proyecto Backend

## Pruebas
Ejecuta las pruebas con:
```sh
npm start
```
Nota: actualmente está configurado con el puerto 8080

## Rutas de API
### Api Usuarios
- [x] Registrar usuario
- Método: POST
http://localhost:8080/api/sessions/register
```sh
// Request para usuario
{
    "first_name": "User",
    "last_name": "Corder",
    "email": "josybett@coderhouse.com",
    "age": 30,
    "password": "Test123"
}
```

- [x] Iniciar sesión:
- Método: POST
http://localhost:8080/api/sessions/login

```sh
// Request para iniciar sesión Login Usuario
{
    "email": "josybett@coderhouse.com",
    "password": "Test123"
}
```

```sh
// Request para iniciar sesión Login Admin
{
  "email": "admin@coderhouse.com",
  "password": "Admin123"
}
```

- [x] Consultar usurario logueado
- Método: GET
http://localhost:8080/api/sessions/current
![alt text](src/images/postman/image-10.png)

- [x] Cerrar sesión
- Método: POST
http://localhost:8080/api/sessions/logout


### Api de producto
- [x] Crear un producto
- Método: POST
- Reservada función para rol admin
http://localhost:8080/api/products/
![alt text](src/images/postman/image-3.png)

- [x] Obtener todos los productos
- Método: GET
http://localhost:8080/api/products?limit=10
![alt text](src/images/postman/image-4.png)

- [x] Obtener producto por id
- Método: GET
http://localhost:8080/api/products/:idProduct
![alt text](src/images/postman/image-5.png)

- [x] Editar un producto
- Método: PUT
- Reservada funciónpara rol admin
http://localhost:8080/api/products/10
![alt text](src/images/postman/image-6.png)

- [x] Eliminar un producto
- Método: DELETE
- Reservada funciónpara rol admin
http://localhost:8080/api/products/3
![alt text](src/images/postman/image-7.png)

### Api de carrito
- [x] Crear un carrito de compras
- Método: POST
http://localhost:8080/api/carts/
![alt text](src/images/postman/image-2.png)

- [x] Agregar un producto al carrito
- Método: POST
http://localhost:8080/api/carts/:idCarrito/product/:idProducto
![alt text](src/images/postman/image.png)

- [x] Consultar productos del carrito
- Método: GET
http://localhost:8080/api/carts/:id
![alt text](src/images/postman/image-1.png)

- [x] Eliminar un producto del carrito
- Método: DELETE
http://localhost:8080/api/carts/:idCarrito/product/:idProducto

- [x] Vaciar carrito
- Método: DELETE
http://localhost:8080/api/carts/:idCarrito

- [x] Procesar compra
- Método: POST
http://localhost:8080/api/carts/:idCarrito/purchase
![alt text](src/images/postman/image-11.png)

## Rutas de Views
- [x] Lista de Productos
http://localhost:8080/
Esta lista muestra todos los productos almacenados. Tiene un hipervínculo para ir a lista de productos con websocket.

![alt text](src/images/postman/image-8.png)

- [x] Lista de Productos con websocket
http://localhost:8080/realtimeproducts
Lista de productos con websocket en donde se visualiza el cambio si se agrega o elimina un producto. Tiene hipervínculo a lista de productos.

![alt text](src/images/postman/image-9.png)