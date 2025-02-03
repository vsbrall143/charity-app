function toggleMenu() {
    const nav = document.querySelector('.nav-links');
    nav.classList.toggle('active');
}


document.addEventListener("DOMContentLoaded", async () => {
    const profileContainer = document.getElementById("profileContainer");
    const updateForm = document.getElementById("updateForm");
    const nameInput = document.getElementById("nameInput");
    const emailInput = document.getElementById("emailInput");

    const token = localStorage.getItem("token"); // Get token from localStorage

    if (!token) {
        profileContainer.innerHTML = "<p>Please log in to view your profile.</p>";
        return;
    }

    try {
        // Fetch user details from backend
        const response = await axios.get("http://localhost:5000/api/auth/profile", {
            headers: { Authorization: token },
        });
        console.log(response);
        const user = response.data.user;
        
        // Display user details in profileContainer
        profileContainer.innerHTML = `
            <h2>Profile Details</h2>
 
            </br>
            <p><h3><strong>Name:</strong> ${user.name}</h3></p>
            <p><h3><strong>Email:</strong> ${user.email}</h3></p>
                   <p><h3><strong>Role:</strong> ${user.role}</h3></p>
            <p><h3><strong>Joined:</strong> ${new Date(user.createdAt).toDateString()}</h3></p>
        `;

        // Populate input fields for editing
        nameInput.value = user.name;
        emailInput.value = user.email;

    } catch (error) {
        console.error("Error fetching user profile:", error);
        profileContainer.innerHTML = "<p>Error loading profile. Please try again later.</p>";
    }

    // Handle profile update
    updateForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const updatedUser = {
            name: nameInput.value,
            email: emailInput.value
        };

        try {
            const updateResponse = await axios.put("http://localhost:5000/api/auth/profile", updatedUser, {
                headers: { Authorization: token },
            });

            alert("Profile updated successfully!");
            location.reload(); // Refresh page to reflect updated details

        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    });
});

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("charitytoken");
  
    window.location.href = "index.html"; // Or the correct path to your index page
  }
  
  