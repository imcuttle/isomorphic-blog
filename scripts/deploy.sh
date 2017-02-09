#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
MSG="deploy script"
[ -n "$1" ] && MSG="$1"
BRANCH="master"
[ -n "$2" ] && BRANCH="$2"

cd ..
git add .
git commit -am "$MSG"
git push origin "$BRANCH"
#HOST=$(cat host)
#echo $HOST/__ctl/pull

#if [ $? = 0 ]; then
    HOST=$(cat scripts/host)
    curl $HOST/__ctl/pull
#fi