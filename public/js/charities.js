// charities.js

let charities = []; // Store the fetched charities globally

document.addEventListener("DOMContentLoaded", async () => {
  const charityList = document.getElementById("charityList");

  try {
    const response = await axios.get("http://localhost:5000/allcharities");
    charities = response.data; // Store the fetched charities

    displayCharities(charities); // Display charities initially
  } catch (err) {
    console.error(err);
    charityList.innerHTML = "<p>Error loading charities.</p>";
  }
});

function displayCharities(filteredCharities) {
  const charityList = document.getElementById("charityList");
  charityList.innerHTML = ""; // Clear previous entries

  if (filteredCharities.length > 0) {
    filteredCharities.forEach((charity) => {
      const charityDiv = document.createElement("div");
      charityDiv.classList.add("charity-item");

      charityDiv.innerHTML = `
        <h2>${charity.name}</h2>
        <p>${charity.email}</p>
        <p>${charity.mission}</p>
        <button onclick="loadProjects('${charity.id}')">View Projects</button>
      `;

      charityList.appendChild(charityDiv);
    });
  } else {
    charityList.innerHTML = "<p>No charities found.</p>";
  }
}

function searchCharities() {
  const searchInput = document.getElementById("searchCharity").value.toLowerCase();
  const filteredCharities = charities.filter((charity) =>
    charity.name.toLowerCase().includes(searchInput)
  );

  displayCharities(filteredCharities); // Update the displayed charities
}

async function loadProjects(charityId) {
  const charityList = document.getElementById("charityList");
  const projectListContainer = document.getElementById("projectListContainer");
  const projectList = document.getElementById("projectList");

  projectList.innerHTML = ""; 
  charityList.classList.add("fade"); // Fade charities
  projectListContainer.classList.remove("hidden"); // Show projects

  try {
    const response = await axios.get(`http://localhost:5000/allprojects/${charityId}`);
    const projects = response.data;

    if (projects.length > 0) {
      projects.forEach((project) => {
        const projectDiv = document.createElement("div");
        projectDiv.classList.add("project-item");

        const imageHtml = project.imageUrl
          ? `<img src="http://localhost:5000${project.imageUrl}" alt="${project.title}" class="project-image">`
          : "<p>No image available</p>";

        projectDiv.innerHTML = `
          ${imageHtml}
          <h2>${project.title}</h2>
          <p>${project.description}</p>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div class="progress" style="width: ${calculateProgress(project.current, project.target)}%"></div>
            </div>
            <p>₹${project.current} / ₹${project.target} (Progress: ${calculateProgress(project.current, project.target)}%)</p>
          </div>
          <label for="amount">Amount</label>
          <input type="text" id="amount-${project.id}" required>
          <button onclick="donate('${project.id}', '${project.charity_id}')">Donate</button>
        `;
 
        projectList.appendChild(projectDiv);
      });
    } else {
      projectList.innerHTML = "<p>No projects found.</p>";
    }
  } catch (err) {
    console.error(err);
    projectList.innerHTML = "<p>Error loading projects.</p>";
  }
}

function closeProjects() {
  document.getElementById("charityList").classList.remove("fade");
  document.getElementById("projectListContainer").classList.add("hidden");
}

function calculateProgress(current, target) {
  return (current / target) * 100;
}


function calculateProgress(current, target) {
  if (target === 0) return 0; // Prevent division by zero
  return Math.min((current / target) * 100, 100); // Ensure max progress is 100%
}
function calculateProgressreal(current, target) {
  if (target === 0) return 0; // Prevent division by zero
  return Math.min((current / target) * 100); // Ensure max progress is 100%
}
 







async function donate(projectid,charityid) {
 
    try {
      let amount = document.getElementById(`amount-${projectid}`).value;
 

      if (amount === "" || amount === null) { // Check if the input is empty or null
        alert("Please enter the amount.");
        return false; // Prevent form submission (if used in a form)
      }
 
        const token = localStorage.getItem('token');
        // console.log(token);
        const response = await axios.get(`http://localhost:5000/donations/donation/${amount*100}/${projectid}/${charityid}`, {headers: { Authorization: token }});
  
   
  
        var options = {
            "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
            "order_id": response.data.order.id, // For one-time payment
            "handler": async function (response) {
                try {
                    await axios.post(`http://localhost:5000/donations/updateTransactionStatus/${amount}/${projectid}/${charityid}`, {
                        order_id: options.order_id,
                        payment_id: response.razorpay_payment_id,
                    }, { headers: { "Authorization": token } });
  
                    window.location.href = 'charities.html';
                    // localStorage.setItem('token',res.data.token)
  
                } catch (error) {
                    console.error("Error updating transaction status:", error);
                    alert('Transaction Failed. Please try againnnnn.');
                }
            },
            "theme": {
                "color": "#3399cc"
            }
        };
  
        const rzp1 = new Razorpay(options);
        rzp1.open();
        // e.preventDefault();
  
    } catch (error) {
        console.error("Error during payment process:", error);
         
    }
  };

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("charitytoken");
  
    window.location.href = "index.html"; // Or the correct path to your index page
  }
  
  
 