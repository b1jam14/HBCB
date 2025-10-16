/********************************************/
/*            Ne pas modifier               */
/********************************************/

Parse.initialize("dsosX49CI2Sb3fAskvraQl4zuSUsqmGr46cKNTKJ", "iHTYhrd7UsGulkqoyppRb1kemD4Vl26ti7GxJn0S"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = "https://parseapi.back4app.com/";

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const courriel = document.getElementById('id').value;
  const password = document.getElementById('pw').value;

  try {
    console.log("breakpoint1");
    const user = await Parse.User.logIn(courriel, password);
    console.log("breakpoint2");
    console.log("User logged in:", user);
     if(!user.get("emailVerified")){
      document.getElementById("blankhide").style.height = "0px";
      document.getElementById("login-error").style.color = "red";
      document.getElementById('login-error').textContent = "Veuillez vérifier votre courriel avant de vous connecter.";
      await Parse.User.logOut();
      return;
    }else {
      console.log("Login successful for:", user.get("username"));
      console.log("Session Token:", user.getSessionToken());
      const page = await Parse.Cloud.run("getUserRolePage");
      window.location.href = page;
    }
  } catch (error) {
    console.error("Login failed or Cloud Function error:", error.message);
    console.error("Full error object:", error);
    switch (error.code) {
    case 101:
      // Invalid credentials
      document.getElementById('login-error').textContent = "Courriel ou mot de passe incorrect.";
      break;

    case 100:
      // Network or server error
      document.getElementById('login-error').textContent = "Impossible de se connecter au serveur. Vérifiez votre connexion.";
      break;

    default:
      // Other errors (Cloud Function failures, unexpected errors, etc.)
      document.getElementById('login-error').textContent = "Une erreur est survenue. Avez-vous verifié votre courriel?";
      break;
  }
  }
});

document.getElementById('signup-btn').addEventListener('click', (e) => {
  window.location.href = "inscription.html";
});

document.getElementById('reset-email-btn').addEventListener('click', (e) => {
  e.preventDefault();
  const email = document.getElementById("id").value.trim();
  const messageEl = document.getElementById("login-error");
  document.getElementById("blankhide").style.height = "0px";

  if (!email) {
      messageEl.style.color = "red";
      messageEl.textContent = "Veuillez entrer votre courriel avant de demander une réinitialisation.";
      return;
  }

  Parse.User.requestPasswordReset(email)
      .then(() => {
          messageEl.style.color = "green";
          messageEl.textContent = "Un email de réinitialisation a été envoyé à : " + email;
      })
      .catch((error) => {
          console.error("Erreur lors de la demande de réinitialisation :", error);
      });

});
