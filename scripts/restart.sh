#!/usr/bin/env bash
HOST=$(cat host)
curl $HOST/__ctl/restart

