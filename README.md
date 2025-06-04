
# Extension Gopeed - Telegram Downloader

Cette extension permet de télécharger directement des fichiers Telegram (t.me/...) dans Gopeed.

## Fonctionnement
Elle utilise une API externe (serveur Flask ou Node.js) qui convertit un lien `t.me/...` en lien direct de fichier.

## Installation
1. Télécharge ce dossier sous forme de zip
2. Ouvre Gopeed > Extensions > Importer Extension > Choisir ce dossier
3. Active l’extension
4. Colle un lien t.me dans Gopeed et lance le téléchargement !

## Serveur requis
Le fichier `index.js` appelle une API hébergée à :
```
https://ton-api-flask.onrender.com/resolve-telegram
```
Change cette URL si tu héberges ton propre serveur.

## Crédits
By @KingSurf7 – Boosté avec Flask + Telegram API
