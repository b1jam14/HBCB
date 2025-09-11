Parse.initialize("dsosX49CI2Sb3fAskvraQl4zuSUsqmGr46cKNTKJ", "iHTYhrd7UsGulkqoyppRb1kemD4Vl26ti7GxJn0S"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = "https://parseapi.back4app.com/";

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function securePageLoad(page) {
  try {
    await Parse.Cloud.run("checkPageAccess", { page: page });
    console.log("Access granted to", page);
  } catch (error) {
    console.error("Access denied:", error.message);
    window.location.href = "connexion.html"; 
  }
}

const matchId = getQueryParam('matchId');


document.addEventListener('DOMContentLoaded', async () => {
  securePageLoad(window.location.pathname);

  const currentUser = Parse.User.current();
  try{
    const user = await currentUser.fetch();
    document.getElementById('modal-user-btn').textContent = user.getUsername();
    document.getElementById('modal-username-text').textContent = user.getUsername();
    document.getElementById('modal-point-text').textContent = user.get('point');
  }catch(e){
    console.error("Session expired:", e.message);
  }

  const matchId = getQueryParam('matchId');
  if (matchId !== '0') {
    try {
      const Games = Parse.Object.extend("Games");
      const query = new Parse.Query(Games);    
      query.equalTo("objectId", matchId);
      const matchInfo = await query.first();

      if (matchInfo) {
        const betWinner = matchInfo.get("betWinner");
        if (betWinner) {
          if (betWinner.id === currentUser.id) {
            document.getElementById('result-text').textContent = "Bravo!";
            document.getElementById('result-text-2').textContent = "Vous êtes le gagnant 🏆";
            document.getElementById('dynamic-image').src = "ressources/image/winning.png";
          } else {
            document.getElementById('result-text').textContent = "Perdu !";
            document.getElementById('result-text-2').textContent = "Essayez encore !";
            document.getElementById('dynamic-image').src = "ressources/image/losing.png";
          }
        } else {
          document.getElementById('result-text-2').textContent = "En attente des résultats...";
          document.getElementById('dynamic-image').src = "ressources/image/pending.png";
        }
      }
    } catch (error) {
      console.error("Error retrieving match info:", error.message);
    }
  }
});

document.getElementById('button-return').addEventListener('click', () => {
  window.location.href = 'main.html';
});
