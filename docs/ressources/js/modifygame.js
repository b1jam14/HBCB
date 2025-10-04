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

  const selects = document.querySelectorAll('.score-select');
  for (const select of selects) {
    for (let i = 0; i <= 100; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
    }
  }

  const matchId = getQueryParam('matchId');
  if (matchId !== '0') {
    try {
      const Games = Parse.Object.extend("Games");
      const query = new Parse.Query(Games);
    
      query.equalTo("objectId", matchId);
    
      const matchInfo = await query.first();
    
      if (matchInfo) {
    
        document.getElementById('team').value = matchInfo.get("team");
        document.getElementById('adversaire').value = matchInfo.get("adversaire");
    
        const matchDate = matchInfo.get("date"); // Parse Date object
        console.log(matchDate); // A VERIFIER
        
        // Use UTC time explicitly
        document.getElementById('date').value = matchDate.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
        
        // Format time in UTC (HH:MM)
        const utcHours = String(matchDate.getUTCHours()).padStart(2, '0');
        const utcMinutes = String(matchDate.getUTCMinutes()).padStart(2, '0');
        document.getElementById('time').value = `${utcHours}:${utcMinutes}`;
    
        const betwinner = matchInfo.get("betWinner");

        const result = await Parse.Cloud.run("getValideNTotalBet", {
          matchId,
          scoreteam1: matchInfo.get("bischoScore"),
          scoreteam2: matchInfo.get("adversaireScore")
        });

        if (betwinner) {
          const betwinnerPointer = {
            __type: "Pointer",
            className: "_User",
            objectId: betwinner.id
          }
          const score = matchInfo.get("score") || {};
          document.getElementById('score-select1').value = matchInfo.get("bischoScore");
          document.getElementById('score-select2').value = matchInfo.get("adversaireScore");
          document.getElementById('bestscorer-text').value = matchInfo.get("bestScorer");
          document.getElementById('gagnant-text').value = await Parse.Cloud.run("getUsername", { betwinner: betwinnerPointer });
          document.getElementById("nb-bet-text").textContent = `Nombre de pari(s) correct(s) : ${result.validBets}/${result.totalBets}`;
          document.getElementById('score-select1').disabled = true;
          document.getElementById('score-select2').disabled = true;
          document.getElementById('bestscorer-text').disabled = true;
          document.getElementById('button-enter-generate').disabled = true;
        }
        else{
          const Bets = Parse.Object.extend("Bets");
          const betsQuery = new Parse.Query(Bets);
          const Match = Parse.Object.extend("Games");
          
          const matchPointer = new Match();
          matchPointer.id = matchId;  

          betsQuery.equalTo("matchId", matchPointer); 
          const betsForMatch = await betsQuery.find();
          
          document.getElementById("nb-bet-text").textContent = "Nombre de pari(s) en cours : " + betsForMatch.length;
        }
      } else {
        console.error("Match not found");
      }
    
    } catch (err) {
      console.error('Erreur Parse:', err);
    }  
  }else{
    document.getElementById('slider-generate-btn').disable = true;
  }
})

document.getElementById('button-enter-save').addEventListener('click', async (e) => {
  const team = document.getElementById('team').value;
  const adversaire = document.getElementById('adversaire').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  if (!team || !adversaire || !date || !time) {
    alert('Merci de remplir tous les champs. \n(L\'erreur peut venir de la date)');
    return;
  }

  try {
    const matchId = getQueryParam('matchId');

    const result = await Parse.Cloud.run("saveGame", {
      matchId,
      team,
      adversaire,
      date,
      time
    });

    console.log("Game saved successfully:", result);
    window.location.href = 'admin.html';
  } catch (error) {
    console.error('Erreur Parse:', error);
  }
});

const centralSectionModify = document.getElementById('central-section-modifygame');
const centralSectionGenerate = document.getElementById('central-section-generatewinner');

document.getElementById('slider-edit-btn').addEventListener('click', () => {
  document.getElementById('indicator').style.left = '0';
  centralSectionGenerate.style.display = 'none';
  centralSectionModify.style.display = 'block'; 
});

document.getElementById('slider-generate-btn').addEventListener('click', () => {
  document.getElementById('indicator').style.left = '50%';
  centralSectionModify.style.display = 'none';
  centralSectionGenerate.style.display = 'block';
});

document.getElementById('button-enter-generate').addEventListener('click', async (e) => {
  e.preventDefault();

  const matchId = getQueryParam('matchId');
  
  const scoreteam1 = parseInt(document.getElementById('score-select1').value, 10);
  const scoreteam2 = parseInt(document.getElementById('score-select2').value, 10);
  const bestScorer = document.getElementById('bestscorer-text').value;

  try {
    const result = await Parse.Cloud.run("generateWinners", {
      matchId,
      scoreteam1,
      scoreteam2
    });
  
    // Afficher la liste des gagnants
    if (result.winners && result.winners.length > 0) {
      document.getElementById("gagnant-text").value = result.winners.join(", ");
    } else {
      document.getElementById("gagnant-text").value = "Aucun gagnant 😢";
    }
  
    // Afficher le nombre de paris corrects
    document.getElementById("nb-bet-text").textContent = 
      `Nombre de pari(s) correct(s) : ${result.validBets}/${result.totalBets}`;
  
    // Générer les points (si ta logique le requiert toujours)
    await Parse.Cloud.run("generatePoint", {
      matchId,
      bestScorer,
      scoreteam1,
      scoreteam2
    });
  
  } catch (error) {
    console.error("Erreur Cloud Function:", error);
    alert("Échec de la génération des gagnants.");
  }  
});

document.getElementById('button-delete').addEventListener('click', async (e) => {
  e.preventDefault();

  if(getQueryParam('matchId') === '0'){
    window.location.href = 'admin.html';
  }else{
    try {
      const matchId = getQueryParam('matchId');
    
      const result = await Parse.Cloud.run("deleteMatchAndBets", { matchId });
    
      console.log(`Match and ${result.deletedBets} bet(s) deleted successfully`);
      window.location.href = 'admin.html';
    
    } catch (error) {
      console.error("Error deleting:", error);
    }
  }
});

document.getElementById('button-return').addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = 'admin.html';
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