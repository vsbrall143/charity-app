const registerForm = document.getElementById('add-projectForm');

if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('target', document.getElementById('target').value);
    formData.append('current', document.getElementById('current').value);
    formData.append('image', document.getElementById('image').files[0]);

    try {
      const token = localStorage.getItem('charitytoken'); // Get token from local storage
      const res = await axios.post('http://localhost:5000/addproject', formData, {headers: { Authorization: token }});

       
      window.location.href = 'charity-dashboard.html'; // Redirect
    } catch (err) {
      console.error('Failed to add project:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Failed to add project');
    }
  });
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("charitytoken");

  window.location.href = "index.html"; // Or the correct path to your index page
}

