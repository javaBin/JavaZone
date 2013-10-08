#!/bin/bash
echo -e "\033[33m"
echo "                                                                                              "
echo "                _/                                  _/_/_/_/_/                                "
echo "               _/    _/_/_/  _/      _/    _/_/_/        _/      _/_/    _/_/_/      _/_/     "
echo "              _/  _/    _/  _/      _/  _/    _/      _/      _/    _/  _/    _/  _/_/_/_/    "
echo "       _/    _/  _/    _/    _/  _/    _/    _/    _/        _/    _/  _/    _/  _/           "
echo "        _/_/      _/_/_/      _/        _/_/_/  _/_/_/_/_/    _/_/    _/    _/    _/_/_/      "
echo -e "\033[0m"


function fancymessage {
	echo ""
	echo -e "\033[32m-->" $1 "\033[0m"
}

BASEDIR=$(dirname $0)
cd $BASEDIR/..

## Sjekk riktig parametere
EXPECTED_ARGS=1
E_BADARGS=65
if [ $# -ne $EXPECTED_ARGS ]
then
  echo "Usage: `basename $0` {miljø} [prod/test]"
  exit $E_BADARGS
fi

## Sett opp variabler for riktig miljø
if [ $1 == "test" ]; then
	JZ_SERVER="javabin@176.58.113.146"
	JZ_SERVER_ROOT="/home/javabin/web/jz13/test"
	JZ_KEEP_OLD_PACKAGES_FOR_MINUTES=86400 # 60 dager
	JZ_CHECK_PACBOT=false
elif [ $1 == "prod" ]; then
	echo "Bekreft deploy til prod ved å skrive 'p-r-o-d-u-k-s-j-o-n' uten bindestrekene"
	read ans
	if [ $ans = "produksjon" ]
	then
		echo "Flott! :)"
	else
		echo "Feil token. Avbryter."
		exit $E_BADARGS
	fi
	JZ_SERVER="javabin@176.58.113.146"
	JZ_SERVER_ROOT="/home/javabin/web/jz13/prod"
	JZ_KEEP_OLD_PACKAGES_FOR_MINUTES=86400 # 60 dager
	JZ_CHECK_PACBOT=true
else
	echo "Ugyldig miljø. Bruk en av [prod/test]"
	exit $E_BADARGS
fi
JZ_NEW_FOLDER=`date +%s`

fancymessage "Deployer til  $JZ_SERVER, mappe $JZ_SERVER_ROOT/$JZ_NEW_FOLDER"

fancymessage "BYGGER PACBOT"
rm -r public
./scripts/build.sh

fancymessage "LAGER PAKKE"
cd public
zip javazone.zip * -r > /dev/null

fancymessage "SJEKKER AT PAKKING GIKK BRA"
if [ ! -f javazone.zip ]
then
    echo "Error: javazone.zip does not exist, exiting."
    exit $E_BADARGS
fi

fancymessage "OVERFØRER PAKKE"
scp javazone.zip $JZ_SERVER:$JZ_SERVER_ROOT

fancymessage "DEPLOYER"
ssh $JZ_SERVER 'cd '$JZ_SERVER_ROOT'; unzip javazone.zip -d' $JZ_NEW_FOLDER '> /dev/null; ln -sfn' $JZ_NEW_FOLDER 'current; rm javazone.zip'

fancymessage "SLETTER PAKKER SOM ER MER ENN $JZ_KEEP_OLD_PACKAGES_FOR_MINUTES MINUTTER GAMLE"
ssh $JZ_SERVER 'cd '$JZ_SERVER_ROOT'; for i in `find . -maxdepth 1 -type d -mmin +'$JZ_KEEP_OLD_PACKAGES_FOR_MINUTES' \( ! -name . \) \( ! -name .. \) -print`; do echo -e "Deleting directory $i";rm -rf $i; done'

fancymessage "FERDIG :)"
