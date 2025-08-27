document.getElementById("button-nv").addEventListener("click", function() {
    /*const testText = document.getElementById("test").value;
    console.log(testText);
    fetch('testapi.php?type=test', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          action: 'NVMATCH',
          text: testText
        })
    }) .catch(error => console.error('Erreur API:', error));*/

    console.log("Fetching data from Back4App...");
    const query = new Parse.Query("Users");
    query.find().then((results) => {
      results.forEach(obj => console.log(obj.id, obj.get("name")));
    }).catch(error => console.error('Error:', error.message));  
});
document.getElementById("button-md").addEventListener("click", async() => {
  const user = new Parse.User();
  user.set("username", "messi10");
  user.set("password", "securePass123");
  user.set("email", "leo@messi.com");
  user.set("balance", 100); // champ personnalisé pour ton app

  await user.signUp();
});
document.getElementById("button-bt").addEventListener("click", function() {
    
});
