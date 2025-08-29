# Utiliser l'image Nginx officielle, légère
FROM nginx:alpine

# Copier tout le contenu du projet dans le dossier web de Nginx
COPY . /usr/share/nginx/html

# Supprimer le fichier de configuration par défaut de Nginx (optionnel)
RUN rm /etc/nginx/conf.d/default.conf

# Ajouter notre configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80 (HTTP)
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
