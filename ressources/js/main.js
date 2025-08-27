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

document.addEventListener('DOMContentLoaded', async () => {
  
  if (getQueryParam('sponsors') === 'true') document.getElementById('sponsors-modal').style.display = 'flex';
  
  securePageLoad(window.location.pathname);

  const button = document.getElementById('button-user');
  const modal = document.getElementById('user-modal');
  const closeBtn = document.getElementById('close-modal');
  const logoutBtn = document.getElementById('logout-btn');

  const currentUser = Parse.User.current();
  try{
    const user = await Parse.User.current().fetch();
    document.getElementById("button-user").textContent = user.getUsername();
    document.getElementById('modal-name').textContent = user.getUsername();
    document.getElementById('modal-point').textContent = user.get('point');
  }catch(e){
    console.error("Session expired:", e.message);
  }

  // Remplir les infos utilisateur
  button.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
  });
  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  logoutBtn.addEventListener('click', async () => {
    try{
      await Parse.User.logOut();
      console.log('User logged out');
      window.location.href = 'connexion';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  });

  //Recuperation des données de match et tri
  const matchContainer = document.getElementById('match-container');

  const Games = Parse.Object.extend("Games");
const query = new Parse.Query(Games);

// Optional: you can filter future matches only
query.greaterThanOrEqualTo("date", new Date());
query.ascending("date"); // default sorting by date

try {
  const Games = Parse.Object.extend("Games");
  const query = new Parse.Query(Games);

  // Only future matches
  query.greaterThanOrEqualTo("date", new Date());
  query.ascending("date"); // Sort by date + time automatically

  // Await the query
  const matches = await query.find();

  // Generate HTML
  matches.forEach(match => {
    const matchDateTime = match.get("date"); // Parse Date object
    const now = new Date();
    const diffHours = (matchDateTime - now) / (1000 * 60 * 60);

    const betwinner = match.get("betwinner");
    console.log(betwinner, diffHours);

    if(betwinner === undefined && diffHours <= 48 && diffHours >= 0){
      const matchDiv = document.createElement('div');
      matchDiv.classList.add('match');

      const formattedDate = matchDateTime.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit'
      });

      const formattedTime = matchDateTime.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Paris'
      });

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
        window.location.href = 'bet?matchId=' + match.id;
      });

      matchContainer.appendChild(matchDiv);
    }
  });

  } catch (err) {
    console.error('Erreur Parse:', err);
  }
})


const sponsorsModal = document.getElementById('sponsors-modal');
const closeSponsorsBtn = document.getElementById('close-sponsors-modal');

closeSponsorsBtn.onclick = () => { sponsorsModal.style.display = 'none'; window.location.href = 'main';}
//chatgpt donne une meilleur solution


