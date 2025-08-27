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

document.addEventListener('DOMContentLoaded', () => {
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
  logoutBtn.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'connexion';
  });

  //Display matches
  const matchContainer = document.getElementById('match-container');

  fetch('ressources/data/api.php?type=match')
    .then(response => response.json())
    .then(result => {
      if (result.status === 'success') {
        const matches = result.data;
        
        // Tri par heure
        matches.sort((a, b) => {
          const toMinutes = t => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
          };

          const dateComparison = new Date(a.date) - new Date(b.date);
          if (dateComparison !== 0) {
            return dateComparison;
          }

          return toMinutes(a.time) - toMinutes(b.time);
        });
      
        // Générer le HTML
        matches.forEach(match => {
          const matchDiv = document.createElement('div');
          matchDiv.classList.add('match');
            const formattedDate = new Date(match.date).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit'
            });

            matchDiv.innerHTML = `
            <button class="match-button" id="${match.id}">
              <div class="match-content">
              <div class="match-info">
              <div class="teams">${match.team} : HBCB - ${match.adversaire}</div>
              <div class="match-time">${formattedDate} - ${match.time}</div>
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
      } else {
        console.error('Erreur:', result.message);
      }
    })
    .catch(err => console.error('Erreur réseau:', err));
})

