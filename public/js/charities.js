// charities.js

document.addEventListener('DOMContentLoaded', async () => {
    const charityList = document.getElementById('charityList');
  
    try {
      const response = await fetch('/api/charities');
      const data = await response.json();
  
      if (data.success) {
        data.charities.forEach((charity) => {
          const charityDiv = document.createElement('div');
          charityDiv.innerHTML = `
            <h2>${charity.name}</h2>
            <p>${charity.description}</p>
            <button onclick="donate(${charity.id})">Donate</button>
          `;
          charityList.appendChild(charityDiv);
        });
      } else {
        charityList.innerHTML = '<p>No charities found.</p>';
      }
    } catch (err) {
      console.error(err);
      charityList.innerHTML = '<p>Error loading charities.</p>';
    }
  });
  
  async function donate(charityId) {
    try {
      const response = await fetch(`/api/donations/${charityId}`, { method: 'POST' });
      const data = await response.json();
  
      if (data.success) {
        alert('Donation successful!');
      } else {
        alert('Failed to donate');
      }
    } catch (err) {
      console.error(err);
      alert('Error making donation');
    }
  }
  