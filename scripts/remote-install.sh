#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR


HOST=$(cat scripts/host)
curl $HOST/__ctl/npmi