API for diverse ting til javazone.no
=======

## Utvikling lokalt

Du trenger maven.

Kopier filen mal.properties, fyll inn riktige properties (twitter OAuto token etc.), og legg den på rot av filsystemet (kalt /awezone.properties)

Kjør så opp appen med `./web.sh`

### Utvikling sammen med jz13-websidene på "samme domene"

Sjekk ut `https://github.com/Espenhh/jz13`, og start det med `pacman -d`

Start så denne serveren (`web.sh`)

Sy alt sammen med å starte `proxy` (kjør scriptet `proxy` herfra. du må ha node. Installer pakker først også: `npm install http-proxy colors`)

Nå kjører frontend på `localhost:8080`, og backend kjører på `localhost:8080/api/`. Den kjører også på IPen din (for mobilutvikling)

## Deploying

Stå i rotmappa og kjør deploy-scriptet:

	./deploy.sh

Scriptet prompter for *miljø*, *jar-fil* og *versjonsnavn*.

OBS: du må ha fått tilgang til serveren for å gjøre dette. Snakk med Espen, Kjetil eller Olav :)
