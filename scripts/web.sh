#/bin/bash
cd ../backend
PROPERTIES="$(pwd)/awazone.properties"

if [ ! -f $PROPERTIES ]
then
    echo "Filen $PROPERTIES finnes ikke. Fix it. :)"
    exit 1
fi

mvn exec:java -DpropertyFile=$PROPERTIES
