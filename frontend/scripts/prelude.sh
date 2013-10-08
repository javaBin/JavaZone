#!/bin/bash

_command_exists() {
    type "$1" &> /dev/null;
}

if ! _command_exists pacbot ; then
    echo "Install pacbot: $ sudo npm install pacbot -g"
    exit 2
fi

