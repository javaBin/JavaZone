#!/bin/bash

BASEDIR=$(cd -P -- "$(dirname -- "$0")" && pwd -P)

# resolve symlinks
while [ -h "$BASEDIR/$0" ]; do
    DIR=$(dirname -- "$BASEDIR/$0")
    SYM=$(readlink $BASEDIR/$0)
    BASEDIR=$(cd $DIR && cd $(dirname -- "$SYM") && pwd)
done
cd ${BASEDIR}

cd ../backend

# --------------------------------------

set -e

yellow() { echo -e "\033[33m$1\033[0m"; }
green() { echo -e "\033[32m$1\033[0m"; }
red() { echo -e "\033[31m$1\033[0m"; }
bold() { echo -e "\033[1;37m$1\033[0m"; }
_fancymessage() {
  echo ""
  green "\033[32m--> $1 \033[0m"
}

info() { bold "$1"; }
ask() { _fancymessage "$1"; }
fail() { red "$1"; exit 1; }

# read -i funker ikke på OSX - derav mer kronglete løsning :(
_readWithDefault() {
    local default=$1
    read answer
    if [ "$answer" = "" ]; then
         answer="$default"
    fi
    echo $answer
}

info "BYGGER"
mvn package

yellow ""
yellow "  deployer"
yellow ""
yellow "      #  ######            ##    #####   #"
yellow "      #      #            #  #   #    #  #"
yellow "      #     #    #####   #    #  #    #  #"
yellow "      #    #             ######  #####   #"
yellow " #    #   #              #    #  #       #"
yellow "  ####   ######          #    #  #       #"
yellow ""

DEFAULT_JAR=`find . | grep dependencies.jar`
DEFAULT_VERSION=`date +%Y%m%d%H%M%S`-SNAPSHOT

ask "Hvor ligger jar-filen? [$DEFAULT_JAR]"
JAR=$(_readWithDefault $DEFAULT_JAR)

ask "Hvilken versjon? [$DEFAULT_VERSION]"
VERSION=$(_readWithDefault $DEFAULT_VERSION)

ask "Til dev, test eller prod? [dev]"
ENV=$(_readWithDefault "dev")

if [ ! -f $JAR ]; then
	fail "Fant ikke $JAR :("
fi

if [ $ENV != "dev" -a $ENV != "test" -a $ENV != "prod" ]; then
	fail "Miljø må være enten 'dev', 'test' eller 'prod'"
fi

if [ $ENV == "prod" ]; then
	HOST="2014.javazone.no"
	BASE="/home/javabin/web/2014/jz-backend"
elif [ $ENV == "dev" ]; then
	HOST="192.168.111.222"
	BASE="/home/javabin/web/2014/jz-backend"
elif [ $ENV == "test" ]; then
	HOST="test.2014.javazone.no"
	BASE="/home/javabin/web/2014/jz-backend"
else
	fail "Det du sa gav null mening!"
fi

info "Deployer til $EVN på $HOST:$BASE med versjon $VERSION med jar $JAR"

ssh javabin@$HOST "mkdir -p $BASE/$VERSION"
scp $JAR javabin@$HOST:$BASE/$VERSION/awazone.jar
ssh javabin@$HOST "ln -s -f $VERSION -T $BASE/current"
ssh javabin@$HOST "$BASE/jz-backend.sh stop"
ssh javabin@$HOST "$BASE/jz-backend.sh start"

