document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const id = document.getElementById('id').value;
  const pw = document.getElementById('pw').value;

  fetch('ressources/data/user.json')
      .then(response => response.json())
      .then(users => {
        const user = users.find(u => u.id === id && u.password === pw);
        if (user) {
          sessionStorage.setItem('userId', id);
          sessionStorage.setItem('userName', user.name);
          sessionStorage.setItem('userPoint', user.point);
            if (id === "0001") {
              window.location.href = 'admin';
            } else {
              window.location.href = 'main?sponsors=true';
            }
        } else {
          document.getElementById('error').textContent = 'Identifiant ou mot de passe incorrect.';
        }
      })
      .catch(error => {
        console.error('Erreur lors du chargement du fichier JSON:', error);
        alert('Erreur de connexion au fichier');
      });
});



//Modal
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('button-user');
  const modal = document.getElementById('user-modal');
  const closeBtn = document.getElementById('close-modal');

  // Afficher la fenêtre modale
  button.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'flex';
  });

  // Fermer la fenêtre
  closeBtn.addEventListener('click', () => modal.style.display = 'none');
});
