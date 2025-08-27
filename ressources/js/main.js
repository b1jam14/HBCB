function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

document.addEventListener('DOMContentLoaded', () => {
  const userId = sessionStorage.getItem('userId');
    if (!userId) window.location.href = 'connexion';
  
  if (getQueryParam('sponsors') === 'true') document.getElementById('sponsors-modal').style.display = 'flex';
  

  const button = document.getElementById('button-user');
  const modal = document.getElementById('user-modal');
  const closeBtn = document.getElementById('close-modal');
  const logoutBtn = document.getElementById('logout-btn');

  // Remplir les infos utilisateur
  document.getElementById("button-user").textContent = sessionStorage.getItem('userName');
  document.getElementById('modal-name').textContent = sessionStorage.getItem('userName');
  document.getElementById('modal-point').textContent = sessionStorage.getItem('userPoint');
  button.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
  });
  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  logoutBtn.addEventListener('click', () => {
    sessionStorage.clear();
    window.location.href = 'connexion';
  });

  //Recuperation des données de match et tri
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
          const matchDateTime = new Date(`${match.date}T${match.time}:00`);
          const now = new Date();

          const diffHours = (matchDateTime - now) / (1000 * 60 * 60);

          if(match.betwinner === null && diffHours <= 48 && diffHours >= 0){
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
            window.location.href = 'bet?matchId=' + match.id;
          });

          matchContainer.appendChild(matchDiv);
        }
        });
      } else {
        console.error('Erreur:', result.message);
      }
    })
    .catch(err => console.error('Erreur réseau:', err));
})


const sponsorsModal = document.getElementById('sponsors-modal');
const closeSponsorsBtn = document.getElementById('close-sponsors-modal');

closeSponsorsBtn.onclick = () => { sponsorsModal.style.display = 'none'; window.location.href = 'main';}
//chatgpt donne une meilleur solution


