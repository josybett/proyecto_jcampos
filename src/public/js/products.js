const socket = io()

socket.on("connect", () => {
    console.log("Connected to server")
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Conexión al socket exitosa",
        showConfirmButton: false,
        timer: 1500
    })
})

async function deleteProduct(idProduct) {
    let producto = await getProd(idProduct);
    console.log("producto: ", producto)
    Swal.fire({
        title: `Estás seguro que quieres eliminar este producto "`+ producto.title + `" ?`,
        showCancelButton: true,
        confirmButtonText: `Aceptar`
    }).then(async (result) => {
        if (result.isConfirmed) {
            let resDelete = await deleteProd(idProduct)
            if (resDelete.success) {
                Swal.fire("Producto eliminado", "", "success");
            } else {
                Swal.fire("El producto no fue eliminado", "", "error");
            }
        }
    });
    
}

async function getProd(id) {
    let response = await fetch(`http://localhost:8080/api/products/${id}`);
    let data = await response.json()
    return data?.resultado;
}

async function deleteProd(id) {
    let response = await fetch(`http://localhost:8080/api/products/${id}`, {
        method: 'DELETE'
    });
    let data = await response.json()
    console.log("deleteProd: ", data)
    return data;
}

socket.on("deleteProduct", id=>{
    console.log("socket recibido: deleteProduct, mensaje: ", id)
    let product = document.getElementById(id)
    product.remove()
})

async function newProd(data) {
    let response = await fetch('http://localhost:8080/api/products/', {
        method: 'POST',
        body: data,
        headers: {
            "Content-type": "application/json"
        }
    })
    let result = await response.json()
    console.log("newProd: ", result)
    return result
}

async function newProduct() {
    let data = {
        "title": document.getElementById('titleProd').value,
        "description": document.getElementById('descProd').value,
        "code": document.getElementById('codeProd').value,
        "price": document.getElementById('priceProd').value,
        "stock": document.getElementById('stockProd').value,
        "category": document.getElementById('categoryProd').value,
    }
    console.log("data newProduct: ", data)
    let result = await newProd(JSON.stringify(data))
    console.log("result newProduct: ", JSON.stringify(result))

    if (result.success) {
        Swal.fire("Producto creado exitosamente", "", "success");
    } else {
        Swal.fire("Ha ocurrido un error", "", "error");
    }

    document.getElementById('titleProd').value = ''
    document.getElementById('descProd').value = ''
    document.getElementById('codeProd').value = ''
    document.getElementById('priceProd').value = ''
    document.getElementById('stockProd').value = ''
    document.getElementById('categoryProd').value = ''

    return false
}

socket.on("newProduct", product=>{
    console.log("socket recibido: newProduct, mensaje: ", product)
    let ulProducts = document.querySelector('ul')
    let liNew = document.createElement('li')
    liNew.id = product.id
    liNew.innerHTML = `<button class="btn-delete-product" onclick="deleteProduct(${product.id})"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
                        ${product.title}`
    ulProducts.append(liNew)
})