function filtroManager(event, orden) {
    event.preventDefault()
    var urlParams = new URLSearchParams(window.location.search)
    var params = {}
    if (urlParams.has('limit')) {
        params.limit = urlParams.get('limit')
    }
    if (urlParams.has('page')) {
        params.page = urlParams.get('page')
    }
    if (urlParams.has('query')) {
        params.page = urlParams.get('query')
    }
    params.sort = orden;
    window.location.href = window.location.pathname+"?"+$.param(params)
}

$("#asc_button").click(function(event){
    filtroManager(event, 'asc');
});

$("#des_button").click(function(event){
    filtroManager(event, 'desc');
});  

function filtroLimit(event, limit) {
    event.preventDefault()
    var urlParams = new URLSearchParams(window.location.search)
    var params = {}
    if (urlParams.has('sort')) {
        params.limit = urlParams.get('sort')
    }
    if (urlParams.has('page')) {
        params.page = urlParams.get('page')
    }
    if (urlParams.has('query')) {
        params.page = urlParams.get('query')
    }

    params.limit = limit;
    window.location.href = window.location.pathname+"?"+$.param(params)
}
$("#3_button").click(function(event){
    filtroLimit(event, '3');
});

$("#5_button").click(function(event){
    filtroLimit(event, '5');
});  

$("#10_button").click(function(event){
    filtroLimit(event, '10');
});


async function addCartProduct(id) {
    let response = await fetch(`http://localhost:8080/api/carts/66bc1b0efbb194ff336a9e22/product/${id}`, {
        method: 'POST',
        body: '',
        headers: {
            "Content-type": "application/json"
        }
    });
    let data = await response.json()
    console.log("result addCartProduct: ", JSON.stringify(data))

    if (data.success) {
        Swal.fire("Producto agregado exitosamente", "", "success");
    } else {
        Swal.fire("Ha ocurrido un error", "", "error");
    }
    return data?.resultado;
}

function filtroPage(page) {
    console.log('page: ', page)
    var urlParams = new URLSearchParams(window.location.search)
    var params = {}
    if (urlParams.has('limit')) {
        params.limit = urlParams.get('limit')
    }
    if (urlParams.has('sort')) {
        params.limit = urlParams.get('sort')
    }
    if (urlParams.has('page')) {
        params.page = urlParams.get('page')
    }
    if (urlParams.has('query')) {
        params.page = urlParams.get('query')
    }

    params.page = page;
    window.location.href = window.location.pathname+"?"+$.param(params)
}