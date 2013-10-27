#!/usr/bin/env bash
set -e

cd `dirname $0`

info() { echo -e "\033[1;32m:) $1\033[0m"; }
warn() { echo -e "\033[1;33m:| $1\033[0m"; }
fail() {
	echo -e "\033[1;31m:( $1\033[0m";
	exit 1
}

if [ ! $# -eq 1 ]; then
	info "Bruk: ./app.sh [start|stop|status]"
	exit 1
fi

cmd=$1
if [[ $cmd != "start" && $cmd != "stop" && $cmd != "status" ]]; then
	fail "Kjenner ikke kommandoen '$cmd'. mente du 'start' eller 'stop'?"
fi

if [ $cmd = "status" ]; then
	pidfile=pid
	if [ -f $pidfile ]; then
		pid=`cat $pidfile`
		info "Kjører (med PID $pid)"
	else
		warn "Det ser ikke ut til at appen kjører"
	fi
fi

if [ $cmd = "start" ]; then
	props="/home/javabin/web/api-app/jz-api.properties"
	logs="/home/javabin/web/api-app/logs"
	java -DpropertyFile=$props -DlogDirectory=$logs -jar current/awazone.jar 2>> logs/error.log >> logs/server.log &
	PID=$!
	echo $PID > pid
	info "Startet app med PID $PID"
	tail -n 0 -f logs/server.log
fi

if [ $cmd = "stop" ]; then
	pidfile=pid
	if [ -f $pidfile ]; then
		PID=`cat $pidfile`
		kill $PID
		rm $pidfile
		info "Stoppet app med PID $PID"
	else
		warn "Fant ikke PID-fil. Ser ikke ut til at appen kjører."
	fi
fi
