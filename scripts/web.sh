#/bin/bash

PROPERTIES="$(pwd)/awazone.properties"

if [ ! -f $PROPERTIES ]
then
    echo "Filen $PROPERTIES finnes ikke. Fix it. :)"
    exit 1
fi

cd awazone-web
mvn exec:java -DpropertyFile=$PROPERTIES
