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

echo ""
echo ""
echo ""
echo "       __                                 ___         "
echo "      (_ _|_ _  ___|_ _ _|_     | _     _  _/ _ __  _ "
echo "      __) |_(_| |  |_(/_ |_   \_|(_|\_/(_|/__(_)| |(/_"
echo ""
echo ""
echo "      HJELP: "
echo ""
echo "      Bytte mellom screens:  F1-F12"
echo "      Restarte en screen:    ctrl-c, enter, r"
echo "      Starte en ny screen:   ctrl-x, c"
echo "      Lukke en screen:       ctrl-x, k"
echo "      Kille hele shiten:     ctrl-x, q"
echo ""
echo "      For å scrolle: "
echo "        - ctrl-x, deretter escape. "
echo "        - Pil opp/ned, evt fn + pil opp/ned scroller. "
echo "        - Esc for å avslutte"
echo ""
echo ""
echo ""
echo ""
echo "      That's it, folks :)"