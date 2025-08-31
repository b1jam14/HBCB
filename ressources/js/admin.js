Parse.initialize("dsosX49CI2Sb3fAskvraQl4zuSUsqmGr46cKNTKJ", "iHTYhrd7UsGulkqoyppRb1kemD4Vl26ti7GxJn0S"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = "https://parseapi.back4app.com/";

async function securePageLoad(page) {
  try {
      await Parse.Cloud.run("checkPageAccess", { page: page });
      console.log("Access granted to", page);
  } catch (error) {
      console.error("Access denied:", error.message);
      window.location.href = "connexion.html";
  }
}

document.getElementById("add-match-btn").addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = 'modifygame.html?matchId=0';
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

  //Display matches
  const matchContainer = document.getElementById('match-container');
  const Games = Parse.Object.extend("Games");
  const query = new Parse.Query(Games);
  query.ascending("date");

  try {
    const matches = await query.find();

    // Generate HTML
    matches.forEach(match => {
      const matchDateTime = match.get("date"); 
      const now = new Date();

      //A VERIFIER 
      // Make sure both are in UTC for comparison
      const diffHours = (matchDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      const betwinner = match.get("betWinner");
      
      const matchDiv = document.createElement('div');
      matchDiv.classList.add('match');

      // Format date in UTC
      const formattedDate = matchDateTime.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        timeZone: 'UTC'
      });

      // Format time in UTC
      const formattedTime = matchDateTime.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'UTC'
      });
        //A VERIFIER ^
      console.log(diffHours);
      if (betwinner === undefined && diffHours >= 0) {
        matchDiv.innerHTML = `
          <button class="match-button" id="${match.id}">
            <div class="match-content">
              <div class="match-info">
                <div class="teams">${match.get("team")} : HBCB - ${match.get("adversaire")}</div>
                <div class="match-time">${formattedDate} - ${formattedTime}</div>
              </div>
              <div class="arrow">&gt;</div>
            </div>
          </button>
        `;

        const button = matchDiv.querySelector('.match-button');
        button.addEventListener('click', (e) => {
          e.preventDefault();
          sessionStorage.setItem('matchId', match.id);
          window.location.href = 'modifygame.html?matchId=' + match.id;
        });

      }else if (diffHours < 0 && diffHours >= -72) {
        if(!betwinner || betwinner.id === undefined){
          matchDiv.innerHTML = `
          <button class="match-button orange" id="${match.id}">
          <div class="match-content">
            <div class="match-info">
              <div class="teams orange">${match.get("team")} : HBCB - ${match.get("adversaire")}</div>
              <div class="match-time">${formattedDate} - ${formattedTime}</div>
            </div>
            <div class="arrow orange">&gt;</div>
          </div>
          </button>
        `;

        const button = matchDiv.querySelector('.match-button');
        button.addEventListener('click', (e) => {
          e.preventDefault();
          sessionStorage.setItem('matchId', match.id);
          window.location.href = 'modifygame.html?matchId=' + match.id;
        });
        }else if(betwinner){
            matchDiv.innerHTML = `
            <button class="match-button green" id="${match.id}">
              <div class="match-content">
                <div class="match-info">
                  <div class="teams green">${match.get("team")} : HBCB - ${match.get("adversaire")}</div>
                  <div class="match-time">${formattedDate} - ${formattedTime}</div>
                </div>
                <div class="arrow green">&gt;</div>
              </div>
            </button>
          `;
        }

        const button = matchDiv.querySelector('.match-button');
        button.addEventListener('click', (e) => {
          e.preventDefault();
          sessionStorage.setItem('matchId', match.id);
          window.location.href = 'modifygame.html?matchId=' + match.id;
        });
      }else{
        matchDiv.innerHTML = `
          <button class="match-button red" id="${match.id}" >
            <div class="match-content">
              <div class="match-info">
                <div class="teams red">${match.get("team")} : HBCB - ${match.get("adversaire")}</div>
                <div class="match-time">${formattedDate} - ${formattedTime}</div>
              </div>
              <div class="arrow red">&gt;</div>
            </div>
          </button>
        `;

        const button = matchDiv.querySelector('.match-button');
        button.addEventListener('click', (e) => {
          e.preventDefault();
          sessionStorage.setItem('matchId', match.id);
          window.location.href = 'modifygame.html?matchId=' + match.id;
        });
      }
      matchContainer.appendChild(matchDiv);
    });

  } catch (err) {
    console.error('Erreur Parse:', err);
  }
})

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