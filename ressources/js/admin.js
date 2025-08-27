Parse.initialize("dsosX49CI2Sb3fAskvraQl4zuSUsqmGr46cKNTKJ", "iHTYhrd7UsGulkqoyppRb1kemD4Vl26ti7GxJn0S"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
        Parse.serverURL = "https://parseapi.back4app.com/";

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


document.getElementById("add-match-btn").addEventListener('click', (e) => {
  e.preventDefault();
  window.location.href = 'modifygame?matchId=0';
});

document.addEventListener('DOMContentLoaded', async () => {
  securePageLoad(window.location.pathname);

  const button = document.getElementById('button-user');
  const modaluser = document.getElementById('user-modal');
  const logoutBtn = document.getElementById('logout-btn');

  const closeBtnuser = document.getElementById('close-modal-user');

  // Modal user
  document.getElementById("button-user").textContent = sessionStorage.getItem('userName');
  document.getElementById('modal-name').textContent = sessionStorage.getItem('userName');
  document.getElementById('modal-point').textContent = sessionStorage.getItem('userPoint');
  button.addEventListener('click', (e) => {
    e.preventDefault();
    modaluser.style.display = 'flex';
  });
  closeBtnuser.addEventListener('click', () => {
    modaluser.style.display = 'none';
  });
  logoutBtn.addEventListener('click', async () => {
    try{
      await Parse.User.logOut();
      console.log('User logged out');
      window.location.href = 'connexion';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  });

  //Display matches
  const matchContainer = document.getElementById('match-container');

  try {
    const Games = Parse.Object.extend("Games");
    const query = new Parse.Query(Games);

    // Optional: only future matches
    query.greaterThanOrEqualTo("date", new Date());
    query.ascending("date"); // Sort by date + time automatically

    const matches = await query.find();

    // Generate HTML
    matches.forEach(match => {
      const matchDateTime = match.get("date"); // Parse Date object

      const matchDiv = document.createElement('div');
      matchDiv.classList.add('match');

      const formattedDate = matchDateTime.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit'
      });

      const formattedTime = matchDateTime.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Paris' // ENCORE UN PROBLEME ICI
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
        window.location.href = 'modifygame?matchId=' + match.id;
      });

      matchContainer.appendChild(matchDiv);
    });

  } catch (err) {
    console.error('Erreur Parse:', err);
  }
})

