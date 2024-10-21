async function purcharse() {
  console.log("purcharse ")
  let response = await fetch(`http://localhost:8080/api/carts/66bc1b0efbb194ff336a9e22/purchase`, {
      method: 'POST',
      body: '',
      headers: {
          "Content-type": "application/json"
      }
  });
  let data = await response.json()
  console.log("result purcharse: ", JSON.stringify(data))

  if (data.success) {
      Swal.fire(data.resultado, "", "success");
  } else {
      Swal.fire("Ha ocurrido un error", "", "error");
  }
  window.location.href = "/cart/66bc1b0efbb194ff336a9e22"
  return data?.resultado;
}