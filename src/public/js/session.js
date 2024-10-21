document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:8080/api/sessions/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.status == 'success') {
      window.location.href = '/products';
    } else {
      document.getElementById('message').textContent = data.message || 'Usuario o contraseña inválida';
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    document.getElementById('message').textContent = 'Ha ocurrido un error intente de nuevo!';
  });
});


document.getElementById('registerForm').addEventListener('submit', function(e) {
  e.preventDefault();

  console.log('registrar')

  const first_name = document.getElementById('first_name').value;
  const last_name = document.getElementById('last_name').value;
  const email = document.getElementById('email').value;
  const age = document.getElementById('age').value;
  const password = document.getElementById('password').value;

  fetch('http://localhost:8080/api/sessions/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ first_name, last_name, age, email, password }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('registrar:', data)
    if (data.status == 'success') {
      window.location.href = '/login';
    } else {
      document.getElementById('message').textContent = data.message || 'Ha ocurrido un error';
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    document.getElementById('message').textContent = 'Ha ocurrido un error intente de nuevo!';
  });
});