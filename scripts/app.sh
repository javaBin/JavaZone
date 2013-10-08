#!/usr/bin/env bash
set -e

cd `dirname $0`

info() { echo -e "\033[1;32m:) $1\033[0m"; }
warn() { echo -e "\033[1;33m:| $1\033[0m"; }
fail() {
	echo -e "\033[1;31m:( $1\033[0m";
	exit 1
}

if [ ! $# -eq 2 ]; then
	info "Bruk: ./app.sh [start|stop|status] [test|prod]"
	exit 1
fi

env=$2
if [[ $env != "prod" && $env != "test" ]]; then
	fail "Kjenner ikke mijøet '$env'. mente du 'test' eller 'prod'?"
fi

cmd=$1
if [[ $cmd != "start" && $cmd != "stop" && $cmd != "status" ]]; then
	fail "Kjenner ikke kommandoen '$cmd'. mente du 'start' eller 'stop'?"
fi

if [ $cmd = "status" ]; then
	pidfile=$env/pid
	if [ -f $pidfile ]; then
		pid=`cat $pidfile`
		info "$env kjører (med PID $pid)"
	else
		warn "Det ser ikke ut til at $env kjører"
	fi
fi

if [ $cmd = "start" ]; then
	props="/home/javabin/web/api-app/$env/$env.properties"
	logs="/home/javabin/web/api-app/$env/logs"
	java -DpropertyFile=$props -DlogDirectory=$logs -jar $env/current/awazone.jar 2>> $env/logs/error.log >> $env/logs/server.log &
	PID=$!
	echo $PID > $env/pid
	info "Startet app med PID $PID i $env"
	tail -n 0 -f $env/logs/server.log
fi

if [ $cmd = "stop" ]; then
	pidfile=$env/pid
	if [ -f $pidfile ]; then
		PID=`cat $pidfile`
		kill $PID
		rm $pidfile
		info "Stoppet app med PID $PID i $env"
	else
		warn "Fant ikke PID-fil. Ser ikke ut til at appen kjører."
	fi
fi
