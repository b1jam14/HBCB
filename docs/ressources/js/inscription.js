Parse.initialize("dsosX49CI2Sb3fAskvraQl4zuSUsqmGr46cKNTKJ", "iHTYhrd7UsGulkqoyppRb1kemD4Vl26ti7GxJn0S"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = "https://parseapi.back4app.com/";

document.getElementById('button-enter-save').addEventListener('click',async (e) => {
  e.preventDefault();

  const email = document.getElementById('email-input').value;
  const regexmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexmail.test(email)) {
    document.getElementById('email-input').value = "";
    document.getElementById('email-label').textContent = "Courriel : (format invalide)";
    document.getElementById('email-label').style.color = "red";
    return;
  }
  try {
    if(await Parse.Cloud.run("isEmailTaken", { email })){
      document.getElementById('email-input').value = "";
      document.getElementById('email-label').textContent = "Courriel : (déjà utilisé)";
      document.getElementById('email-label').style.color = "red";
      return;
    }
    document.getElementById('email-label').textContent = "Courriel :";
    document.getElementById('email-label').style.color = "#333";
  } catch (error) {
    console.error("Error while registering user email:", error.message);
  }

  const password = document.getElementById('password-input').value;
  const regexpassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]{8,}$/;
  if (!regexpassword.test(password)) {
    document.getElementById('password-input').value = "";
    document.getElementById('password-label').textContent = "Mot de passe : (8 caractères, maj, min, chiffre, spécial)";
    document.getElementById('password-label').style.color = "red";
    return;
  }
  document.getElementById('password-label').textContent = "Mot de passe :";
  document.getElementById('password-label').style.color = "#333";


  const date = document.getElementById('date').value;
  if (date) {
    const birthDate = new Date(date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age = age - 1;
    }
    if (age < 18) {
      document.getElementById('date').value = "";
      document.getElementById('date-label').textContent = "Date de naissance: (18 ans minimum)";
      document.getElementById('date-label').style.color = "red";
      return;
    }
  }else { return; }
  document.getElementById('date-label').textContent = "Date de naissance:";
  document.getElementById('date-label').style.color = "#333";

  const termsChecked = document.getElementById('terms').checked;
  if (!termsChecked) {
    e.preventDefault(); // Empêche l'envoi du formulaire
    document.querySelector('label[for="terms"]').style.color = "red";
    return;
  }
  console.log("Conditions accepted");
  const firstname = document.getElementById('firstname-input').value;
  const lastname = document.getElementById('lastname-input').value;
  const username = firstname + " " + lastname;

  const user = new Parse.User();
  user.set("firstName", firstname);
  user.set("lastName", lastname);
  user.set("username", username);
  user.set("password", password);
  user.set("email", email);
  user.set("birthDate", date);
  user.set("role", "user");

  const acl = new Parse.ACL();
  //acl.setPublicReadAccess(true); // everyone can read
 // acl.setWriteAccess(user.id, true); // only this user can write
  user.setACL(acl);

  try {
    await user.signUp();
    await Parse.User.logOut();
    window.location.href = "connexion.html";
  } catch (error) {
    console.error("Error while registering user end:", error.message);
  }
});
