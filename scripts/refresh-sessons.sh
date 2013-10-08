#!/usr/bin/env bash
set -e

LOGS="test/logs/refresher"
wget -O - http://test.jz13.java.no/api/sessions/refresh 2> $LOGS/stderr.log 1>> $LOGS/stdout.log

#LOGS="prod/logs/refresher"
#wget -O - http://prod.jz13.java.no/api/sessions/refresh 2> $LOGS/stderr.log 1>> $LOGS/stdout.log
