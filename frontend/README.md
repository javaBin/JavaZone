# JavaZone 2013

Dette repoet inneholder oppsettet for "statisk innhold" på JavaZone.no. Systemet er basert på pacman! :)

---

## Oppsett

Installer node.js:

    http://nodejs.org/

Installer pacman:

    $ npm install pacman -g

---

## Bruk

### Utviklingsmodus

    $ ./scripts/dev.sh

### Deploy

Sørg for at du har SSH-tilgang før du gjør dette, ellers funker det "inte alls!" (snakk med noen i JavaBin)

    $ ./scripts/deploy-javazone.sh [prod/test]

### Rollback

    $ ./scripts/rollback-javazone.sh [prod/test]
