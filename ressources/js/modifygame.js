  /********************************************/
  /*              Variables                   */
  /********************************************/
  Parse.initialize("dsosX49CI2Sb3fAskvraQl4zuSUsqmGr46cKNTKJ", "iHTYhrd7UsGulkqoyppRb1kemD4Vl26ti7GxJn0S"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
  Parse.serverURL = "https://parseapi.back4app.com/";

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function securePageLoad(page) {
  try {
      // Call Cloud Function to verify access
      await Parse.Cloud.run("checkPageAccess", { page: page });
      console.log("Access granted to", page);
      // Page can safely load
  } catch (error) {
      console.error("Access denied:", error.message);
      window.location.href = "connexion"; // redirect to login or error page
  }
}

// Modal user
const button = document.getElementById('button-user');
const modal = document.getElementById('user-modal');
const closeBtn = document.getElementById('close-modal');
const logoutBtn = document.getElementById('logout-btn');

// Slide bar
const btnEdit = document.getElementById('btn-edit');
const btnWinner = document.getElementById('btn-winner');
const indicator = document.getElementById('indicator');
const centralSectionModify = document.getElementById('central-section-modifygame');
const centralSectionGenerate = document.getElementById('central-section-generatewinner');

const userId = sessionStorage.getItem('userId');
const matchId = getQueryParam('matchId');


  /********************************************/
  /*           Previous charging              */
  /********************************************/
document.addEventListener('DOMContentLoaded', async () => {
  securePageLoad(window.location.pathname);




  /********************************************/
  /*        Fenetre modale utilisateur        */
  /********************************************/
  
  // Remplir les infos utilisateur
  document.getElementById("button-user").textContent = sessionStorage.getItem('userName');
  document.getElementById('modal-name').textContent = sessionStorage.getItem('userName');
  document.getElementById('modal-point').textContent = sessionStorage.getItem('userPoint');

  // Afficher la fenêtre modale
  button.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
  });

  // Fermer la fenêtre
  closeBtn.addEventListener('click', () => modal.style.display = 'none');

  // Logout
  logoutBtn.addEventListener('click', async () => {
    try{
      await Parse.User.logOut();
      console.log('User logged out');
      window.location.href = 'connexion';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  });
  /********************************************/
  /*           Set score scroller             */
  /********************************************/
  const selects = document.querySelectorAll('.score-select');
  for (const select of selects) {
    for (let i = 0; i <= 100; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
    }
}


  /********************************************/
  /*          Affichage des données           */
  /********************************************/
  let betEnd = false;
  const matchId = getQueryParam('matchId');
  if (matchId !== '0') {
    try {
      const Games = Parse.Object.extend("Games");
      const query = new Parse.Query(Games);
    
      // Get the specific match by ID
      query.equalTo("objectId", matchId);
    
      const matches = await query.find();
    
      if (matches.length > 0) {
        const matchInfo = matches[0];
    
        document.getElementById('team').value = matchInfo.get("team");
        document.getElementById('adversaire').value = matchInfo.get("adversaire");
    
        const matchDate = matchInfo.get("date"); // Parse Date object
        document.getElementById('date').value = matchDate.toISOString().slice(0, 10); // YYYY-MM-DD
        document.getElementById('time').value = matchDate.toTimeString().slice(0, 5); // HH:MM
    
        document.getElementById('btn-winner').disabled = false;
    
        const betwinner = matchInfo.get("betwinner");
        if (betwinner) {
          document.getElementById('button-enter').disabled = true;
    
          const score = matchInfo.get("score") || {};
          document.getElementById('score-select1').value = score.home ?? '';
          document.getElementById('score-select2').value = score.away ?? '';
          document.getElementById('gagnant').value = betwinner;
    
          document.getElementById('score-select1').disabled = true;
          document.getElementById('score-select2').disabled = true;
          document.getElementById('button-enter-generate').disabled = true;
    
          betEnd = true;
        }
      } else {
        console.error("Match not found");
      }
    
    } catch (err) {
      console.error('Erreur Parse:', err);
    }  
    /*
    try {
      const Bets = Parse.Object.extend("Bets");
      const query = new Parse.Query(Bets);
    
      const matchId = getQueryParam('matchId');
      query.equalTo("match", matchId); // assuming "match" stores the match ID as a string
    
      const bets = await query.find(); // Await Parse results
    
      const betsForMatch = bets.map(bet => ({
        scoreteam1: bet.get("scoreteam1"),
        scoreteam2: bet.get("scoreteam2"),
        name: bet.get("name")
      }));
    
      if (betEnd) {
        document.getElementById('nb-bet').textContent =
          "Nombre de pari(s) correct(s) pour ce match : " + betsForMatch.length + "/" + betsForMatch.length;
    
        if (betsForMatch.length > 0) {
          const validBets = betsForMatch.filter(bet =>
            bet.scoreteam1 == document.getElementById("score-select1").value &&
            bet.scoreteam2 == document.getElementById("score-select2").value
          );
    
          if (validBets.length > 0) {
            const randomIndex = Math.floor(Math.random() * validBets.length);
            const randomUser = validBets[randomIndex].name;
            document.getElementById("gagnant").value = randomUser;
            winner = randomUser;
          }
    
          document.getElementById('nb-bet').textContent =
            "Nombre de pari(s) correct(s) pour ce match : " + validBets.length + "/" + betsForMatch.length;
        } else {
          document.getElementById('nb-bet').textContent =
            "Nombre de pari(s) correct(s) pour ce match : 00/" + betsForMatch.length;
        }
    
      } else {
        document.getElementById('nb-bet').textContent = betsForMatch.length + " pari(s) en cours";
      }
    
    } catch (error) {
      console.error('Erreur Parse:', error);
    } */
  }



  
})



  /********************************************/
  /*            Add/Modify Game               */
  /********************************************/
document.getElementById('button-enter').addEventListener('click', async (e) => {
  const team = document.getElementById('team').value;
const adversaire = document.getElementById('adversaire').value;
const date = document.getElementById('date').value;
const time = document.getElementById('time').value;

if (!team || !adversaire || !date || !time) {
  alert('Merci de remplir tous les champs. \n(L\'erreur peut venir de la date)');
} else {
  try {
    const Games = Parse.Object.extend("Games");
    const matchId = getQueryParam('matchId');

    let game;
    if (matchId !== '0') {
      // Get existing match
      const query = new Parse.Query(Games);
      game = await query.get(matchId);
    } else {
      // Create new match
      game = new Games();
    }

    // Combine date + time into a single Date object
    const matchDate = new Date(`${date}T${time}:00`);

    // Update fields
    game.set("team", team);
    game.set("adversaire", adversaire);
    game.set("date", matchDate);

    // Save (create or update automatically)
    await game.save();

    window.location.href = 'admin';
  } catch (error) {
    console.error('Erreur Parse:', error);
    alert('Échec de la modification du match. Voir Voir la console pour plus de détails.');
  }
}
});





  /********************************************/
  /*            Slide bar button              */
  /********************************************/
btnEdit.addEventListener('click', () => {
  indicator.style.left = '0';
  centralSectionGenerate.style.display = 'none';
  centralSectionModify.style.display = 'block'; 
  centralSectionModify.scrollIntoView({ behavior: 'smooth' });
});

btnWinner.addEventListener('click', () => {
  indicator.style.left = '50%';
  centralSectionModify.style.display = 'none';
  centralSectionGenerate.style.display = 'block';
  centralSectionGenerate.scrollIntoView({ behavior: 'smooth' });
});







  /********************************************/
  /*            Generate winner               */
  /********************************************/
document.getElementById('button-enter-generate').addEventListener('click', (e) => {
  e.preventDefault();
  let winner = "Aucun gagnant";
  const team = document.getElementById('team').value;
  const adversaire = document.getElementById('adversaire').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  fetch('ressources/data/api.php?type=bet')
    .then(response => response.json())
    .then(result => {
      if (result.status === 'success') {
        const bets = result.data;
        const matchId = getQueryParam('matchId');
        const betsForMatch = bets.filter(bet => bet.match === matchId);
        document.getElementById('nb-bet').textContent = "Nombre de pari(s) correct(s) pour ce match : " + betsForMatch.length + "/" + betsForMatch.length; 
        if (betsForMatch.length > 0){
          const validBets = betsForMatch.filter(bet => 
            bet.scoreteam1 === document.getElementById("score-select1").value && bet.scoreteam2 === document.getElementById("score-select2").value
          );
          if (validBets.length > 0) {
            const randomIndex = Math.floor(Math.random() * validBets.length);
            const randomUser = validBets[randomIndex].name;
            document.getElementById("gagnant").value = randomUser;
            winner = randomUser;
          }else{
            document.getElementById("gagnant").value = "Aucun gagnant";
          }
          document.getElementById('nb-bet').textContent = "Nombre de pari(s) correct(s) pour ce match : "+ validBets.length +"/" + betsForMatch.length;
        } else {
          document.getElementById("gagnant").value = "Aucun gagnant";
          document.getElementById('nb-bet').textContent = "Nombre de pari(s) correct(s) pour ce match : 0/" + betsForMatch.length;
        }
        
        fetch('ressources/data/api.php?type=match', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ 
            action: 'DELETE',
            id: matchId 
          })
        })
        .catch(console.error);
      
        fetch('ressources/data/api.php?type=match', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            action: 'BTMATCH',
            id: matchId,
            team: team,
            adversaire: adversaire,
            date: date,
            time: time,
            score: { home: document.getElementById("score-select1").value, 
              away: document.getElementById("score-select2").value },
            betwinner: winner
          })
        });
      }
    })
    
    .catch(error => console.error('Erreur API:', error));     

});

document.getElementById('button-delete').addEventListener('click', async (e) => {
  if(getQueryParam('matchId') === '0'){
    window.location.href = 'admin';
  }else{
  e.preventDefault();
  
  try {
    // Delete match
    const matchResponse = await fetch('ressources/data/api.php?type=match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'DELETE', id: matchId }),
      credentials: 'same-origin' // include cookies if needed
    });

    if (!matchResponse.ok) throw new Error(`Match delete failed: ${matchResponse.status}`);

    // Delete bet
    const betResponse = await fetch('ressources/data/api.php?type=bet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'MTDELETE', id: matchId }),
      credentials: 'same-origin'
    });

    if (!betResponse.ok) throw new Error(`Bet delete failed: ${betResponse.status}`);

    console.log('Both match and bet deleted successfully');

    // Now it’s safe to navigate
    window.location.href = 'admin';

  } catch (error) {
    console.error('Error deleting:', error);
    alert('Failed to delete match/bet. See console for details.');
  }

}
});

document.getElementById('button-return').addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = 'admin';
});