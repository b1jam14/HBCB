var winner=null;
var betchanged=false;
var betId=null;

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

document.getElementById('button-team1').addEventListener('click', () => {
    document.getElementById('button-team1').style.backgroundColor = '#4075d7';
    document.getElementById('button-team1').style.color = 'white';
    document.getElementById('button-tie').style.backgroundColor = 'white';
    document.getElementById('button-tie').style.color = '#818181';
    document.getElementById('button-team2').style.backgroundColor = 'white';
    document.getElementById('button-team2').style.color = '#b30000';
    winner='bischo';
});

document.getElementById('button-tie').addEventListener('click', () => {
    document.getElementById('button-team1').style.backgroundColor = 'white';
    document.getElementById('button-team1').style.color = '#4075d7';
    document.getElementById('button-tie').style.backgroundColor = '#818181';
    document.getElementById('button-tie').style.color = 'white';
    document.getElementById('button-team2').style.backgroundColor = 'white';
    document.getElementById('button-team2').style.color = '#b30000';
    winner='tie';
});

document.getElementById('button-team2').addEventListener('click', () => {
    document.getElementById('button-team1').style.backgroundColor = 'white';
    document.getElementById('button-team1').style.color = '#4075d7';
    document.getElementById('button-tie').style.backgroundColor = 'white';
    document.getElementById('button-tie').style.color = '#818181';
    document.getElementById('button-team2').style.backgroundColor = '#b30000';
    document.getElementById('button-team2').style.color = 'white';
    winner='adversaire';
});

const selects = document.querySelectorAll('.score-select');
for (const select of selects) {
    for (let i = 0; i <= 100; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
    }
}

document.getElementById('button-bet').addEventListener('click', function () {
    const scoreteam1 = document.getElementById('score-select1').value;
    const scoreteam2 = document.getElementById('score-select2').value;
    const bestscorer = document.getElementById('bestscorer').value;

    if (!scoreteam1 || !scoreteam2 || !bestscorer || !winner) {
        alert('Merci de remplir tous les champs.');
    } else {
        if(betchanged){
            fetch('ressources/data/api.php?type=bet', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    action: 'BTDELETE',
                    id: betId
                })
            })
            .catch(console.error);
    }
 
    fetch('ressources/data/api.php?type=bet', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            action: 'POST',
            match: sessionStorage.getItem('matchId'),
            user: sessionStorage.getItem('userId'),
            name: sessionStorage.getItem('userName'),
            winner: winner,
            scoreteam1: scoreteam1,
            scoreteam2: scoreteam2,
            bestscorer: bestscorer
        })
    })
    .then(() => {
        window.location.href = 'main';
    })
    .catch(console.error);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    
    securePageLoad(window.location.pathname);

    /********************************************/
    /*        Fenetre modale utilisateur        */
    /********************************************/

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


    const matchId = getQueryParam('matchId');
    if (matchId !== '0') {
        fetch('ressources/data/api.php?type=match')
        .then(response => response.json())
        .then(result => {
        if (result.status === 'success') {
            const matches = result.data;
            const matchInfo = matches.find(m => m.id == matchId);
            document.getElementById('button-team2').textContent = matchInfo.adversaire;
        }
        });  
    }

    fetch('ressources/data/api.php?type=bet')
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                const bets = result.data;
                console.log(bets);
                if (bets.find(b => b.match == matchId && b.user == userId)) {
                    if (bets.find(b => b.winner == 'bischo')) {
                        document.getElementById('button-team1').style.backgroundColor = '#4075d7';
                        document.getElementById('button-team1').style.color = 'white';
                        document.getElementById('button-tie').style.backgroundColor = 'white';
                        document.getElementById('button-tie').style.color = '#818181';
                        document.getElementById('button-team2').style.backgroundColor = 'white';
                        document.getElementById('button-team2').style.color = '#b30000';
                        winner='bischo';
                    }else if (bets.find(b => b.winner == 'tie')) {
                        document.getElementById('button-team1').style.backgroundColor = 'white';
                        document.getElementById('button-team1').style.color = '#4075d7';
                        document.getElementById('button-tie').style.backgroundColor = '#818181';
                        document.getElementById('button-tie').style.color = 'white';
                        document.getElementById('button-team2').style.backgroundColor = 'white';
                        document.getElementById('button-team2').style.color = '#b30000';
                        winner='tie';
                    }else {
                        document.getElementById('button-team1').style.backgroundColor = 'white';
                        document.getElementById('button-team1').style.color = '#4075d7';
                        document.getElementById('button-tie').style.backgroundColor = 'white';
                        document.getElementById('button-tie').style.color = '#818181';
                        document.getElementById('button-team2').style.backgroundColor = '#b30000';
                        document.getElementById('button-team2').style.color = 'white';
                        winner='adversaire';
                    }
                    document.getElementById('score-select1').value = bets.find(b => b.match == matchId && b.user == userId).scoreteam1;
                    document.getElementById('score-select2').value = bets.find(b => b.match == matchId && b.user == userId).scoreteam2;
                    document.getElementById('bestscorer').value = bets.find(b => b.match == matchId && b.user == userId).bestscorer;
                    document.getElementById('button-bet').textContent = 'Modifier le pari';
                } 
                betchanged=true;
                betId=bets.find(b => b.match == matchId && b.user == userId)?.id;
            }
      }); 
});
