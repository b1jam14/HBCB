var winner=null;

Parse.initialize("dsosX49CI2Sb3fAskvraQl4zuSUsqmGr46cKNTKJ", "iHTYhrd7UsGulkqoyppRb1kemD4Vl26ti7GxJn0S"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = "https://parseapi.back4app.com/";

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

async function securePageLoad(page) {
  try {
    await Parse.Cloud.run("checkPageAccess", { page: page });
    console.log("Access granted to", page);
  } catch (error) {
    console.error("Access denied:", error.message);
    window.location.href = "connexion.html";
  }
}


function updateTeam(team) {
  const playerContainer = document.getElementById("playerContainer");
  const select = document.createElement("select");
  select.name = "bestscorer";
  select.id = "bestscorer";
  let equipe = [];
  if (team && team.includes("SM")) {
    equipe = [
      "BAUMERT ANTONIN",
      "BERGMILLER NATHAN",
      "BERNHARD LUCAS",
      "BOEHM THOMAS",
      "BOEHM HUGO",
      "BORTIER THIBAUT",
      "BRIGEL HERVE",
      "DREYER GUILLAUME",
      "DREYER RAPHAEL",
      "DREYER AYMERIC",
      "FELTIN VINCENT",
      "FORGES LUCAS",
      "FRETARD MARTIN",
      "FRIEDRICH CEDRIC",
      "GARCIA MAXIME",
      "GAUTREAU KEVIN",
      "GOMELET XAVIER",
      "HAAS CHRISTIAN",
      "HOFFMANN MICKAEL",
      "HORNECKER ARNAUD",
      "HUNTZINGER GUILLAUME",
      "IDRISSI BRAHIM",
      "JANKOWSKI YOHAN",
      "JANKOWSKI ROMAIN",
      "KIEFFER DENIS",
      "KNAB ADRIEN",
      "KOCH VINCENT",
      "KORDIAN CYRIL",
      "KORDIAN THOMAS",
      "KRUCH TRISTAN",
      "LAFAYE STEPHANE",
      "LANDMANN THIERRY",
      "LUCK MATHIEU",
      "MARSON REMI",
      "MARTIN HUGO",
      "MEGLEN ARTHUR",
      "METZGER KEVIN",
      "METZGER JONATHAN",
      "MEYER GREGOIRE",
      "MILLIET VOLODIA",
      "NIEDERMEYER YANN",
      "PALEE GEOFFROY",
      "PASQUER WILFRIED",
      "PASTORE DAMIEN",
      "PERIN VICTOR",
      "POIROT ALEXANDRE",
      "ROCZANOV HUGO",
      "SAHIN SELAHATTIN",
      "SCHLACHTER MARC",
      "SCHOENDORF ARTHUR",
      "SELLINI CEDRIC",
      "SIMOES NUNO",
      "SOMMER MATHIEU",
      "SOMMER THOMAS",
      "SPRENG NICOLAS",
      "TRAPPLER MICHEL",
      "TRAUTTMANN BENJAMIN",
      "VAUDIN JORDAN",
      "VAUDIN CYRIL",
      "WEHRLE GERARD",
      "WEYMANN AMAURY",
      "WILHELM BERTRAND",
      "WILHELM LEO",
      "WODLING ALEXIS",
      "ZOLVER BENJAMIN",
      "ZOLVER NICOLAS"
    ];
    
  }else if (team && team.includes("SF")) {
    equipe = [
      "ANDRES CHRISTELLE",
      "BARRIERE-VARJU LISA",
      "BAUMERT LUCIE",
      "BONJEAN LEONIE",
      "BOTTEMER JULIE",
      "BOUCHER CLEMENCE",
      "BOUCHER JULIETTE",
      "BULUT ACELYA",
      "BUSTOS AXELLE",
      "CARAYOL CELINE",
      "DORSCH CLARA",
      "DREYFUS SOPHIE",
      "DUREY MARION",
      "FELTIN EMMA",
      "GHENZI CHRISTELLE",
      "GILBERT ANAIS",
      "HOFFER MANON",
      "HUBRECHT ALYSSA",
      "KNAB ALEXIE",
      "KUNTZ MAUREEN",
      "KUNTZ SOLENE",
      "MARIN ELODIE",
      "MATHMANN CAPUCINE",
      "MEYER MEI",
      "NEUROHR MORGANE",
      "RUHM MANON",
      "SAHIN VALERIE",
      "SCHLEIFFER CHARLEN",
      "SCHWALLER SAHIN MANON",
      "TREMBLAY LISON",
      "VAUDELET ALICE",
      "WEISS LUCILE"
    ];
  }else if (team && team.includes("U18")) {
    equipe = [
      "ANDRES LIAM",
      "BALTHAZARD AYMERIC",
      "BRONNER THEO",
      "CHARTIER THOMAS",
      "CLIN HUGO",
      "CNAPELYNCK TRISTAN",
      "DEBERT-ROY VALENTIN",
      "DUFOUR ENZO",
      "FERNANDEZ TOM",
      "FISCHER BRAUD ETHAN",
      "FLORENTIN ADAM",
      "GALLAIS MATHYS",
      "GEISSEL THOMAS",
      "HERBSTER GUSTAVE",
      "HERZOG RAPHAEL",
      "HIRSCHMULLER TRISTAN",
      "LAUSECKER ALEX",
      "MARCHANDON MELVILLE",
      "MULLER JOHANN",
      "PFEFFER SIMON",
      "PFEIFFER MAXIME",
      "PHILIPP ANTOINE",
      "QUERELLE ANAEL",
      "REBER TIMOTHEE",
      "SCHMITT ROBIN",
      "SCHOTT ANDI",
      "SCHUH BENJAMIN",
      "SENSENBRENNER LOUIS",
      "SOLDA ANIS",
      "SPRENG MATHEO",
      "STANISIERE ELOI",
      "URBAN ETHAN",
      "WARRING EVAN",
      "WEINMANN ANTOINE"
    ];
  }else if (team && team.includes("U15M")) {
    equipe = [
      "BALTHAZARD THOMAS",
      "BAUER QUENTIN",
      "DEBERT-ROY ANTOINE",
      "FORTON MATHYS",
      "HELBERT-RANCHON CHARLIE",
      "LAFAYE JULIEN",
      "MARSIGLIO THEO",
      "MEYER VICTOR",
      "MEYER LEO",
      "MONTAUDIE JACQUES",
      "POIROT-LAEGER TIMAO",
      "SCHLEIFFER RUBEN",
      "SCHMITT ARTHUR",
      "SCHWALLER SAHIN LOUIS",
      "SENGCHANH TIMEO",
      "WILHELM SAMUEL"
    ];    
  }else if (team && team.includes("U15F")) {
    equipe = [
      "BALSALOBRE LOLA",
      "BULUT DILARA",
      "DOUSSEAU LUCIE",
      "GALEA LISE",
      "KENNEL HERRMANN HANAE",
      "METZ ZOE",
      "SOUMANN EVA",
      "STANISIERE MAHAUT",
      "WEINMANN EMMA-LINE"
    ]; 
  }else if (team && team.includes("U13")) {
    equipe = [
      "BEDIOU GASTON",
      "BICHWILLER TIMEO",
      "DECHRISTE ROMAN",
      "DILLENSCHNEIDER SAMUEL",
      "GOMELET LEON",
      "HEILIGENSTEIN HUGO",
      "KLEIN CLEMENT",
      "MAITRE GUILLAUME",
      "MARTINELLE MARIE",
      "MATHE GROSSE CHARLIE",
      "MONTAUDIE MARTIN",
      "OFFNER RALPH",
      "PALEE LOUISA",
      "PETITJEAN RENAUD",
      "RENOUD LEANDRO",
      "STACHOWIAK AUBIN",
      "WILHELM GABRIEL"
    ];    
  }else if (team && team.includes("U11")) {
    equipe = [
      "ALEV SAUER SACHA",
      "BLAISE ZOE",
      "BORN MATEI",
      "BORTIER LOUISE",
      "CLAUSS AUGUSTIN",
      "ESSLINGER NATHAN",
      "GUEGUEN LAURE",
      "HEILIGENSTEIN ROBIN",
      "HERR DARIO",
      "JUNG LISON",
      "KEDZIERSKI STEGER MARCEAU",
      "KLEMKE JOHAN",
      "LUCK ESTEBAN",
      "MARSIGLIO HUGO",
      "MEYER ANATOLE",
      "MEYER EMMA",
      "MUNCH LUCKA",
      "NICOT MARTIN",
      "OBRECHT SASHA",
      "PASQUER ELRICK",
      "SCHAFF LEON",
      "TROMBELLA ENZO",
      "WEBER GOEMINNE VICTORIA"
    ];    
  }
  equipe.forEach(player => {
    const option = document.createElement("option");
    option.value = player;
    option.textContent = player;
    select.appendChild(option);
  });
  playerContainer.innerHTML = "";
  playerContainer.appendChild(select);
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

document.getElementById('button-bet').addEventListener('click', async function () {
  const scoreteam1 = parseInt(document.getElementById('score-select1').value, 10);
  const scoreteam2 = parseInt(document.getElementById('score-select2').value, 10);
  const bestscorer = document.getElementById('bestscorer').value;
  const matchId = getQueryParam('matchId');

  if (isNaN(scoreteam1) || isNaN(scoreteam2)) {
    alert('Les scores doivent être des nombres valides.');
    return;
  }

  if (scoreteam1 === undefined || scoreteam2 === undefined || !bestscorer || !matchId) {
    alert('Merci de remplir tous les champs.');
    return;
  }
  console.log("Données du pari :", { matchId, scoreteam1, scoreteam2, bestscorer, winner });
  try {
    const result = await Parse.Cloud.run("saveBet", {
      matchId: matchId,
      scoreteam1: scoreteam1,
      scoreteam2: scoreteam2,
      bestscorer: bestscorer
    });

    window.location.href = 'main.html';

  } catch (error) {
    console.error("Erreur Cloud Function:", error);
    alert(" Échec de l'enregistrement du pari. Voir la console pour plus de détails.");
  }
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


  const matchId = getQueryParam('matchId');
  try {
    const user = await  Parse.User.current(); // utilisateur connecté
    if (!user) return;

    const Games = Parse.Object.extend("Games");
    
    // 1️⃣ Fetch the match directly by its ID
    const gameQuery = new Parse.Query(Games);
    const match = await gameQuery.get(matchId);

    // 2️⃣ Update the button text
    document.getElementById('button-team2').textContent = match.get("adversaire");

    updateTeam(match.get("team"));

    // 3️⃣ Optionally, fetch the user's bet if needed
    const Bets = Parse.Object.extend("Bets");
    const betQuery = new Parse.Query(Bets);
    betQuery.equalTo("matchId", match);
    betQuery.equalTo("userId", Parse.User.current());
    const userBet = await betQuery.first();

    console.log("Pari utilisateur récupéré :", userBet);
      

    if (userBet) {
      const winnerValue = userBet.get("winner");
      console.log("Valeur du gagnant récupérée :", winnerValue);

      // Mettre à jour les couleurs des boutons selon le gagnant
      if (winnerValue === 'team1') {
        document.getElementById('button-team1').style.backgroundColor = '#4075d7';
        document.getElementById('button-team1').style.color = 'white';
        document.getElementById('button-tie').style.backgroundColor = 'white';
        document.getElementById('button-tie').style.color = '#818181';
        document.getElementById('button-team2').style.backgroundColor = 'white';
        document.getElementById('button-team2').style.color = '#b30000';
      } else if (winnerValue === 'draw') {
        document.getElementById('button-team1').style.backgroundColor = 'white';
        document.getElementById('button-team1').style.color = '#4075d7';
        document.getElementById('button-tie').style.backgroundColor = '#818181';
        document.getElementById('button-tie').style.color = 'white';
        document.getElementById('button-team2').style.backgroundColor = 'white';
        document.getElementById('button-team2').style.color = '#b30000';
      } else { // 'team2'
        document.getElementById('button-team1').style.backgroundColor = 'white';
        document.getElementById('button-team1').style.color = '#4075d7';
        document.getElementById('button-tie').style.backgroundColor = 'white';
        document.getElementById('button-tie').style.color = '#818181';
        document.getElementById('button-team2').style.backgroundColor = '#b30000';
        document.getElementById('button-team2').style.color = 'white';
      }

      // Remplir les champs du pari
      document.getElementById('score-select1').value = userBet.get("scoreteam1");
      document.getElementById('score-select2').value = userBet.get("scoreteam2");
      document.getElementById('bestscorer').value = userBet.get("bestscorer");
      document.getElementById('button-bet').textContent = 'Modifier le pari';
    }

  } catch (error) {
      console.error("Erreur Parse:", error);
      //window.location.href = 'main.html';
  }
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
