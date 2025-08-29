var winner=null;

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

document.getElementById('button-team1').addEventListener('click', () => {
  document.getElementById('button-team1').style.backgroundColor = '#4075d7';
  document.getElementById('button-team1').style.color = 'white';
  document.getElementById('button-tie').style.backgroundColor = 'white';
  document.getElementById('button-tie').style.color = '#818181';
  document.getElementById('button-team2').style.backgroundColor = 'white';
  document.getElementById('button-team2').style.color = '#b30000';
  winner='bischo';
});

document.getElementById('button-tie').addEventListener('click', () => {
  document.getElementById('button-team1').style.backgroundColor = 'white';
  document.getElementById('button-team1').style.color = '#4075d7';
  document.getElementById('button-tie').style.backgroundColor = '#818181';
  document.getElementById('button-tie').style.color = 'white';
  document.getElementById('button-team2').style.backgroundColor = 'white';
  document.getElementById('button-team2').style.color = '#b30000';
  winner='tie';
});

document.getElementById('button-team2').addEventListener('click', () => {
  document.getElementById('button-team1').style.backgroundColor = 'white';
  document.getElementById('button-team1').style.color = '#4075d7';
  document.getElementById('button-tie').style.backgroundColor = 'white';
  document.getElementById('button-tie').style.color = '#818181';
  document.getElementById('button-team2').style.backgroundColor = '#b30000';
  document.getElementById('button-team2').style.color = 'white';
  winner='adversaire';
});

const selects = document.querySelectorAll('.score-select');
for (const select of selects) {
  for (let i = 0; i <= 100; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
  }
}

document.getElementById('button-bet').addEventListener('click', async function () {
  const scoreteam1 = parseInt(document.getElementById('score-select1').value, 10);
  const scoreteam2 = parseInt(document.getElementById('score-select2').value, 10);
  const bestscorer = document.getElementById('bestscorer').value;
  const matchId = getQueryParam('matchId');

  if (isNaN(scoreteam1) || isNaN(scoreteam2)) {
    alert('Les scores doivent être des nombres valides.');
    return;
  }

  if (scoreteam1 === undefined || scoreteam2 === undefined || !bestscorer || !matchId) {
    alert('Merci de remplir tous les champs.');
    return;
  }
  console.log("Données du pari :", { matchId, scoreteam1, scoreteam2, bestscorer, winner });
  try {
    const result = await Parse.Cloud.run("saveBet", {
      matchId: matchId,
      scoreteam1: scoreteam1,
      scoreteam2: scoreteam2,
      bestscorer: bestscorer
    });

    window.location.href = 'main.html';

  } catch (error) {
    console.error("Erreur Cloud Function:", error);
    alert("BlabLa Échec de l'enregistrement du pari. Voir la console pour plus de détails.");
  }
});

  


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
  try {
    const user = await  Parse.User.current(); // utilisateur connecté
    if (!user) return;

    const Games = Parse.Object.extend("Games");
    
    // 1️⃣ Fetch the match directly by its ID
    const gameQuery = new Parse.Query(Games);
    const match = await gameQuery.get(matchId);

    // 2️⃣ Update the button text
    document.getElementById('button-team2').textContent = match.get("adversaire");

    // 3️⃣ Optionally, fetch the user's bet if needed
    const Bets = Parse.Object.extend("Bets");
    const betQuery = new Parse.Query(Bets);
    betQuery.equalTo("matchId", match);
    betQuery.equalTo("userId", Parse.User.current());
    const userBet = await betQuery.first();

    console.log("Pari utilisateur récupéré :", userBet);
      

    if (userBet) {
      const winnerValue = userBet.get("winner");
      console.log("Valeur du gagnant récupérée :", winnerValue);

      // Mettre à jour les couleurs des boutons selon le gagnant
      if (winnerValue === 'team1') {
        document.getElementById('button-team1').style.backgroundColor = '#4075d7';
        document.getElementById('button-team1').style.color = 'white';
        document.getElementById('button-tie').style.backgroundColor = 'white';
        document.getElementById('button-tie').style.color = '#818181';
        document.getElementById('button-team2').style.backgroundColor = 'white';
        document.getElementById('button-team2').style.color = '#b30000';
      } else if (winnerValue === 'draw') {
        document.getElementById('button-team1').style.backgroundColor = 'white';
        document.getElementById('button-team1').style.color = '#4075d7';
        document.getElementById('button-tie').style.backgroundColor = '#818181';
        document.getElementById('button-tie').style.color = 'white';
        document.getElementById('button-team2').style.backgroundColor = 'white';
        document.getElementById('button-team2').style.color = '#b30000';
      } else { // 'team2'
        document.getElementById('button-team1').style.backgroundColor = 'white';
        document.getElementById('button-team1').style.color = '#4075d7';
        document.getElementById('button-tie').style.backgroundColor = 'white';
        document.getElementById('button-tie').style.color = '#818181';
        document.getElementById('button-team2').style.backgroundColor = '#b30000';
        document.getElementById('button-team2').style.color = 'white';
      }

      // Remplir les champs du pari
      document.getElementById('score-select1').value = userBet.get("scoreteam1");
      document.getElementById('score-select2').value = userBet.get("scoreteam2");
      document.getElementById('bestscorer').value = userBet.get("bestscorer");
      document.getElementById('button-bet').textContent = 'Modifier le pari';
    }

  } catch (error) {
      console.error("Erreur Parse:", error);
      window.location.href = 'main.html';
  }
});

document.getElementById('modal-user-btn').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('modal-user-box').style.display = 'flex';
})
  
document.getElementById('modal-close-btn').addEventListener('click', () => document.getElementById('modal-user-box').style.display = 'none');
  
document.getElementById('modal-logout-btn').addEventListener('click', async () => {
  try{
    await Parse.User.logOut();
    window.location.href = 'connexion.html';
  } catch (error) {
    console.error('Error logging out:', error);
  }
})