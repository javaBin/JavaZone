#!/bin/bash -e
#
# Install/update all npm packages
#

# Change dir
BASEDIR=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
cd ${BASEDIR}

npm install http-proxy@0.9.0 colors

cd ../frontend/scripts

npm install underscore semver colors shelljs css glob