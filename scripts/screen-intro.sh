#!/bin/bash

BASEDIR=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

# resolve symlinks
while [ -h "$BASEDIR/$0" ]; do
    DIR=$(dirname -- "$BASEDIR/$0")
    SYM=$(readlink $BASEDIR/$0)
    BASEDIR=$(cd $DIR && cd $(dirname -- "$SYM") && pwd)
done
cd ${BASEDIR}


# --------------------------------------

echo 
echo  "Startet DIGIPOST SCREEN BONANZA"
echo ""
echo "Bytte mellom screens:  F1-F12"
echo "Restarte en screen:    ctrl-c, enter, r"
echo "Starte en ny screen:   ctrl-x, c"
echo "Lukke en screen:       ctrl-x, k"
echo "Kille hele shiten:     ctrl-x, q"
echo ""
echo "For å scrolle: ctrl-x, esc. Pil opp/ned, evt fn + pil opp/ned. Esc for å avslutte"
echo ""
echo  "Dette vinduet er ditt, gjør hva du vil med det ;)"
echo 
echo "Husk å skrive passord i SOSM-vinduet (inntil videre må vi det ...)"
