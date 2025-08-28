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
    window.location.href = "connexion"; 
  }
}

const userId = sessionStorage.getItem('userId');
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
    
      const matches = await query.find();
    
      if (matches.length > 0) {
        const matchInfo = matches[0];
    
        document.getElementById('team').value = matchInfo.get("team");
        document.getElementById('adversaire').value = matchInfo.get("adversaire");
    
        const matchDate = matchInfo.get("date"); // Parse Date object
        console.log(matchDate); // A VERIFIER
        document.getElementById('date').value = matchDate.toISOString().slice(0, 10); // YYYY-MM-DD
        document.getElementById('time').value = matchDate.toTimeString().slice(0, 5); // HH:MM
    
        const betwinner = matchInfo.get("betwinner");
        if (betwinner) {
          const score = matchInfo.get("score") || {};
          document.getElementById('score-select1').value = score.home ?? '';
          document.getElementById('score-select2').value = score.away ?? '';
          document.getElementById('gagnant').value = betwinner;
          document.getElementById('score-select1').disabled = true;
          document.getElementById('score-select2').disabled = true;
          document.getElementById('button-enter-save').disabled = true;
        }
      } else {
        console.error("Match not found");
      }
    
    } catch (err) {
      console.error('Erreur Parse:', err);
    }  
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
    window.location.href = 'admin';
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
  centralSectionModify.scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('slider-generate-btn').addEventListener('click', () => {
  document.getElementById('indicator').style.left = '50%';
  centralSectionModify.style.display = 'none';
  centralSectionGenerate.style.display = 'block';
  centralSectionGenerate.scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('button-enter-generate').addEventListener('click', async (e) => {
  e.preventDefault();

  const matchId = getQueryParam('matchId');
  const scoreteam1 = document.getElementById("score-select1").value;
  const scoreteam2 = document.getElementById("score-select2").value;

  try {
    const result = await Parse.Cloud.run("generateWinner", {
      matchId,
      scoreteam1,
      scoreteam2
    });

    // Afficher les infos
    document.getElementById("gagnant").value = result.winner;
    document.getElementById("nb-bet").textContent =
      `Nombre de pari(s) correct(s) : ${result.validBets}/${result.totalBets}`;

    console.log("Winner choisi :", result.winner);
  } catch (error) {
    console.error("Erreur Cloud Function:", error);
    alert("Échec de la génération du gagnant.");
  }
});

document.getElementById('button-delete').addEventListener('click', async (e) => {
  e.preventDefault();

  if(getQueryParam('matchId') === '0'){
    window.location.href = 'admin';
  }else{
    try {
      const matchId = getQueryParam('matchId');
    
      const result = await Parse.Cloud.run("deleteMatchAndBets", { matchId });
    
      console.log(`Match and ${result.deletedBets} bet(s) deleted successfully`);
      window.location.href = 'admin';
    
    } catch (error) {
      console.error("Error deleting:", error);
    }
  }
});

document.getElementById('button-return').addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = 'admin';
});

document.getElementById('modal-user-btn').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('modal-user-box').style.display = 'flex';
})

document.getElementById('modal-close-btn').addEventListener('click', () => document.getElementById('modal-user-box').style.display = 'none');

document.getElementById('modal-logout-btn').addEventListener('click', async () => {
  try{
    await Parse.User.logOut();
    window.location.href = 'connexion';
  } catch (error) {
    console.error('Error logging out:', error);
  }
})