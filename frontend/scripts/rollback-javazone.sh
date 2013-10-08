#!/bin/bash
echo -e "\033[33m"
echo "                           _|  _|  _|                            _|        "
echo "       _|  _|_|    _|_|    _|  _|  _|_|_|      _|_|_|    _|_|_|  _|  _|    "
echo "       _|_|      _|    _|  _|  _|  _|    _|  _|    _|  _|        _|_|      "
echo "       _|        _|    _|  _|  _|  _|    _|  _|    _|  _|        _|  _|    "
echo "       _|          _|_|    _|  _|  _|_|_|      _|_|_|    _|_|_|  _|    _|  "
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
	JZ_SERVER="javabin@test.javazone.no"
	JZ_SERVER_ROOT="/home/javabin/web/jz13/test"
elif [ $1 == "prod" ]; then
	echo "Bekreft rollback i prod ved å skrive 'p-r-o-d-u-k-s-j-o-n' uten bindestrekene"
	read ans
	if [ $ans = "produksjon" ]
	then
		echo "Flott! :)"
	else
		echo "Feil token. Avbryter."
		exit $E_BADARGS	
	fi
	JZ_SERVER="javabin@test.javazone.no"
	JZ_SERVER_ROOT="/home/javabin/web/jz13/prod"
else
	echo "Ugyldig miljø. Bruk en av [prod/test]"
	exit $E_BADARGS
fi

fancymessage "TILGJENGELIGE VERSJONER VI KAN RULLE TILBAKE TIL:"
ssh $JZ_SERVER 'cd '$JZ_SERVER_ROOT'; ls -la'

fancymessage "Skriv inn mappe du vil rulle tilbake til:"
read ROLLBACK_FOLDER

fancymessage "RULLER TILBAKE TIL VERSJON $ROLLBACK_FOLDER"
ssh $JZ_SERVER 'cd '$JZ_SERVER_ROOT'; ln -sfn' $ROLLBACK_FOLDER 'current'

fancymessage "FILSYSTEMET SER NÅ SLIK UT:"
ssh $JZ_SERVER 'cd '$JZ_SERVER_ROOT'; ls -la'

fancymessage "FERDIG :)"
