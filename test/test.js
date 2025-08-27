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


    const query = new Parse.Query("Games");
    query.find().then((results) => {
      results.forEach(obj => console.log(obj.id, obj.get("playerName")));
    }).catch(error => console.error('Error:', error.message));  
});
document.getElementById("button-md").addEventListener("click", function() {
    const testText = document.getElementById("test").value;
    console.log(testText);
    fetch('testapi.php?type=test', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          action: 'MDMATCH',
          text: testText
        })
    }) .catch(error => console.error('Erreur API:', error));
});
document.getElementById("button-bt").addEventListener("click", function() {
    const testText = document.getElementById("test").value;
    console.log(testText);
    fetch('testapi.php?type=test', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          action: 'BTMATCH',
          text: testText
        })
    }) .catch(error => console.error('Erreur API:', error));
});
