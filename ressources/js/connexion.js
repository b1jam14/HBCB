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
    
    const user = await Parse.User.logIn(courriel, password);
    
    if(!user.get("emailVerified")){
      document.getElementById('login-error').textContent = "Veuillez vérifier votre courriel avant de vous connecter.";
      await Parse.User.logOut();
      return;
    }else {
      console.log("Login successful for:", user.get("username"));

      const page = await Parse.Cloud.run("getUserRolePage");

      window.location.href = page;
   }
    

  } catch (error) {
    document.getElementById('login-error').textContent = "Courriel ou mot de passe incorrect.";
    console.error("Login failed or Cloud Function error:", error.message);
  }
});

document.getElementById('signup-btn').addEventListener('click', (e) => {
  window.location.href = "inscription.html";
});
