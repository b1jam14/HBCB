Parse.initialize("dsosX49CI2Sb3fAskvraQl4zuSUsqmGr46cKNTKJ", "iHTYhrd7UsGulkqoyppRb1kemD4Vl26ti7GxJn0S");
Parse.serverURL = "https://parseapi.back4app.com/";

const sponsorsModal = document.getElementById('sponsors-modal');
const closeSponsorsBtn = document.getElementById('close-sponsors-modal');

const sponsors = [
  { name: "AXA", link: "#", img: "ressources/image/axa.png.webp" },
  { name: "Caisse d'Épargne", link: "#", img: "ressources/image/caisse-depargne.png.webp" },
  { name: "CEA", link: "#", img: "ressources/image/CEA.png.webp" },
  { name: "Ceros", link: "#", img: "ressources/image/ceros.png.webp" },
  { name: "Dietrich", link: "#", img: "ressources/image/dietrich.jpg" },
  { name: "Evalit", link: "#", img: "ressources/image/evalit.png.webp" },
  { name: "Exalliance", link: "#", img: "ressources/image/exalliance.jpg.webp" },
  { name: "Immo Laforêt", link: "#", img: "ressources/image/immolaforet.png.webp" },
  { name: "ITS", link: "#", img: "ressources/image/its.png" },
  { name: "Leclerc", link: "#", img: "ressources/image/leclrec.png.webp" },
  { name: "McDonald's", link: "#", img: "ressources/image/macdo.png.webp" },
  { name: "MD Boissons", link: "#", img: "ressources/image/mdboissons.png.webp" },
  { name: "MyJobest", link: "#", img: "ressources/image/myjobest.png.webp" },
  { name: "L'Oeil", link: "#", img: "ressources/image/oeil.png.webp" },
  { name: "Points", link: "#", img: "ressources/image/points.jpg.webp" },
  { name: "Promocash", link: "#", img: "ressources/image/promocash.png" },
  { name: "Regma", link: "#", img: "ressources/image/regma.png.webp" },
  { name: "Routier", link: "#", img: "ressources/image/routier.jpg.webp" },
  { name: "Securis Groupe", link: "#", img: "ressources/image/securisgroupe.png.webp" },
  { name: "SGOF", link: "#", img: "ressources/image/sgofpng.webp" },
  { name: "Siehr", link: "#", img: "ressources/image/siehr.png.webp" },
  { name: "SMG Groupe", link: "#", img: "ressources/image/smggroupe.png.webp" },
  { name: "Sovec", link: "#", img: "ressources/image/sovec.jpg.webp" },
  { name: "Technichauffe", link: "#", img: "ressources/image/technichauffe.png" },
  { name: "Vaudin", link: "#", img: "ressources/image/vaudin.jpg.webp" }
];

closeSponsorsBtn.onclick = () => { sponsorsModal.style.display = 'none';}

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
  const hasVisited = sessionStorage.getItem("visited");
  if(!hasVisited){ 
    document.getElementById('sponsors-modal').style.display = 'flex';
    const randomSponsor = sponsors[Math.floor(Math.random() * sponsors.length)];

    // insert HTML
    document.querySelector(".sponsors").innerHTML = `
      <a href="${randomSponsor.link}" target="_blank">
        <img src="${randomSponsor.img}" alt="${randomSponsor.name}">
      </a>
    `;
    sessionStorage.setItem("visited", "true");
  }
  
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
  query.descending("date");

  const User = Parse.Object.extend("_User");
  const userQuery = new Parse.Query(User);
  userQuery.descending("point");

  try {
    const matches = await query.find();

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

      if (betwinner === undefined && diffHours <= 48 && diffHours >= 0) {
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

        }else if(betwinner.id === currentUser.id){
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

        }else if(betwinner.id !== currentUser.id){
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
        } 

        const button = matchDiv.querySelector('.match-button');
        button.addEventListener('click', (e) => {
          e.preventDefault();
          sessionStorage.setItem('matchId', match.id);
          window.location.href = 'result.html?matchId=' + match.id;
        });
      }
      matchContainer.appendChild(matchDiv);
    });

    const users = await userQuery.find();
    const classementContainer = document.getElementById('classement-container');

    users.forEach((user, index) => {
      const username = user.get("firstName") + " " + user.get("lastName").charAt(0) + ".";
      const userDiv = document.createElement('div');
      userDiv.classList.add('classement-item');

      let rankDisplay = '';
      if (index === 0) {
      rankDisplay = '🥇'; // U+1F947
      } else if (index === 1) {
      rankDisplay = '🥈'; // U+1F948
      } else if (index === 2) {
      rankDisplay = '🥉'; // U+1F949
      } else {
      rankDisplay = index + 1 + "."; // Display rank number for others
      }

      userDiv.innerHTML = `
      <div class="classement">
      <div class="classement-content">
        <div class="classement-user">${rankDisplay} ${username}</div>
        <div class="classement-point">${user.get('point')}</div>
      </div>
      </div>
      `;

      // Apply font-weight: 600 to the current user
      if (user.id === Parse.User.current().id) {
      userDiv.querySelector('.classement-user').style.fontWeight = '600';
      }

      classementContainer.appendChild(userDiv);
    });

  } catch (err) {
    console.error('Erreur Parse:', err);
  }
})

const centralSectionBet = document.getElementById('central-section-bet');
const centralSectionClassement = document.getElementById('central-section-classement');

document.getElementById('slider-bet-btn').addEventListener('click', () => {
  document.getElementById('indicator').style.left = '0';
  centralSectionClassement.style.display = 'none';
  centralSectionBet.style.display = 'block'; 
});

document.getElementById('slider-classement-btn').addEventListener('click', () => {
  document.getElementById('indicator').style.left = '50%';
  centralSectionBet.style.display = 'none';
  centralSectionClassement.style.display = 'block';
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