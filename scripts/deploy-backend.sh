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

ask "Til test eller prod? [test]"
ENV=$(_readWithDefault "test")

if [ ! -f $JAR ]; then
	fail "Fant ikke $JAR :("
fi

if [ $ENV != "test" -a $ENV != "prod" ]; then
	fail "Miljø må være enten 'test' eller 'prod'"
fi

info "Deployer til $ENV med versjon $VERSION med jar $JAR"

BASE="~/web/api-app/$ENV"
ssh javabin@javazone.espenhh.com "mkdir -p $BASE/$VERSION"
scp $JAR javabin@javazone.espenhh.com:$BASE/$VERSION/awazone.jar
ssh javabin@javazone.espenhh.com "ln -s -f $VERSION -T $BASE/current"
ssh javabin@javazone.espenhh.com "~/web/api-app/app.sh stop $ENV"
ssh javabin@javazone.espenhh.com "~/web/api-app/app.sh start $ENV"
