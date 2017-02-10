#!/usr/bin/env sh
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

HOST=$(cat host)
curl $HOST/__ctl/reset

