#!/bin/bash

BASEDIR=$(dirname $0)
cd $BASEDIR/..

source scripts/prelude.sh
pacman -d
