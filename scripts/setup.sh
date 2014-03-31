#!/bin/bash -e
#
# Install/update all npm packages
#

# Change dir
BASEDIR=$(cd -P -- "$(dirname -- "$0")" && pwd -P)
cd ${BASEDIR}

cd ../frontend/scripts

npm install underscore semver colors shelljs css glob