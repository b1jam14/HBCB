/********************************************/
/*            Ne pas modifier               */
/********************************************/

// Initialize Parse SDK
Parse.initialize(
  "dsosX49CI2Sb3fAskvraQl4zuSUsqmGr46cKNTKJ",
  "iHTYhrd7UsGulkqoyppRb1kemD4Vl26ti7GxJn0S"
);
Parse.serverURL = "https://parseapi.back4app.com/";

// Login form submit
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get input values
  const rawEmail = document.getElementById('id').value.trim();
  const rawPassword = document.getElementById('pw').value.trim();

  // Validate inputs
  if (!rawEmail || !rawPassword || /[\r\n]/.test(rawEmail) || /[\r\n]/.test(rawPassword)) {
    document.getElementById('login-error').textContent =
      "Le courriel ou le mot de passe contient des caractères non autorisés.";
    return;
  }

  //try {
    // Classic SDK login using async/await
    await Parse.User.logOut();
    const user = await Parse.User.logIn(rawEmail, rawPassword);

    // Check email verification
    if (!user.get("emailVerified")) {
      document.getElementById("blankhide").style.height = "0px";
      document.getElementById("login-error").style.color = "red";
      document.getElementById('login-error').textContent =
        "Veuillez vérifier votre courriel avant de vous connecter.";
      await Parse.User.logOut();
      return;
    }

    console.log("Login successful for:", user.get("username"));
    console.log("Session Token:", user.getSessionToken());

    // Call Cloud Function safely
    const page = await Parse.Cloud.run("getUserRolePage");
    window.location.href = page;

  /*} catch (error) {
    console.error("LOGIN FAILED:", error);
    const loginErrorEl = document.getElementById('login-error');
    switch (error.code) {
      case 101:
        loginErrorEl.textContent = "Courriel ou mot de passe incorrect.";
        break;
      case 100:
        loginErrorEl.textContent = "Impossible de se connecter au serveur. Vérifiez votre connexion.";
        break;
      default:
        loginErrorEl.textContent = "Une erreur est survenue. Avez-vous vérifié votre courriel?";
        break;
    }
  }*/
});

// Signup button
document.getElementById('signup-btn').addEventListener('click', () => {
  window.location.href = "inscription.html";
});

// Password reset button
document.getElementById('reset-email-btn').addEventListener('click', async (e) => {
  e.preventDefault();
  const email = document.getElementById("id").value.trim();
  const messageEl = document.getElementById("login-error");
  document.getElementById("blankhide").style.height = "0px";

  if (!email) {
    messageEl.style.color = "red";
    messageEl.textContent =
      "Veuillez entrer votre courriel avant de demander une réinitialisation.";
    return;
  }

  try {
    await Parse.User.requestPasswordReset(email);
    messageEl.style.color = "green";
    messageEl.textContent = "Un email de réinitialisation a été envoyé à : " + email;
  } catch (error) {
    console.error("Erreur lors de la demande de réinitialisation :", error);
    messageEl.style.color = "red";
    messageEl.textContent = "Impossible d'envoyer l'email de réinitialisation.";
  }
});
