document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const courriel = document.getElementById('id').value;
  const password = document.getElementById('pw').value;

  try {
    const user = await Parse.User.logIn(courriel, password);
    console.log("Login successful for:", user.get("username"));

    // Call the secure Cloud Function to get the page
    const page = await Parse.Cloud.run("getUserRolePage");
    console.log("Redirecting to:", page);

    // Redirect based on Cloud Function response
    window.location.href = page;

  } catch (error) {
      console.error("Login failed or Cloud Function error:", error.message);
      alert("Invalid username or password.");
  }

});



//Modal
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('button-user');
  const modal = document.getElementById('user-modal');
  const closeBtn = document.getElementById('close-modal');

  // Afficher la fenêtre modale
  button.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
  });

  // Fermer la fenêtre
  closeBtn.addEventListener('click', () => modal.style.display = 'none');
});
