# WebGoogleCloud


## Opzetten van node js application in google cloud

- In je cloud platform enable je google cloud vision API
- In je cloud platform maak je firebase aan, met als collection "guesses"

Clone dit project en maak een .env bestand aan met je Google Cloud Vision API Key, en maak serviceAccount.json file aan voor je firebase service account.

Test je project lokaal:
node start.js


## App Engine

Deploy je NodeJS applicatie via de app engine:
https://cloud.google.com/appengine/docs/standard/nodejs/quickstart

## Compute Engine
Maak een VM instantie aan.

Installeer git
sudo apt-get install git

Installeer NodeJS op vb. je linux distributie:
https://github.com/nodesource/distributions/blob/master/README.md


Clone de NodeJS app
vb.: git clone https://github.com/tomptrs/WebGoogleCloud

Voeg een serviceAccount.json en .env bestand toe:
(serviceAccount voor firebase => aanmaken in firestore console) (.env bewaar je de key voor je google cloud vision API: VISION_KEY = xxxxxxxx)
=> Aanmaken van deze bestanden op je linuxdistributie door vb. sudo vi serviceAccount.json (afsluiten door ESC => :wq!)




=================================================================================================================================================