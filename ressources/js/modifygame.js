  /********************************************/
  /*              Variables                   */
  /********************************************/
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
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
  const userId = sessionStorage.getItem('userId');
  if (!userId) window.location.href = 'connexion';




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
  logoutBtn.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'connexion';
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
    try{
    const getmatch = await fetch('ressources/data/api.php?type=match')
      .then(response => response.json())
      .then(result => {
        if (result.status === 'success') {
          const matches = result.data;
          const matchInfo = matches.find(m => m.id == matchId);
          document.getElementById('team').value = matchInfo.team;
          document.getElementById('adversaire').value = matchInfo.adversaire;
          document.getElementById('date').value = matchInfo.date;
          document.getElementById('time').value = matchInfo.time;  
          document.getElementById('btn-winner').disabled = false;
          
          if (matchInfo.betwinner) {
            document.getElementById('button-enter').disabled = true;
            
            document.getElementById('score-select1').value = matchInfo.score.home;
            document.getElementById('score-select2').value = matchInfo.score.away;
            document.getElementById('gagnant').value = matchInfo.betwinner;
            document.getElementById('score-select1').disabled = true;
            document.getElementById('score-select2').disabled = true;
            document.getElementById('button-enter-generate').disabled = true;
            betEnd = true;
;
          }
        }
      });  
    
    const getbet = await fetch('ressources/data/api.php?type=bet')
      .then(response => response.json())
      .then(result => {
        if (result.status === 'success') {
          const bets = result.data;
          const matchId = getQueryParam('matchId');
          const betsForMatch = bets.filter(bet => bet.match === matchId);
          if(betEnd){
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
              }
              document.getElementById('nb-bet').textContent = "Nombre de pari(s) correct(s) pour ce match : "+ validBets.length +"/" + betsForMatch.length;
            } else {
              document.getElementById('nb-bet').textContent = "Nombre de pari(s) correct(s) pour ce match : 00/" + betsForMatch.length;
            }
          }else{
            document.getElementById('nb-bet').textContent = betsForMatch.length + " pari(s) en cours";
          }
          
        }
      })
      .catch(error => console.error('Erreur API:', error));

    } catch (error) {
      console.error('Erreur API:', error);
    }
  }



  
})



  /********************************************/
  /*            Add/Modify Game               */
  /********************************************/
document.getElementById('button-enter').addEventListener('click', async (e) => {
  e.preventDefault();
  const team = document.getElementById('team').value;
  const adversaire = document.getElementById('adversaire').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  if (!team || !adversaire || !date || !time) { // Check all fields are filled
    alert('Merci de remplir tous les champs. \n(L\'erreur peut venir de la date)');
  } 
  else {
    if (getQueryParam('matchId') !== '0') { // Modify existing match (Delete + New)
      try{
        const deletematch = await fetch('ressources/data/api.php?type=match', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ 
            action: 'DELETE',
            id: getQueryParam('matchId') 
          })
        })
        if (!deletematch.ok) throw new Error(`Match delete failed: ${deletematch.status}`);

        const addmatch = await fetch('ressources/data/api.php?type=match', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            action: 'MDMATCH',
            id: getQueryParam('matchId'),
            team: team,
            adversaire: adversaire,
            date: date,
            time: time
          })
        })

        if (!addmatch.ok) throw new Error(`Bet delete failed: ${addmatch.status}`);

        console.log('Both match and bet deleted successfully');
        window.location.href = 'admin';
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Échec de la modification du match. Voir la console pour plus de détails.');
    } 
  }else { // Create new match
      fetch('ressources/data/api.php?type=match', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          action: 'NVMATCH',
          team: team,
          adversaire: adversaire,
          date: date,
          time: time
        })
      })
        .then(() => {
          window.location.href = 'admin';
        })
        .catch(console.error);
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