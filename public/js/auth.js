// auth.js

// Handle login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data.success) {
        alert('Login successful');
        window.location.href = '/html/charities.html';
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to login');
    }
  });
}

// Handle registration form submission
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();

      if (data.success) {
        alert('Registration successful');
        window.location.href = '/html/login.html';
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to register');
    }
  });
}
