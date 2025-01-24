// admin.js

document.addEventListener('DOMContentLoaded', () => {
    const charityList = document.getElementById('charityList');
    const donationStats = document.getElementById('donationStats');
    const addCharityForm = document.getElementById('addCharityForm');
  
    // Fetch and display charities
    async function loadCharities() {
      try {
        const response = await fetch('/api/charities', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token for admin authentication
          },
        });
  
        const data = await response.json();
  
        if (data.success) {
          charityList.innerHTML = '';
          data.charities.forEach((charity) => {
            const charityDiv = document.createElement('div');
            charityDiv.classList.add('charity-item');
            charityDiv.innerHTML = `
              <p><strong>${charity.name}</strong></p>
              <p>${charity.description}</p>
            `;
            charityList.appendChild(charityDiv);
          });
        } else {
          charityList.innerHTML = `<p>${data.message || 'No charities available.'}</p>`;
        }
      } catch (error) {
        console.error('Error fetching charities:', error);
        charityList.innerHTML = '<p>Failed to load charities.</p>';
      }
    }
  
    // Fetch and display donation statistics
    async function loadDonationStats() {
      try {
        const response = await fetch('/api/admin/donations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token for admin authentication
          },
        });
  
        const data = await response.json();
  
        if (data.success) {
          donationStats.innerHTML = `
            <p><strong>Total Donations:</strong> ₹${data.totalDonations}</p>
            <p><strong>Total Donors:</strong> ${data.totalDonors}</p>
          `;
        } else {
          donationStats.innerHTML = `<p>${data.message || 'No statistics available.'}</p>`;
        }
      } catch (error) {
        console.error('Error fetching donation statistics:', error);
        donationStats.innerHTML = '<p>Failed to load donation statistics.</p>';
      }
    }
  
    // Handle adding a new charity
    addCharityForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('charityName').value;
      const description = document.getElementById('charityDescription').value;
  
      try {
        const response = await fetch('/api/charities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token for admin authentication
          },
          body: JSON.stringify({ name, description }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          alert('Charity added successfully!');
          loadCharities(); // Refresh charities
        } else {
          alert(data.message || 'Failed to add charity.');
        }
      } catch (error) {
        console.error('Error adding charity:', error);
        alert('Error adding charity.');
      }
    });
  
    // Load data on page load
    loadCharities();
    loadDonationStats();
  });
  