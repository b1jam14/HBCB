Parse.initialize("dsosX49CI2Sb3fAskvraQl4zuSUsqmGr46cKNTKJ", "iHTYhrd7UsGulkqoyppRb1kemD4Vl26ti7GxJn0S"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = "https://parseapi.back4app.com/";

const sponsorsModal = document.getElementById('sponsors-modal');
const closeSponsorsBtn = document.getElementById('close-sponsors-modal');

closeSponsorsBtn.onclick = () => { sponsorsModal.style.display = 'none'; window.location.href = 'main.html';}

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function securePageLoad(page) {
  try {
      await Parse.Cloud.run("checkPageAccess", { page: page });
  } catch (error) {
      console.error("Access denied:", error.message);
      window.location.href = "connexion.html"; 
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  if (getQueryParam('sponsors') === 'true') document.getElementById('sponsors-modal').style.display = 'flex';
  
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

  const matchContainer = document.getElementById('match-container');
  const Games = Parse.Object.extend("Games");
  const query = new Parse.Query(Games);
  query.greaterThanOrEqualTo("date", new Date());
  query.doesNotExist("betWinner");
  query.ascending("date"); 

  try {
    const matches = await query.find();

    matches.forEach(match => {
      const matchDateTime = match.get("date"); 
      const now = new Date();

      //A VERIFIER 
      // Make sure both are in UTC for comparison
      const diffHours = (matchDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      const betwinner = match.get("betwinner");

      if (betwinner === undefined && diffHours <= 48 && diffHours >= 0) {
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
          window.location.href = 'bet.html?matchId=' + match.id;
        });

        matchContainer.appendChild(matchDiv);
      }
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